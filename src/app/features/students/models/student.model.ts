export interface Student {
    id: number;
    studentCode: string;
    fullName: string;
    email: string;
    phone: string;
    admissionDate: string; // YYYY-MM-DD
  }
  
  export interface StudentRequest {
    studentCode: string;
    fullName: string;
    email: string;
    phone: string;
    admissionDate: string;
  }