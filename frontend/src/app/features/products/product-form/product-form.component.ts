import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../../core/services/product.service';
import { CategoryService, Category } from '../../../core/services/category.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  isEditMode = false;
  productId: number | null = null;
  isLoading = false;
  errorMessage = '';

  product = {
    name: '',
    description: '',
    price: 0,
    category_id: 0,
    stock_quantity: 0,
    is_active: true
  };

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  categories: Category[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadCategories();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = parseInt(id);
      this.loadProduct();
    }
  }

  loadCategories() {
    this.categoryService.getCategories({ limit: 100, is_active: true }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.categories = Array.isArray(response.data) ? response.data : [response.data];
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to load categories';
      }
    });
  }

  loadProduct() {
    if (!this.productId) return;

    this.isLoading = true;
    this.productService.getProductById(this.productId).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.success) {
          const productData = response.data;
          this.product = {
            name: productData.name,
            description: productData.description || '',
            price: productData.price,
            category_id: productData.category_id,
            stock_quantity: productData.stock_quantity,
            is_active: productData.is_active
          };
          if (productData.image) {
            this.imagePreview = productData.image.startsWith('http') 
              ? productData.image 
              : 'http://localhost:3000' + productData.image;
          }
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to load product';
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Preview image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;

    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price.toString());
    formData.append('category_id', this.product.category_id.toString());
    formData.append('stock_quantity', this.product.stock_quantity.toString());
    formData.append('is_active', this.product.is_active.toString());

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const request = this.isEditMode && this.productId
      ? this.productService.updateProduct(this.productId, formData)
      : this.productService.createProduct(formData);

    request.subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard/products']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to save product';
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard/products']);
  }
}

