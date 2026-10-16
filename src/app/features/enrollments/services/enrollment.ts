import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment, EnrollmentRequest, EnrollmentStatus } from '../models/enrollment.model';
import { PageableResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  private http = inject(HttpClient);
  private endpoint = '/enrollments';

  getEnrollments(
    page = 0,
    size = 10,
    studentId?: number | null,
    courseId?: number | null,
    status?: string | null,
    sort = 'id,desc'
  ): Observable<PageableResponse<Enrollment> | Enrollment[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    if (studentId) params = params.set('studentId', studentId.toString());
    if (courseId) params = params.set('courseId', courseId.toString());
    if (status) params = params.set('status', status);

    return this.http.get<PageableResponse<Enrollment> | Enrollment[]>(this.endpoint, { params });
  }

  // এই মেথডটি মিসিং ছিল, এখন অ্যাড করে দেওয়া হয়েছে!
  getEnrollmentById(id: number): Observable<Enrollment> {
    return this.http.get<Enrollment>(`${this.endpoint}/${id}`);
  }

  createEnrollment(payload: EnrollmentRequest): Observable<Enrollment> {
    return this.http.post<Enrollment>(this.endpoint, payload);
  }

  updateEnrollment(id: number, payload: EnrollmentRequest): Observable<Enrollment> {
    return this.http.put<Enrollment>(`${this.endpoint}/${id}`, payload);
  }

  updateStatus(id: number, status: EnrollmentStatus): Observable<Enrollment> {
    return this.http.patch<Enrollment>(`${this.endpoint}/${id}/status`, null, {
      params: new HttpParams().set('status', status),
    });
  }

  deleteEnrollment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}