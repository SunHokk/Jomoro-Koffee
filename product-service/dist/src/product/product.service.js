"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductService = class ProductService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllProducts() {
        return this.prisma.products.findMany({
            include: { category: true },
        });
    }
    async getProductById(id) {
        const product = await this.prisma.products.findUnique({
            where: { id },
            include: { category: true },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async getAllCategories() {
        return this.prisma.categories.findMany();
    }
    async getProductsByCategory(categoryId) {
        return this.prisma.products.findMany({
            where: { category_id: categoryId },
            include: { category: true },
        });
    }
    async createProduct(dto) {
        const words = dto.name.trim().split(/\s+/);
        if (words.length < 3) {
            throw new common_1.BadRequestException('Product name must contain at least 3 words');
        }
        if (dto.description.length < 20) {
            throw new common_1.BadRequestException('Product description must have at least 20 characters');
        }
        const category = await this.prisma.categories.findUnique({
            where: { id: dto.category_id },
        });
        if (!category) {
            throw new common_1.BadRequestException('Category not found');
        }
        await this.prisma.products.create({
            data: {
                name: dto.name,
                description: dto.description,
                price: dto.price,
                stock: dto.stock,
                image_url: dto.image_url || null,
                category_id: dto.category_id,
            },
        });
        return { message: 'Product created successfully' };
    }
    async updateProduct(id, dto) {
        const product = await this.prisma.products.findUnique({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const words = dto.name.trim().split(/\s+/);
        if (words.length < 3) {
            throw new common_1.BadRequestException('Product name must contain at least 3 words');
        }
        if (dto.description.length < 20) {
            throw new common_1.BadRequestException('Product description must have at least 20 characters');
        }
        const category = await this.prisma.categories.findUnique({
            where: { id: dto.category_id },
        });
        if (!category) {
            throw new common_1.BadRequestException('Category not found');
        }
        await this.prisma.products.update({
            where: { id },
            data: {
                name: dto.name,
                description: dto.description,
                price: dto.price,
                stock: dto.stock,
                image_url: dto.image_url || null,
                category_id: dto.category_id,
            },
        });
        return { message: 'Product updated successfully' };
    }
    async reduceStock(id, dto) {
        const product = await this.prisma.products.findUnique({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (dto.quantity > product.stock) {
            throw new common_1.BadRequestException('Quantity exceeds product stock');
        }
        await this.prisma.products.update({
            where: { id },
            data: { stock: product.stock - dto.quantity },
        });
        return { message: 'Stock reduced successfully' };
    }
    async deleteProduct(id) {
        const product = await this.prisma.products.findUnique({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        await this.prisma.products.delete({ where: { id } });
        return { message: 'Product deleted successfully' };
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductService);
//# sourceMappingURL=product.service.js.map