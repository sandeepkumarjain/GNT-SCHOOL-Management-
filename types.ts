export interface SchoolSettings {
    name: string;
    logo: string | null;
    contact: string;
    address: string;
    gstin: string;
}

export interface Student {
    id: string; // e.g., STD1-001
    name: string;
    parentName: string;
    contactNumber: string;
    class: string;
    rollNumber: number;
    totalFees: number;
    feesPaid: number;
    status: 'active' | 'relieved';
    dob?: string; // Date of Birth
}

export interface Teacher {
    id: string;
    name: string;
    mobileNumber: string;
    email: string;
    address: string;
    fatherSpouseName: string;
    qualification: string;
    dob: string;
    dateOfJoining: string;
    salary: number;
    subjects: string[];
    assignedClasses: string[];
    isClassTeacher: boolean;
    classTeacherOf?: string;
    password?: string;
    status: 'active' | 'relieved';
}

export interface Staff {
    id: string;
    name: string;
    mobileNumber: string;
    fatherSpouseName: string;
    dob: string;
    dateOfJoining: string;
    department: string;
    salary: number;
    status: 'active' | 'relieved';
}

export interface FeeRecord {
    id: string;
    studentId: string;
    amount: number;
    paymentMethod: 'Cash' | 'UPI' | 'Bank Transfer';
    date: string;
    receiptNumber: string;
}

export interface AttendanceRecord {
    date: string;
    class: string;
    absentStudents: string[]; // array of student IDs
}

export interface TeacherAttendanceRecord {
    date: string;
    absentTeachers: string[]; // array of teacher IDs
}

export interface StaffAttendanceRecord {
    date: string;
    absentStaff: string[]; // array of staff IDs
}


export interface PayrollRecord {
    id: string; // e.g., PAY-T-001-2024-08
    employeeId: string; // teacherId or staffId
    employeeType: 'Teacher' | 'Staff';
    month: number; // 1-12
    year: number;
    baseSalary: number;
    deductions: number; 
    netSalary: number;
    status: 'Paid' | 'Unpaid';
    paymentMethod?: 'Bank Transfer' | 'Cash' | 'Cheque';
    paymentDate?: string;
}

export interface Subject {
    id: string;
    name: string;
}

export interface StudentResult {
    studentId: string;
    marks: { [subjectId: string]: number };
    total?: number;
    grade?: string;
    percentage?: number;
}

export interface TestSubject {
    id: string;
    name: string;
    maxMarks: number;
}

export interface ClassResult {
    id: string; // Unique ID, e.g. "Class1-Mid-Term"
    class: string;
    testName: string;
    subjects: TestSubject[];
    results: StudentResult[];
}

export interface LeaveApplication {
    id: string;
    studentId: string;
    studentName: string;
    className: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

export interface NoticeResponse {
    studentId: string;
    parentName: string;
    status: 'OK' | 'Remarked';
    remark?: string;
    date: string;
}

export interface Notice {
    id: string;
    title: string;
    content: string;
    date: string;
    postedBy: string; // 'Admin' or Teacher Name
    target: {
        type: 'all' | 'class' | 'students';
        class?: string;
        studentIds?: string[];
    };
    responses: NoticeResponse[];
}

export interface Parent {
    mobileNumber: string;
    childrenIds: string[];
}

export interface SchoolSubscription {
    plan: 'Trial' | 'Monthly' | 'Quarterly' | 'Half Yearly' | 'Yearly' | 'Expired';
    startDate: string;
    endDate: string;
}

export interface School {
    id: string;
    name: string;
    address: string;
    logo: string | null;
    gstin: string;
    registeredMobileNumber: string;
    registeredEmail: string;
    landlineNumber?: string;
    adminUsername: string;
    adminPassword?: string;
    subscription: SchoolSubscription;
}

export interface SuperAdmin {
    username: string;
}

export interface SuperAdminProfile {
    companyName: string;
    companyLogo: string | null;
    address: string;
    mobileNumber: string;
    email: string;
    gstin: string;
}

export interface Notification {
    id: string;
    message: string;
    date: string;
    read: boolean;
    target: {
        role: 'admin' | 'teacher' | 'parent';
        id?: string; // teacher id or parent mobile number
    };
}

export interface SuperAdminNotification {
    id: string;
    message: string;
    date: string;
    read: boolean;
}