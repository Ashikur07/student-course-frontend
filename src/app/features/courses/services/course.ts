import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course, CourseRequest } from '../models/course.model';
import { PageableResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private http = inject(HttpClient);
  private endpoint = '/courses';

  getCourses(page = 0, size = 10, keyword = ''): Observable<PageableResponse<Course>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (keyword.trim()) {
      params = params.set('keyword', keyword.trim()).set('search', keyword.trim());
    }

    return this.http.get<PageableResponse<Course>>(this.endpoint, { params });
  }

  getAllForDropdown(): Observable<PageableResponse<Course>> {
    return this.http.get<PageableResponse<Course>>(`${this.endpoint}?page=0&size=500`);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.endpoint}/${id}`);
  }

  createCourse(payload: CourseRequest): Observable<Course> {
    return this.http.post<Course>(this.endpoint, payload);
  }

  updateCourse(id: number, payload: CourseRequest): Observable<Course> {
    return this.http.put<Course>(`${this.endpoint}/${id}`, payload);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}