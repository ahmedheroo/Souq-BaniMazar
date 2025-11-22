import { Component, signal, computed, ElementRef, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { CategoriesService } from '../../services/categories-service';
import { StatusService } from '../../services/status-service';
import { categories } from '../../models/categories';
import { FormsModule, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { ProductsService } from '../../services/products-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-add-product',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onClickOutside($event)',
  },
})
export class AddProduct {
  private fb: FormBuilder = inject(FormBuilder);
  private authService = inject(Auth);
  private productService = inject(ProductsService);
  private statusService = inject(StatusService);
  status = toSignal(this.statusService.getStatuses(), { initialValue: [] });
  idUploaded = signal(false);
  fileName = signal('');
  currentUser = this.authService.userSignal;
  sellerId = computed(() => this.currentUser()?.id ?? null);
  private elementRef = inject(ElementRef);
  productImgFile: File | null = null;
  private categoryService = inject(CategoriesService);
  categories = toSignal(this.categoryService.GetCategoriesList(), { initialValue: [] });
  isCategoryDropdownOpen = signal(false);
  categorySearchTerm = signal('');

  constructor() {
    effect(() => {
      const id = this.sellerId();  // your computed seller ID
      if (id) {
        this.productForm.patchValue({ sellerId: id });
      }
    });
  }
  productForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', [Validators.required]],
    price: [null, [Validators.required]],
    quantity: [null, [Validators.required]],
    categoryId: [null as number | null, [Validators.required]],
    statusId: [0, [Validators.required, Validators.min(1)]],
    productImg: [null as File | null, [Validators.required]],
    sellerId: [null, this.sellerId()],
  });

  private selectedCategoryId = toSignal(
    this.productForm.controls.categoryId.valueChanges.pipe(
      startWith(this.productForm.controls.categoryId.value)
    )
  );
  selectedCategoryName = computed(() => {
    const categoryId = this.selectedCategoryId();
    return this.categories().find(c => c.id === categoryId)?.name ?? 'اختر قسماً';
  });

  filteredCategories = computed(() => {
    const term = this.categorySearchTerm().toLowerCase();
    if (!term) {
      return this.categories();
    }
    return this.categories().filter(c => c.name.toLowerCase().includes(term));
  });

  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.querySelector('.category-select-container')?.contains(event.target)) {
      this.isCategoryDropdownOpen.set(false);
    }
  }

  toggleCategoryDropdown() {
    this.isCategoryDropdownOpen.update(v => !v);
    if (!this.isCategoryDropdownOpen()) {
      this.categorySearchTerm.set('');
    }
  }

  onCategorySearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.categorySearchTerm.set(input.value);
  }

  selectCategory(category: categories) {
    this.productForm.get('categoryId')?.setValue(category.id);
    this.productForm.get('categoryId')?.markAsTouched();
    this.productForm.patchValue({ categoryId: category.id });
    this.isCategoryDropdownOpen.set(false);
    this.categorySearchTerm.set('');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.productImgFile = file;
    this.idUploaded.set(!!file);
    this.fileName.set(file?.name ?? '');

    // If you have image control in the form:
    this.productForm.patchValue({ productImg: file });
    this.productForm.get('imgUrl')?.updateValueAndValidity();
  }
  addProduct() {
    if (this.productForm.invalid){
      console.log('Form invalid', this.productForm.value);
    return;
    } 

      if (!this.productImgFile) {
    console.error('No product image selected');
    return;
  }

    const productDetails = this.productForm.value;
    const payload = {
      name: productDetails.name,
      description: productDetails.description,
      price: Number(productDetails.price),
      categoryId: Number(productDetails.categoryId),
      productImg: this.productImgFile,
      quantity: Number(productDetails.quantity),
      sellerId: productDetails.sellerId,
      statusId: Number(productDetails.statusId),
    } as any;
    this.productService.addProduct(payload).subscribe({
      next: (res) => {
        console.log('Product added successfully', res);
      },
      error: (err) => {
        console.error('Error adding product', err);
      },
    });

  }
}
