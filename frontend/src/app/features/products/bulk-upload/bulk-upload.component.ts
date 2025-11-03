import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-bulk-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent {
  selectedFile: File | null = null;
  isUploading = false;
  uploadProgress = 0;
  jobId: string | null = null;
  jobStatus: any = null;
  errorMessage = '';
  successMessage = '';
  pollInterval: any;

  constructor(private productService: ProductService) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const validExtensions = ['csv', 'xlsx', 'xls'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension && validExtensions.includes(fileExtension)) {
        this.selectedFile = file;
        this.errorMessage = '';
      } else {
        this.errorMessage = 'Please select a CSV or Excel file';
        this.selectedFile = null;
      }
    }
  }

  uploadFile() {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file';
      return;
    }

    this.isUploading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.uploadProgress = 0;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.productService.bulkUpload(formData).subscribe({
      next: (response) => {
        if (response.success && response.data.jobId) {
          this.jobId = response.data.jobId;
          this.successMessage = 'Upload started. Processing in background...';
          this.startPolling();
        }
      },
      error: (error) => {
        this.isUploading = false;
        this.errorMessage = error.error?.message || 'Upload failed';
      }
    });
  }

  startPolling() {
    if (!this.jobId) return;

    this.pollInterval = setInterval(() => {
      this.checkJobStatus();
    }, 2000);
  }

  checkJobStatus() {
    if (!this.jobId) return;

    this.productService.getBulkUploadStatus(this.jobId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.jobStatus = response.data;
          this.uploadProgress = response.data.progress || 0;

          if (response.data.state === 'completed') {
            this.stopPolling();
            this.isUploading = false;
            this.successMessage = `Upload completed! Processed ${response.data.result.processedCount} products successfully.`;
            if (response.data.result.errorCount > 0) {
              this.errorMessage = `${response.data.result.errorCount} products failed to import.`;
            }
          } else if (response.data.state === 'failed') {
            this.stopPolling();
            this.isUploading = false;
            this.errorMessage = response.data.failedReason || 'Upload failed';
          }
        }
      },
      error: (error) => {
        this.stopPolling();
        this.isUploading = false;
        this.errorMessage = 'Failed to check upload status';
      }
    });
  }

  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  downloadTemplate(format: string) {
    this.productService.downloadTemplate(format).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `product-template.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (error) => {
        this.errorMessage = 'Failed to download template';
      }
    });
  }

  reset() {
    this.selectedFile = null;
    this.jobId = null;
    this.jobStatus = null;
    this.uploadProgress = 0;
    this.errorMessage = '';
    this.successMessage = '';
    this.stopPolling();
  }

  ngOnDestroy() {
    this.stopPolling();
  }
}

