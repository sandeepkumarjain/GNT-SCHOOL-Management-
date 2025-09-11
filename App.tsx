
import React, { useState, createContext, useContext, ReactNode, useCallback, useEffect } from 'react';
import { SchoolDataProvider, useSchoolData } from './hooks/useSchoolData';
import AdminPanel from './components/AdminPanel';
import TeacherPanel from './components/TeacherPanel';
import ParentPanel from './components/ParentPanel';
import TeacherLogin from './pages/TeacherLogin';
import AdminLogin from './pages/AdminLogin';
import ParentLogin from './pages/ParentLogin';
import ForgotPassword from './pages/ForgotPassword';
import LoginSelector from './pages/LoginSelector';
import { Parent, Teacher, School } from './types';
import { SuperAdminProvider, useSuperAdmin } from './hooks/useSuperAdminData';
import SuperAdminLogin from './pages/SuperAdminLogin';
import SuperAdminPanel from './components/SuperAdminPanel';
import AdminForgotPassword from './pages/AdminForgotPassword';

// --- START: useDebounce Hook ---
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
// --- END: useDebounce Hook ---

// --- START: Notification System ---
export type ToastVariant = 'success' | 'error' | 'info' | 'warning';
export interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}
interface NotificationContextType {
  addToast: (message: string, variant: ToastVariant) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const ToastComponent: React.FC<{ toast: Toast; onDismiss: (id: number) => void; }> = ({ toast, onDismiss }) => {
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(() => onDismiss(toast.id), 300);
        }, 5000);
        return () => clearTimeout(timer);
    }, [toast.id, onDismiss]);

    const variantClasses = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500',
    };
    
    const icon = {
        success: '✓', error: '!', info: 'ℹ', warning: '⚠'
    }

    return (
        <div 
             className={`flex items-center text-white p-4 rounded-lg shadow-lg transition-all duration-300 transform ${exiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'} ${variantClasses[toast.variant]}`}
        >
            <span className="font-bold text-xl mr-3">{icon[toast.variant]}</span>
            <span>{toast.message}</span>
        </div>
    );
};

const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useContext(NotificationContext) as any;
    return (
        <div className="fixed top-5 right-5 z-[100] space-y-3 w-full max-w-sm">
            {toasts.map((toast: Toast) => (
                <ToastComponent key={toast.id} toast={toast} onDismiss={removeToast} />
            ))}
        </div>
    );
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    
    const removeToast = (id: number) => {
        setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
    };

    const addToast = useCallback((message: string, variant: ToastVariant) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, variant }]);
    }, []);

    return (
        <NotificationContext.Provider value={{ addToast, toasts, removeToast } as any}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotification must be used within a NotificationProvider');
    return context;
};
// --- END: Notification System ---


const AppRoutes: React.FC = () => {
    const { loggedInUser } = useSchoolData();
    const { superAdminLoggedIn } = useSuperAdmin();
    const [loginView, setLoginView] = useState<'selector' | 'admin' | 'teacher' | 'parent' | 'teacherForgotPassword' | 'adminForgotPassword' | 'superAdmin'>('selector');

    if (superAdminLoggedIn) {
        return <SuperAdminPanel />;
    }

    if (loggedInUser) {
        if (loggedInUser === 'admin') {
            return <AdminPanel />;
        }
        if ('childrenIds' in loggedInUser) {
            return <ParentPanel parent={loggedInUser as Parent} />;
        }
        if ('id' in loggedInUser && loggedInUser.id.startsWith('T-')) {
            return <TeacherPanel teacher={loggedInUser as Teacher} />;
        }
    }

    switch (loginView) {
        case 'admin':
            return <AdminLogin onBack={() => setLoginView('selector')} onForgotPassword={() => setLoginView('adminForgotPassword')} />;
        case 'teacher':
            return <TeacherLogin onBack={() => setLoginView('selector')} onForgotPassword={() => setLoginView('teacherForgotPassword')} />;
        case 'parent':
            return <ParentLogin onBack={() => setLoginView('selector')} />;
        case 'teacherForgotPassword':
            return <ForgotPassword onBack={() => setLoginView('teacher')} />;
        case 'adminForgotPassword':
            return <AdminForgotPassword onBack={() => setLoginView('admin')} />;
        case 'superAdmin':
            return <SuperAdminLogin onBack={() => setLoginView('selector')} />;
        case 'selector':
        default:
            return <LoginSelector onSelectRole={(role) => setLoginView(role)} />;
    }
};

const AppWrapper: React.FC = () => {
    const { superAdminLoggedIn, viewingSchoolAsAdmin } = useSuperAdmin();

    if (superAdminLoggedIn && viewingSchoolAsAdmin) {
        return (
            <SchoolDataProvider key={viewingSchoolAsAdmin.id} impersonatedSchool={viewingSchoolAsAdmin}>
                <AdminPanel isImpersonating={true} />
                <ToastContainer />
            </SchoolDataProvider>
        );
    }
    
    return (
        <SchoolDataProvider key="default-provider">
            <AppRoutes />
            <ToastContainer />
        </SchoolDataProvider>
    );
};


const App: React.FC = () => {
    return (
        <SuperAdminProvider>
            <NotificationProvider>
                 <AppWrapper />
            </NotificationProvider>
        </SuperAdminProvider>
    );
};

export default App;