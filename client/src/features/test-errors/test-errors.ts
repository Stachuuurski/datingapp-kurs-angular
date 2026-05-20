import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-test-errors',
  imports: [],
  templateUrl: './test-errors.html',
  styleUrl: './test-errors.css',
})
export class TestErrors {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  baseUrl = 'https://localhost:5001/api/';
  validationErrors = signal<string[]>([]);

  get404Error() {
    this.http.get(this.baseUrl + 'buggy/not-found').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  get400Error() {
    this.http.get(this.baseUrl + 'buggy/bad-request').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  get500Error() {
    this.http.get(this.baseUrl + 'buggy/server-error').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  get401Error() {
    this.http.get(this.baseUrl + 'buggy/auth').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  get400ValidationError() {
    this.http.post(this.baseUrl + 'account/register', {}).subscribe({
      next: (response) => console.log(response),
      error: (error) => {
        console.log(error);
        if (Array.isArray(error)) {
          this.validationErrors.set(error);
        } else if (error?.error?.errors) {
          const modelStateErrors = [] as string[];
          for (const key in error.error.errors) {
            if (error.error.errors[key]) {
              modelStateErrors.push(...error.error.errors[key]);
            }
          }
          this.validationErrors.set(modelStateErrors.flat());
        } else {
          this.validationErrors.set([error?.error?.title || 'Validation error occurred']);
        }
      },
    });
  }
}
