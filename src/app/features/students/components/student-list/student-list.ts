import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student';
import { NotificationService } from '../../../../core/services/notification';
import { RecentTrackerService } from '../../../../core/services/recent-tracker.service';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [FormsModule, LoadingSpinner, Pagination, ConfirmDialog],
  templateUrl: './student-list.html'
})

export class StudentList implements OnInit {
  private studentService = inject(StudentService);
  private notification = inject(NotificationService);
  private recentTracker = inject(RecentTrackerService);
  private router = inject(Router);

  students = signal<Student[]>([]);
  loading = signal<boolean>(true);

  // Backend Pagination state
  currentPage = signal<number>(0);
  pageSize = signal<number>(10);
  totalElements = signal<number>(0);
  totalPages = signal<number>(0);
  searchKeyword = signal<string>('');

  // Delete Dialog state
  studentToDelete = signal<Student | null>(null);

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading.set(true);
    this.studentService
      .getStudents(this.currentPage(), this.pageSize(), this.searchKeyword(), 'id,desc')
      .subscribe({
        next: (res) => {
          let list = [...(res.content || [])];
          const recentId = this.recentTracker.recentStudentId();
          if (recentId && this.currentPage() === 0) {
            const idx = list.findIndex((s) => s.id === recentId);
            if (idx > -1) {
              const [target] = list.splice(idx, 1);
              list.unshift(target);
            }
          }
          this.students.set(list);
          this.totalElements.set(res.totalElements || 0);
          this.totalPages.set(res.totalPages || 0);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  onSearch(): void {
    this.currentPage.set(0);
    this.loadStudents();
  }

  clearSearch(): void {
    this.searchKeyword.set('');
    this.currentPage.set(0);
    this.loadStudents();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadStudents();
  }

  onSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(0);
    this.loadStudents();
  }

  // Routing Logic
  openAddModal(): void {
    this.router.navigate(['/students/add']);
  }

  openEditModal(student: Student): void {
    this.router.navigate(['/students/edit', student.id]);
  }

  // Delete Logic
  confirmDelete(student: Student): void {
    this.studentToDelete.set(student);
  }

  deleteStudent(): void {
    const target = this.studentToDelete();
    if (!target) return;

    this.studentService.deleteStudent(target.id).subscribe({
      next: () => {
        this.notification.showSuccess(`Student "${target.fullName}" deleted successfully!`);
        this.studentToDelete.set(null);
        this.loadStudents();
      },
      error: () => this.studentToDelete.set(null),
    });
  }
}
