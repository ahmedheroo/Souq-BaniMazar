import { Injectable, signal } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private _productsData: Product[] = [
    { id: 1, name: 'هاتف ذكي حديث', description: 'أحدث هاتف ذكي في السوق بكاميرا 108 ميجابكسل وشاشة أموليد.', price: 2500, imageUrl: 'https://picsum.photos/seed/phone/600/400', categoryId: 1, sellerId: 2 },
    { id: 2, name: 'أريكة جلدية فاخرة', description: 'أريكة مريحة لثلاثة أشخاص مصنوعة من الجلد الطبيعي.', price: 3200, imageUrl: 'https://picsum.photos/seed/sofa/600/400', categoryId: 2, sellerId: 3 },
    { id: 3, name: 'سيارة سيدان اقتصادية', description: 'سيارة موديل 2022 بحالة ممتازة، قطعت 20,000 كم فقط.', price: 65000, imageUrl: 'https://picsum.photos/seed/car/600/400', categoryId: 3, sellerId: 2 },
    { id: 4, name: 'شقة للإيجار', description: 'شقة من 3 غرف نوم في وسط المدينة، إطلالة رائعة.', price: 3000, imageUrl: 'https://picsum.photos/seed/flat/600/400', categoryId: 5, sellerId: 3 },
    { id: 5, name: 'كمبيوتر محمول للألعاب', description: 'لابتوب بمعالج i9 وكرت شاشة RTX 4080.', price: 8500, imageUrl: 'https://picsum.photos/seed/laptop/600/400', categoryId: 1, sellerId: 2 },
    { id: 6, name: 'طاولة طعام خشبية', description: 'طاولة طعام لستة أشخاص مع الكراسي، مصنوعة من خشب البلوط.', price: 1800, imageUrl: 'https://picsum.photos/seed/table/600/400', categoryId: 2, sellerId: 3 },
    { id: 7, name: 'فستان سهرة أنيق', description: 'فستان طويل مناسب للمناسبات الخاصة، متوفر بعدة ألوان.', price: 600, imageUrl: 'https://picsum.photos/seed/dress/600/400', categoryId: 4, sellerId: 2 },
    { id: 8, name: 'سيارة رياضية', description: 'سيارة رياضية موديل 2023 بقوة 450 حصان.', price: 250000, imageUrl: 'https://picsum.photos/seed/sportscar/600/400', categoryId: 3, sellerId: 3 },
    { id: 9, name: 'سماعات لاسلكية', description: 'سماعات بلوتوث عازلة للضوضاء بجودة صوت عالية.', price: 750, imageUrl: 'https://picsum.photos/seed/headphones/600/400', categoryId: 1, sellerId: 3 },
    { id: 10, name: 'قميص رجالي قطني', description: 'قميص كلاسيكي من القطن الفاخر، مثالي للعمل.', price: 250, imageUrl: 'https://picsum.photos/seed/shirt/600/400', categoryId: 4, sellerId: 2 },
    { id: 11, name: 'فيلا للبيع', description: 'فيلا فاخرة مع مسبح خاص وحديقة واسعة في حي هادئ.', price: 2500000, imageUrl: 'https://picsum.photos/seed/villa/600/400', categoryId: 5, sellerId: 3 },
    { id: 12, name: 'خزانة ملابس', description: 'خزانة بستة أبواب ومرايا، تصميم عصري.', price: 2200, imageUrl: 'https://picsum.photos/seed/wardrobe/600/400', categoryId: 2, sellerId: 2 },
    { id: 13, name: 'بنطلون جينز', description: 'بنطلون جينز بقصة مستقيمة، عملي ومريح.', price: 300, imageUrl: 'https://picsum.photos/seed/jeans/600/400', categoryId: 4, sellerId: 3 },
    { id: 14, name: 'هاتف ذكي حديث', description: 'أحدث هاتف ذكي في السوق بكاميرا 108 ميجابكسل وشاشة أموليد.', price: 2500, imageUrl: 'https://picsum.photos/seed/phone/600/400', categoryId: 1, sellerId: 2 },
    { id: 15, name: 'أريكة جلدية فاخرة', description: 'أريكة مريحة لثلاثة أشخاص مصنوعة من الجلد الطبيعي.', price: 3200, imageUrl: 'https://picsum.photos/seed/sofa/600/400', categoryId: 2, sellerId: 3 },
    { id: 16, name: 'طاولة طعام خشبية', description: 'طاولة طعام لستة أشخاص مع الكراسي، مصنوعة من خشب البلوط.', price: 1800, imageUrl: 'https://picsum.photos/seed/table/600/400', categoryId: 2, sellerId: 3 },
    { id: 17, name: 'قميص رجالي قطني', description: 'قميص كلاسيكي من القطن الفاخر، مثالي للعمل.', price: 250, imageUrl: 'https://picsum.photos/seed/shirt/600/400', categoryId: 4, sellerId: 2 },
    { id: 18, name: 'بنطلون جينز', description: 'بنطلون جينز بقصة مستقيمة، عملي ومريح.', price: 300, imageUrl: 'https://picsum.photos/seed/jeans/600/400', categoryId: 4, sellerId: 3 },
  ];

  private products = signal<Product[]>([]);

  constructor() {
    // Simulate async data fetching
    setTimeout(() => {
      this.products.set(this._productsData);
    }, 1500);
  }

  getProducts() {
    return this.products;
  }

  getProductById(id: number) {
    const product = this.products().find(p => p.id === id);
    return of(product).pipe(delay(300)); // Simulate network delay
  }

  addProduct(product: Omit<Product, 'id'>) {
    const newProduct: Product = {
      ...product,
      id: (this.products().length > 0 ? Math.max(...this.products().map(p => p.id)) : 0) + 1,
    };
    this.products.update(products => [...products, newProduct]);
  }
}
