import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ReduceStockDto } from './dto/reduce-stock.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // Get all products
  async getAllProducts() {
    return this.prisma.products.findMany({
      include: { category: true },
    });
  }

  // Get product by id
  async getProductById(id: number) {
    const product = await this.prisma.products.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  // Get all categories
  async getAllCategories() {
    return this.prisma.categories.findMany();
  }

  // Get products by category
  async getProductsByCategory(categoryId: number) {
    return this.prisma.products.findMany({
      where: { category_id: categoryId },
      include: { category: true },
    });
  }

  // Create product (Admin)
  async createProduct(dto: CreateProductDto) {
    // Validasi nama produk minimal 3 kata
    const words = dto.name.trim().split(/\s+/);
    if (words.length < 3) {
      throw new BadRequestException('Product name must contain at least 3 words');
    }

    // Validasi deskripsi minimal 20 karakter
    if (dto.description.length < 20) {
      throw new BadRequestException('Product description must have at least 20 characters');
    }

    // Validasi category_id ada
    const category = await this.prisma.categories.findUnique({
      where: { id: dto.category_id },
    });
    if (!category) {
      throw new BadRequestException('Category not found');
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

  // Update product (Admin)
  async updateProduct(id: number, dto: CreateProductDto) {
    const product = await this.prisma.products.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Validasi sama seperti create
    const words = dto.name.trim().split(/\s+/);
    if (words.length < 3) {
      throw new BadRequestException('Product name must contain at least 3 words');
    }
    if (dto.description.length < 20) {
      throw new BadRequestException('Product description must have at least 20 characters');
    }
    const category = await this.prisma.categories.findUnique({
      where: { id: dto.category_id },
    });
    if (!category) {
      throw new BadRequestException('Category not found');
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

  // Reduce stock (Admin)
  async reduceStock(id: number, dto: ReduceStockDto) {
    const product = await this.prisma.products.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (dto.quantity > product.stock) {
      throw new BadRequestException('Quantity exceeds product stock');
    }

    await this.prisma.products.update({
      where: { id },
      data: { stock: product.stock - dto.quantity },
    });

    return { message: 'Stock reduced successfully' };
  }

  // Delete product (Admin)
  async deleteProduct(id: number) {
    const product = await this.prisma.products.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.products.delete({ where: { id } });

    return { message: 'Product deleted successfully' };
  }
}