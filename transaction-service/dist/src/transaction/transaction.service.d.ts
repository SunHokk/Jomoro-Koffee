import { PrismaService } from '../prisma/prisma.service';
import { AddCartDto } from './dto/add-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
export declare class TransactionService {
    private prisma;
    constructor(prisma: PrismaService);
    getCart(userId: number): Promise<{
        cart_items: {
            product_id: number;
            name: any;
            price: any;
            quantity: number;
        }[];
    }>;
    addToCart(userId: number, dto: AddCartDto): Promise<{
        message: string;
    }>;
    updateCart(userId: number, productId: number, dto: UpdateCartDto): Promise<{
        message: string;
    }>;
    deleteCartItem(userId: number, productId: number): Promise<{
        message: string;
    }>;
    clearCart(userId: number): Promise<{
        message: string;
    }>;
    getOrders(userId: number): Promise<{
        id: number;
        user_id: number;
        created_at: Date;
    }[]>;
    getOrderDetail(userId: number, orderId: number): Promise<{
        order_id: number;
        items: {
            product_id: number;
            name: any;
            quantity: number;
            price: number;
        }[];
    }>;
    getProfile(userId: number, token: string): Promise<any>;
    checkout(userId: number): Promise<{
        message: string;
        order_id: number;
    }>;
}
