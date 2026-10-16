import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course';
import { NotificationService } from '../../../../core/services/notification';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [FormsModule, LoadingSpinner, Pagination, ConfirmDialog],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css'
})
export class CourseList implements OnInit {
  private courseService = inject(CourseService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  courses = signal<Course[]>([]);
  loading = signal<boolean>(true);

  // Backend Pagination state
  currentPage = signal<number>(0);
  pageSize = signal<number>(10);
  totalElements = signal<number>(0);
  totalPages = signal<number>(0);
  searchKeyword = signal<string>('');

  // Delete Dialog state
  courseToDelete = signal<Course | null>(null);

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading.set(true);
    this.courseService
      .getCourses(this.currentPage(), this.pageSize(), this.searchKeyword())
      .subscribe({
        next: (res) => {
          this.courses.set(res.content || []);
          this.totalElements.set(res.totalElements || 0);
          this.totalPages.set(res.totalPages || 0);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  onSearch(): void {
    this.currentPage.set(0);
    this.loadCourses();
  }

  clearSearch(): void {
    this.searchKeyword.set('');
    this.currentPage.set(0);
    this.loadCourses();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadCourses();
  }

  onSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(0);
    this.loadCourses();
  }

  // Routing Logic
  openAddModal(): void {
    this.router.navigate(['/courses/add']);
  }

  openEditModal(course: Course): void {
    this.router.navigate(['/courses/edit', course.id]);
  }

  // Delete Logic
  confirmDelete(course: Course): void {
    this.courseToDelete.set(course);
  }

  deleteCourse(): void {
    const target = this.courseToDelete();
    if (!target) return;

    this.courseService.deleteCourse(target.id).subscribe({
      next: () => {
        this.notification.showSuccess(`Course "${target.courseName}" deleted successfully!`);
        this.courseToDelete.set(null);
        this.loadCourses();
      },
      error: () => this.courseToDelete.set(null),
    });
  }
}