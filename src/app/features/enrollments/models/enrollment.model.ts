export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Enrollment {
  id: number;
  studentId: number;
  studentName?: string;
  studentCode?: string;
  courseId: number;
  courseName?: string;
  courseCode?: string;
  enrollmentDate: string;
  status: EnrollmentStatus;
}

export interface EnrollmentRequest {
  studentId: number;
  courseId: number;
  enrollmentDate: string;
  status: EnrollmentStatus;
}