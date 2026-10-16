import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student, StudentRequest } from '../models/student.model';
import { PageableResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private http = inject(HttpClient);
  private endpoint = '/students';

  getStudents(page = 0, size = 10, keyword = ''): Observable<PageableResponse<Student>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (keyword.trim()) {
      params = params.set('keyword', keyword.trim()).set('search', keyword.trim());
    }

    return this.http.get<PageableResponse<Student>>(this.endpoint, { params });
  }

  getAllForDropdown(): Observable<PageableResponse<Student>> {
    return this.http.get<PageableResponse<Student>>(`${this.endpoint}?page=0&size=500`);
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.endpoint}/${id}`);
  }

  createStudent(payload: StudentRequest): Observable<Student> {
    return this.http.post<Student>(this.endpoint, payload);
  }

  updateStudent(id: number, payload: StudentRequest): Observable<Student> {
    return this.http.put<Student>(`${this.endpoint}/${id}`, payload);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}