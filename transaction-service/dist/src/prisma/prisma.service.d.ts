import { OnModuleInit } from '@nestjs/common';
export declare class PrismaService implements OnModuleInit {
    private client;
    constructor();
    get carts(): import(".prisma/client").Prisma.cartsDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get cart_items(): import(".prisma/client").Prisma.cart_itemsDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get orders(): import(".prisma/client").Prisma.ordersDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get order_details(): import(".prisma/client").Prisma.order_detailsDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    onModuleInit(): Promise<void>;
}
