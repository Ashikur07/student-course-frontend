import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EnrollmentRequest, EnrollmentStatus } from '../../models/enrollment.model';
import { EnrollmentService } from '../../services/enrollment';
import { StudentService } from '../../../students/services/student';
import { CourseService } from '../../../courses/services/course';
import { Student } from '../../../students/models/student.model';
import { Course } from '../../../courses/models/course.model';
import { NotificationService } from '../../../../core/services/notification';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-enrollment-form',
  standalone: true,
  imports: [ReactiveFormsModule, LoadingSpinner],
  templateUrl: './enrollment-form.html',
  styleUrl: './enrollment-form.css',
})
export class EnrollmentForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private enrollmentService = inject(EnrollmentService);
  private studentService = inject(StudentService);
  private courseService = inject(CourseService);
  private notification = inject(NotificationService);

  enrollmentId = signal<number | null>(null);
  submitting = signal<boolean>(false);
  dataLoading = signal<boolean>(true);

  students = signal<Student[]>([]);
  courses = signal<Course[]>([]);
  statuses: EnrollmentStatus[] = ['ACTIVE', 'COMPLETED', 'CANCELLED'];

  form = this.fb.nonNullable.group({
    studentId: [0, [Validators.required, Validators.min(1)]],
    courseId: [0, [Validators.required, Validators.min(1)]],
    enrollmentDate: [new Date().toISOString().split('T')[0], [Validators.required]],
    status: ['ACTIVE' as EnrollmentStatus, [Validators.required]],
  });

  ngOnInit(): void {
    // પહેલા Dropdown data লোড করা হচ্ছে
    this.loadDropdowns();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.enrollmentId.set(Number(id));
      this.loadEnrollmentData(Number(id));
    } else {
      this.dataLoading.set(false);
    }
  }

  loadDropdowns() {
    this.studentService.getAllForDropdown().subscribe((res) => this.students.set(res.content || []));
    this.courseService.getAllForDropdown().subscribe((res) => this.courses.set(res.content || []));
  }

  loadEnrollmentData(id: number) {
    this.enrollmentService.getEnrollmentById(id).subscribe({
      next: (enrollment) => {
        this.form.patchValue({
          studentId: enrollment.studentId,
          courseId: enrollment.courseId,
          enrollmentDate: enrollment.enrollmentDate,
          status: enrollment.status,
        });
        this.dataLoading.set(false);
      },
      error: () => {
        this.notification.showError('Failed to fetch enrollment details');
        this.router.navigate(['/enrollments']);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid || this.form.value.studentId === 0 || this.form.value.courseId === 0) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const raw = this.form.getRawValue();
    const payload: EnrollmentRequest = {
      studentId: Number(raw.studentId),
      courseId: Number(raw.courseId),
      enrollmentDate: raw.enrollmentDate,
      status: raw.status as EnrollmentStatus,
    };

    const id = this.enrollmentId();
    const request$ = id
      ? this.enrollmentService.updateEnrollment(id, payload)
      : this.enrollmentService.createEnrollment(payload);

    request$.subscribe({
      next: () => {
        this.notification.showSuccess(id ? 'Enrollment updated successfully!' : 'Student enrolled successfully!');
        this.router.navigate(['/enrollments']);
      },
      error: () => {
        this.submitting.set(false);
      }
    });
  }

  cancel() {
    this.router.navigate(['/enrollments']);
  }
}