import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentRequest } from '../../models/student.model';
import { StudentService } from '../../services/student';
import { NotificationService } from '../../../../core/services/notification';
import { RecentTrackerService } from '../../../../core/services/recent-tracker.service';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [ReactiveFormsModule, LoadingSpinner],
  templateUrl: './student-form.html',
  styleUrl: './student-form.css',
})
export class StudentForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private studentService = inject(StudentService);
  private notification = inject(NotificationService);
  private recentTracker = inject(RecentTrackerService);

  studentId = signal<number | null>(null);
  submitting = signal<boolean>(false);
  dataLoading = signal<boolean>(false);

  form = this.fb.nonNullable.group({
    studentCode: ['', [Validators.required, Validators.maxLength(30)]],
    fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{7,20}$/)]],
    admissionDate: [new Date().toISOString().split('T')[0], [Validators.required]],
  });

  ngOnInit(): void {
    // URL থেকে আইডি নেওয়া (যদি এডিট মোড হয়)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.studentId.set(Number(id));
      this.loadStudentData(Number(id));
    }
  }

  loadStudentData(id: number) {
    this.dataLoading.set(true);
    this.studentService.getStudentById(id).subscribe({
      next: (student) => {
        this.form.patchValue({
          studentCode: student.studentCode,
          fullName: student.fullName,
          email: student.email,
          phone: student.phone,
          admissionDate: student.admissionDate,
        });
        this.dataLoading.set(false);
      },
      error: () => {
        this.notification.showError('Failed to fetch student details');
        this.router.navigate(['/students']);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const payload = this.form.getRawValue() as StudentRequest;
    const id = this.studentId();

    const request$ = id
      ? this.studentService.updateStudent(id, payload)
      : this.studentService.createStudent(payload);

    request$.subscribe({
      next: (savedStudent: any) => {
        const resultId = savedStudent?.id || id;
        if (resultId) {
          this.recentTracker.setRecentStudent(resultId);
        }
        this.notification.showSuccess(id ? 'Student updated successfully!' : 'Student registered successfully!');
        this.router.navigate(['/students']);
      },
      error: () => {
        this.submitting.set(false);
      }
    });
  }

  cancel() {
    this.router.navigate(['/students']);
  }
}