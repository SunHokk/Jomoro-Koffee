import { OnModuleInit } from '@nestjs/common';
export declare class PrismaService implements OnModuleInit {
    private client;
    constructor();
    get categories(): import(".prisma/client").Prisma.categoriesDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get products(): import(".prisma/client").Prisma.productsDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    onModuleInit(): Promise<void>;
}
