
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-add-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductComponent {
  // Fix: Explicitly type `fb` as FormBuilder to resolve type inference issue with `inject()`.
  private fb: FormBuilder = inject(FormBuilder);
  private router = inject(Router);
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  private authService = inject(AuthService);

  categories = toSignal(this.categoryService.getCategories());

  addProductForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [null, [Validators.required, Validators.min(1)]],
    categoryId: [null, Validators.required],
    imageUrl: ['https://picsum.photos/seed/newproduct/600/400', Validators.required]
  });

  addProduct() {
    if (this.addProductForm.valid) {
      const sellerId = this.authService.currentUser()?.id;
      if (!sellerId) {
        alert('خطأ: لم يتم العثور على معلومات البائع.');
        return;
      }
      const formValue = this.addProductForm.getRawValue();
      this.productService.addProduct({
        name: formValue.name!,
        description: formValue.description!,
        price: formValue.price!,
        categoryId: Number(formValue.categoryId!),
        imageUrl: formValue.imageUrl!,
        sellerId: sellerId
      });
      alert('تمت إضافة المنتج بنجاح!');
      this.router.navigate(['/']);
    }
  }
}
