import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ReduceStockDto } from './dto/reduce-stock.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    getAllProducts(): Promise<({
        category: {
            id: number;
            name: string;
        };
    } & {
        id: number;
        name: string;
        description: string;
        price: number;
        stock: number;
        image_url: string | null;
        category_id: number;
    })[]>;
    getProductById(id: string): Promise<{
        category: {
            id: number;
            name: string;
        };
    } & {
        id: number;
        name: string;
        description: string;
        price: number;
        stock: number;
        image_url: string | null;
        category_id: number;
    }>;
    getAllCategories(): Promise<{
        id: number;
        name: string;
    }[]>;
    getProductsByCategory(categoryId: string): Promise<({
        category: {
            id: number;
            name: string;
        };
    } & {
        id: number;
        name: string;
        description: string;
        price: number;
        stock: number;
        image_url: string | null;
        category_id: number;
    })[]>;
    createProduct(dto: CreateProductDto): Promise<{
        message: string;
    }>;
    updateProduct(id: string, dto: CreateProductDto): Promise<{
        message: string;
    }>;
    reduceStock(id: string, dto: ReduceStockDto): Promise<{
        message: string;
    }>;
    deleteProduct(id: string): Promise<{
        message: string;
    }>;
}
