import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService, Product } from '../../../core/services/product.service';
import { CategoryService, Category } from '../../../core/services/category.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Filters and pagination
  searchTerm = '';
  selectedCategory = '';
  sortBy = 'created_at';
  sortOrder: 'ASC' | 'DESC' = 'DESC';
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  totalItems = 0;
  Math = Math;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.categoryService.getCategories({ limit: 100 }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.categories = Array.isArray(response.data) ? response.data : [response.data];
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadProducts() {
    this.isLoading = true;
    this.errorMessage = '';

    const params = {
      page: this.currentPage,
      limit: this.pageSize,
      search: this.searchTerm,
      category: this.selectedCategory,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    };

    this.productService.getProducts(params).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.success) {
          this.products = Array.isArray(response.data) ? response.data : [response.data];
          if (response.pagination) {
            this.totalPages = response.pagination.totalPages;
            this.totalItems = response.pagination.total;
          }
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to load products';
      }
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadProducts();
  }

  onSort(field: string) {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortBy = field;
      this.sortOrder = 'ASC';
    }
    this.loadProducts();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }

  onCategoryChange() {
    this.currentPage = 1;
    this.loadProducts();
  }

  deleteProduct(product: Product) {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: (response) => {
          this.successMessage = 'Product deleted successfully';
          this.loadProducts();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to delete product';
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
    }
  }

  downloadReport(format: string) {
    const filters = {
      search: this.searchTerm,
      category: this.selectedCategory
    };

    this.productService.downloadReport(format, filters).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `products-report.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.successMessage = 'Report downloaded successfully';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to download report';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  getPages(): number[] {
    const pages: number[] = [];
    const maxPages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPages - 1);

    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
}

