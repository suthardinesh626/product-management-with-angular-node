import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../../core/services/category.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showModal = false;
  isEditMode = false;

  category = {
    id: 0,
    name: '',
    description: '',
    is_active: true
  };

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.categoryService.getCategories({ limit: 100 }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.success) {
          this.categories = Array.isArray(response.data) ? response.data : [response.data];
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load categories';
      }
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.category = {
      id: 0,
      name: '',
      description: '',
      is_active: true
    };
    this.showModal = true;
  }

  openEditModal(cat: Category) {
    this.isEditMode = true;
    this.category = {
      id: cat.id,
      name: cat.name,
      description: cat.description || '',
      is_active: cat.is_active
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveCategory() {
    const request = this.isEditMode
      ? this.categoryService.updateCategory(this.category.id, this.category)
      : this.categoryService.createCategory(this.category);

    request.subscribe({
      next: (response) => {
        this.successMessage = `Category ${this.isEditMode ? 'updated' : 'created'} successfully`;
        this.closeModal();
        this.loadCategories();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || `Failed to ${this.isEditMode ? 'update' : 'create'} category`;
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  deleteCategory(category: Category) {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      this.categoryService.deleteCategory(category.id).subscribe({
        next: (response) => {
          this.successMessage = 'Category deleted successfully';
          this.loadCategories();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to delete category';
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
    }
  }
}

