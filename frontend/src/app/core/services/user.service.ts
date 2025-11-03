import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface UserData {
  id: number;
  email: string;
  name?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: UserData | UserData[];
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
export class UserService {
  constructor(private apiService: ApiService) {}

  getUsers(params?: any): Observable<UserResponse> {
    return this.apiService.get<UserResponse>('/users', params);
  }

  getUserById(id: number): Observable<UserResponse> {
    return this.apiService.get<UserResponse>(`/users/${id}`);
  }

  createUser(data: Partial<UserData>): Observable<UserResponse> {
    return this.apiService.post<UserResponse>('/users', data);
  }

  updateUser(id: number, data: Partial<UserData>): Observable<UserResponse> {
    return this.apiService.put<UserResponse>(`/users/${id}`, data);
  }

  deleteUser(id: number): Observable<UserResponse> {
    return this.apiService.delete<UserResponse>(`/users/${id}`);
  }
}

