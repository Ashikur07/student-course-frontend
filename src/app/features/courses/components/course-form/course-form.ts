import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseRequest } from '../../models/course.model';
import { CourseService } from '../../services/course';
import { NotificationService } from '../../../../core/services/notification';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [ReactiveFormsModule, LoadingSpinner],
  templateUrl: './course-form.html',
  styleUrl: './course-form.css',
})
export class CourseForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private notification = inject(NotificationService);

  // Eikhane courseId signal add kora hoyeche notun page er jonno
  courseId = signal<number | null>(null);
  submitting = signal<boolean>(false);
  dataLoading = signal<boolean>(false);

  form = this.fb.nonNullable.group({
    courseCode: ['', [Validators.required, Validators.maxLength(30)]],
    courseName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    credit: [3.0, [Validators.required, Validators.min(0.5), Validators.max(10)]],
    description: ['', [Validators.maxLength(500)]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.courseId.set(Number(id));
      this.loadCourseData(Number(id));
    }
  }

  loadCourseData(id: number) {
    this.dataLoading.set(true);
    this.courseService.getCourseById(id).subscribe({
      next: (course) => {
        this.form.patchValue({
          courseCode: course.courseCode,
          courseName: course.courseName,
          credit: course.credit,
          description: course.description || '',
        });
        this.dataLoading.set(false);
      },
      error: () => {
        this.notification.showError('Failed to fetch course details');
        this.router.navigate(['/courses']);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const payload = this.form.getRawValue() as CourseRequest;
    const id = this.courseId();

    const request$ = id
      ? this.courseService.updateCourse(id, payload)
      : this.courseService.createCourse(payload);

    request$.subscribe({
      next: () => {
        this.notification.showSuccess(id ? 'Course updated successfully!' : 'Course created successfully!');
        this.router.navigate(['/courses']);
      },
      error: () => {
        this.submitting.set(false);
      }
    });
  }

  cancel() {
    this.router.navigate(['/courses']);
  }
}