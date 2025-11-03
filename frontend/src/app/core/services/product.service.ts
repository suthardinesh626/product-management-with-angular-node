import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  unique_id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category_id: number;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: {
    id: number;
    name: string;
    unique_id: string;
  };
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product | Product[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BulkUploadResponse {
  success: boolean;
  message: string;
  data: {
    jobId: string;
    message: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private apiService: ApiService) {}

  getProducts(params?: any): Observable<ProductResponse> {
    return this.apiService.get<ProductResponse>('/products', params);
  }

  getProductById(id: number): Observable<ProductResponse> {
    return this.apiService.get<ProductResponse>(`/products/${id}`);
  }

  createProduct(formData: FormData): Observable<ProductResponse> {
    return this.apiService.upload<ProductResponse>('/products', formData);
  }

  updateProduct(id: number, formData: FormData): Observable<ProductResponse> {
    return this.apiService.putUpload<ProductResponse>(`/products/${id}`, formData);
  }

  deleteProduct(id: number): Observable<ProductResponse> {
    return this.apiService.delete<ProductResponse>(`/products/${id}`);
  }

  bulkUpload(formData: FormData): Observable<BulkUploadResponse> {
    return this.apiService.upload<BulkUploadResponse>('/products/bulk/upload', formData);
  }

  getBulkUploadStatus(jobId: string): Observable<any> {
    return this.apiService.get(`/products/bulk/status/${jobId}`);
  }

  downloadReport(format: string, filters?: any): Observable<Blob> {
    const params = { format, ...filters };
    return this.apiService.download('/reports/products', params);
  }

  downloadTemplate(format: string): Observable<Blob> {
    return this.apiService.download('/reports/template', { format });
  }
}

