import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, catchError, of } from 'rxjs';
import { PageableResponse } from '../../../core/models/api-response.model';
import { Student } from '../../students/models/student.model';
import { Course } from '../../courses/models/course.model';
import { Enrollment } from '../../enrollments/models/enrollment.model';

export interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  activeEnrollments: number;
  recentEnrollments: Enrollment[];
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);

  getDashboardStats(): Observable<DashboardStats> {
    return forkJoin({
      students: this.http
        .get<PageableResponse<Student>>('/students?page=0&size=1')
        .pipe(catchError(() => of({ totalElements: 0 } as PageableResponse<Student>))),
      courses: this.http
        .get<PageableResponse<Course>>('/courses?page=0&size=1')
        .pipe(catchError(() => of({ totalElements: 0 } as PageableResponse<Course>))),
      enrollments: this.http
        .get<PageableResponse<Enrollment> | Enrollment[]>('/enrollments?page=0&size=10')
        .pipe(catchError(() => of([] as Enrollment[]))),
    }).pipe(
      map(({ students, courses, enrollments }) => {
        const enrollmentList = Array.isArray(enrollments)
          ? enrollments
          : enrollments.content || [];
        const totalEnroll = Array.isArray(enrollments)
          ? enrollments.length
          : enrollments.totalElements || 0;

        const activeCount = enrollmentList.filter((e) => e.status === 'ACTIVE').length;

        return {
          totalStudents: students.totalElements || 0,
          totalCourses: courses.totalElements || 0,
          totalEnrollments: totalEnroll,
          activeEnrollments: activeCount,
          recentEnrollments: enrollmentList.slice(0, 5),
        };
      })
    );
  }
}