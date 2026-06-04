import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ReduceStockDto } from './dto/reduce-stock.dto';
export declare class ProductService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllProducts(): Promise<({
        category: {
            name: string;
            id: number;
        };
    } & {
        name: string;
        description: string;
        price: number;
        stock: number;
        image_url: string | null;
        category_id: number;
        id: number;
    })[]>;
    getProductById(id: number): Promise<{
        category: {
            name: string;
            id: number;
        };
    } & {
        name: string;
        description: string;
        price: number;
        stock: number;
        image_url: string | null;
        category_id: number;
        id: number;
    }>;
    getAllCategories(): Promise<{
        name: string;
        id: number;
    }[]>;
    getProductsByCategory(categoryId: number): Promise<({
        category: {
            name: string;
            id: number;
        };
    } & {
        name: string;
        description: string;
        price: number;
        stock: number;
        image_url: string | null;
        category_id: number;
        id: number;
    })[]>;
    createProduct(dto: CreateProductDto): Promise<{
        message: string;
    }>;
    updateProduct(id: number, dto: CreateProductDto): Promise<{
        message: string;
    }>;
    reduceStock(id: number, dto: ReduceStockDto): Promise<{
        message: string;
    }>;
    deleteProduct(id: number): Promise<{
        message: string;
    }>;
}
