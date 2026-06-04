import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ReduceStockDto } from './dto/reduce-stock.dto';
import { JwtGuard } from './jwt.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@ApiTags('Products')
@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Guest endpoints
  @Get('products')
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get('products/:id')
  getProductById(@Param('id') id: string) {
    return this.productService.getProductById(Number(id));
  }

  @Get('categories')
  getAllCategories() {
    return this.productService.getAllCategories();
  }

  @Get('categories/:categoryId/products')
  getProductsByCategory(@Param('categoryId') categoryId: string) {
    return this.productService.getProductsByCategory(Number(categoryId));
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('admin/products')
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('admin/products/:id/update')
  updateProduct(@Param('id') id: string, @Body() dto: CreateProductDto) {
    return this.productService.updateProduct(Number(id), dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('admin/products/:id/reduce')
  reduceStock(@Param('id') id: string, @Body() dto: ReduceStockDto) {
    return this.productService.reduceStock(Number(id), dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('admin/products/:id/delete')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(Number(id));
  }
}