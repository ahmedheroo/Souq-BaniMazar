import { ProductsDto } from "./products-dto";

export interface CategoriesWithProductsDto {
    categoryId: number;
    categoryName: string;
    productsCount:number;
    products: ProductsDto[];
}
