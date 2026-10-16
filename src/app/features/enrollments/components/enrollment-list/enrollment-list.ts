import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Enrollment } from '../../models/enrollment.model';
import { EnrollmentService } from '../../services/enrollment';
import { StudentService } from '../../../students/services/student';
import { CourseService } from '../../../courses/services/course';
import { Student } from '../../../students/models/student.model';
import { Course } from '../../../courses/models/course.model';
import { NotificationService } from '../../../../core/services/notification';
import { RecentTrackerService } from '../../../../core/services/recent-tracker.service';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-enrollment-list',
  standalone: true,
  imports: [FormsModule, LoadingSpinner, Pagination, ConfirmDialog],
  templateUrl: './enrollment-list.html',
  styleUrl: './enrollment-list.css',
})
export class EnrollmentList implements OnInit {
  private enrollmentService = inject(EnrollmentService);
  private studentService = inject(StudentService);
  private courseService = inject(CourseService);
  private notification = inject(NotificationService);
  private recentTracker = inject(RecentTrackerService);
  private router = inject(Router);

  enrollments = signal<Enrollment[]>([]);
  students = signal<Student[]>([]);
  courses = signal<Course[]>([]);
  loading = signal<boolean>(true);

  // Pagination & Filter state
  currentPage = signal<number>(0);
  pageSize = signal<number>(10);
  totalElements = signal<number>(0);
  totalPages = signal<number>(0);

  filterStudentId = signal<number | null>(null);
  filterCourseId = signal<number | null>(null);
  filterStatus = signal<string>('');

  // Delete Dialog state
  enrollmentToDelete = signal<Enrollment | null>(null);

  ngOnInit(): void {
    this.loadDropdownData();
    this.loadEnrollments();
  }

  loadDropdownData(): void {
    this.studentService.getAllForDropdown().subscribe({
      next: (res) => this.students.set(res.content || []),
    });
    this.courseService.getAllForDropdown().subscribe({
      next: (res) => this.courses.set(res.content || []),
    });
  }

  loadEnrollments(): void {
    this.loading.set(true);
    this.enrollmentService
      .getEnrollments(
        this.currentPage(),
        this.pageSize(),
        this.filterStudentId() || undefined,
        this.filterCourseId() || undefined,
        this.filterStatus() || undefined,
        'id,desc'
      )
      .subscribe({
        next: (res) => {
          let list: Enrollment[] = [];
          if (Array.isArray(res)) {
            list = [...res];
            this.totalElements.set(res.length);
            this.totalPages.set(1);
          } else {
            list = [...(res.content || [])];
            this.totalElements.set(res.totalElements || 0);
            this.totalPages.set(res.totalPages || 0);
          }

          // Move recently added or updated enrollment to top of page 1
          const recentId = this.recentTracker.recentEnrollmentId();
          if (recentId && this.currentPage() === 0) {
            const idx = list.findIndex((e) => e.id === recentId);
            if (idx > -1) {
              const [target] = list.splice(idx, 1);
              list.unshift(target);
            }
          }

          this.enrollments.set(list);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  getStudentName(item: Enrollment): string {
    if (item.studentName) return item.studentName;
    const found = this.students().find((s) => s.id === item.studentId);
    return found ? found.fullName : `Student #${item.studentId}`;
  }

  getStudentDisplay(item: Enrollment): string {
    return this.getStudentName(item);
  }

  getCourseCode(item: Enrollment): string {
    if (item.courseCode) return item.courseCode;
    const found = this.courses().find((c) => c.id === item.courseId);
    return found ? found.courseCode : '';
  }

  getCourseName(item: Enrollment): string {
    if (item.courseName) return item.courseName;
    const found = this.courses().find((c) => c.id === item.courseId);
    return found ? found.courseName : `Course #${item.courseId}`;
  }

  getCourseDisplay(item: Enrollment): string {
    return this.getCourseName(item);
  }

  applyFilter(): void {
    this.currentPage.set(0);
    this.loadEnrollments();
  }

  resetFilter(): void {
    this.filterStudentId.set(null);
    this.filterCourseId.set(null);
    this.filterStatus.set('');
    this.currentPage.set(0);
    this.loadEnrollments();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadEnrollments();
  }

  onSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(0);
    this.loadEnrollments();
  }

  // Routing Logic
  openAddModal(): void {
    this.router.navigate(['/enrollments/add']);
  }

  openEditModal(enrollment: Enrollment): void {
    this.router.navigate(['/enrollments/edit', enrollment.id]);
  }

  // Delete Logic
  confirmDelete(enrollment: Enrollment): void {
    this.enrollmentToDelete.set(enrollment);
  }

  deleteEnrollment(): void {
    const target = this.enrollmentToDelete();
    if (!target) return;

    this.enrollmentService.deleteEnrollment(target.id).subscribe({
      next: () => {
        this.notification.showSuccess('Enrollment record deleted successfully!');
        this.enrollmentToDelete.set(null);
        this.loadEnrollments();
      },
      error: () => this.enrollmentToDelete.set(null),
    });
  }
}