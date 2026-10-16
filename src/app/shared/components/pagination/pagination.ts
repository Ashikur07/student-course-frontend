import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  currentPage = input.required<number>(); // 0-based index from Spring Boot
  totalPages = input.required<number>();
  totalElements = input.required<number>();
  pageSize = input.required<number>();

  pageChange = output<number>();
  sizeChange = output<number>();

  pages = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i);
  });

  startItem = computed(() => {
    if (this.totalElements() === 0) return 0;
    return this.currentPage() * this.pageSize() + 1;
  });

  endItem = computed(() => {
    return Math.min((this.currentPage() + 1) * this.pageSize(), this.totalElements());
  });

  onPageSelect(page: number) {
    if (page >= 0 && page < this.totalPages() && page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }

  onSizeSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.sizeChange.emit(Number(select.value));
  }
}