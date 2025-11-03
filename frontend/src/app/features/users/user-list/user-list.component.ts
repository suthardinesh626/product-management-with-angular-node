import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, UserData } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: UserData[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showModal = false;
  isEditMode = false;

  user = {
    id: 0,
    email: '',
    password: '',
    name: '',
    role: 'user' as 'user' | 'admin',
    is_active: true
  };

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getUsers({ limit: 100 }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.success) {
          this.users = Array.isArray(response.data) ? response.data : [response.data];
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load users';
      }
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.user = {
      id: 0,
      email: '',
      password: '',
      name: '',
      role: 'user',
      is_active: true
    };
    this.showModal = true;
  }

  openEditModal(userData: UserData) {
    this.isEditMode = true;
    this.user = {
      id: userData.id,
      email: userData.email,
      password: '',
      name: userData.name || '',
      role: userData.role as 'user' | 'admin',
      is_active: userData.is_active
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveUser() {
    const userData: any = {
      email: this.user.email,
      name: this.user.name,
      role: this.user.role,
      is_active: this.user.is_active
    };

    if (!this.isEditMode || this.user.password) {
      userData.password = this.user.password;
    }

    const request = this.isEditMode
      ? this.userService.updateUser(this.user.id, userData)
      : this.userService.createUser(userData);

    request.subscribe({
      next: (response) => {
        this.successMessage = `User ${this.isEditMode ? 'updated' : 'created'} successfully`;
        this.closeModal();
        this.loadUsers();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || `Failed to ${this.isEditMode ? 'update' : 'create'} user`;
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  deleteUser(user: UserData) {
    if (confirm(`Are you sure you want to delete user "${user.email}"?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: (response) => {
          this.successMessage = 'User deleted successfully';
          this.loadUsers();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to delete user';
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
    }
  }
}

