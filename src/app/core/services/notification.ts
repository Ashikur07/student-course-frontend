import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  toasts = signal<ToastMessage[]>([]);
  private counter = 0;

  showSuccess(message: string) {
    this.addToast('success', message);
  }

  showError(message: string) {
    this.addToast('error', message);
  }

  private addToast(type: 'success' | 'error' | 'info', message: string) {
    const id = ++this.counter;
    this.toasts.update((prev) => [...prev, { id, type, message }]);
    setTimeout(() => this.removeToast(id), 4000);
  }

  removeToast(id: number) {
    this.toasts.update((prev) => prev.filter((t) => t.id !== id));
  }
}