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

  showSuccess(message: string, duration = 4000) {
    this.addToast('success', message, duration);
  }

  showError(message: string, duration = 6000) {
    this.addToast('error', message, duration);
  }

  private addToast(type: 'success' | 'error' | 'info', message: string, duration = 4000) {
    const id = ++this.counter;
    this.toasts.update((prev) => [...prev, { id, type, message }]);
    setTimeout(() => this.removeToast(id), duration);
  }

  removeToast(id: number) {
    this.toasts.update((prev) => prev.filter((t) => t.id !== id));
  }
}