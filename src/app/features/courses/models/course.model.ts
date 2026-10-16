export interface Course {
    id: number;
    courseCode: string;
    courseName: string;
    credit: number;
    description: string;
  }
  
  export interface CourseRequest {
    courseCode: string;
    courseName: string;
    credit: number;
    description: string;
  }