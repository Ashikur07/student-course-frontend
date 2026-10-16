import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
  isOpen = input<boolean>(false);
  title = input<string>('Confirm Delete');
  message = input<string>('Are you sure you want to delete this record? This action cannot be undone.');

  confirm = output<void>();
  cancel = output<void>();
}