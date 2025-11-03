import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  unique_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category | Category[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private apiService: ApiService) {}

  getCategories(params?: any): Observable<CategoryResponse> {
    return this.apiService.get<CategoryResponse>('/categories', params);
  }

  getCategoryById(id: number): Observable<CategoryResponse> {
    return this.apiService.get<CategoryResponse>(`/categories/${id}`);
  }

  createCategory(data: Partial<Category>): Observable<CategoryResponse> {
    return this.apiService.post<CategoryResponse>('/categories', data);
  }

  updateCategory(id: number, data: Partial<Category>): Observable<CategoryResponse> {
    return this.apiService.put<CategoryResponse>(`/categories/${id}`, data);
  }

  deleteCategory(id: number): Observable<CategoryResponse> {
    return this.apiService.delete<CategoryResponse>(`/categories/${id}`);
  }
}

