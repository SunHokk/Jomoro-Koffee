import { OnModuleInit } from '@nestjs/common';
export declare class PrismaService implements OnModuleInit {
    private client;
    constructor();
    get users(): import(".prisma/client").Prisma.usersDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    onModuleInit(): Promise<void>;
}
