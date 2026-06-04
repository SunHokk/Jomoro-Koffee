import { TransactionService } from './transaction.service';
import { AddCartDto } from './dto/add-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
export declare class TransactionController {
    private readonly transactionService;
    constructor(transactionService: TransactionService);
    getCart(req: any): Promise<{
        cart_items: {
            product_id: number;
            name: any;
            price: any;
            quantity: number;
        }[];
    }>;
    addToCart(req: any, dto: AddCartDto): Promise<{
        message: string;
    }>;
    updateCart(req: any, productId: string, dto: UpdateCartDto): Promise<{
        message: string;
    }>;
    deleteCartItem(req: any, productId: string): Promise<{
        message: string;
    }>;
    clearCart(req: any): Promise<{
        message: string;
    }>;
    getOrders(req: any): Promise<{
        id: number;
        user_id: number;
        created_at: Date;
    }[]>;
    getOrderDetail(req: any, id: string): Promise<{
        order_id: number;
        items: {
            product_id: number;
            name: any;
            quantity: number;
            price: number;
        }[];
    }>;
    getProfile(req: any): Promise<any>;
    checkout(req: any): Promise<{
        message: string;
        order_id: number;
    }>;
}
