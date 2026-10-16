import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'students',
    loadComponent: () =>
      import('./features/students/components/student-list/student-list').then(
        (m) => m.StudentList
      ),
  },
  {
    path: 'students/add',
    loadComponent: () => import('./features/students/components/student-form/student-form').then((m) => m.StudentForm),
  },
  {
    path: 'students/edit/:id',
    loadComponent: () => import('./features/students/components/student-form/student-form').then((m) => m.StudentForm),
  },
  {
    path: 'courses',
    loadComponent: () =>
      import('./features/courses/components/course-list/course-list').then(
        (m) => m.CourseList
      ),
  },
  {
    path: 'courses/add',
    loadComponent: () => import('./features/courses/components/course-form/course-form').then((m) => m.CourseForm),
  },
  {
    path: 'courses/edit/:id',
    loadComponent: () => import('./features/courses/components/course-form/course-form').then((m) => m.CourseForm),
  },
  {
    path: 'enrollments',
    loadComponent: () =>
      import('./features/enrollments/components/enrollment-list/enrollment-list').then(
        (m) => m.EnrollmentList
      ),
  },
  {
    path: 'enrollments/add',
    loadComponent: () => import('./features/enrollments/components/enrollment-form/enrollment-form').then((m) => m.EnrollmentForm),
  },
  {
    path: 'enrollments/edit/:id',
    loadComponent: () => import('./features/enrollments/components/enrollment-form/enrollment-form').then((m) => m.EnrollmentForm),
  },
  
  { path: '**', redirectTo: 'dashboard' },
];