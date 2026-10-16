import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RecentTrackerService {
  // Tracks the ID of the most recently added or updated item
  recentStudentId = signal<number | null>(null);
  recentCourseId = signal<number | null>(null);
  recentEnrollmentId = signal<number | null>(null);

  setRecentStudent(id: number): void {
    this.recentStudentId.set(id);
  }

  setRecentCourse(id: number): void {
    this.recentCourseId.set(id);
  }

  setRecentEnrollment(id: number): void {
    this.recentEnrollmentId.set(id);
  }
}
