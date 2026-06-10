import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
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
  @ApiResponse({ status: 200, description: 'Returns list of products' })
  @Get('products')
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @ApiResponse({ status: 200, description: 'Returns product by ID' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @Get('products/:id')
  getProductById(@Param('id') id: string) {
    return this.productService.getProductById(Number(id));
  }

  @ApiResponse({ status: 200, description: 'Returns list of categories' })
  @Get('categories')
  getAllCategories() {
    return this.productService.getAllCategories();
  }

  @ApiResponse({ status: 200, description: 'Returns products by category' })
  @Get('categories/:categoryId/products')
  getProductsByCategory(@Param('categoryId') categoryId: string) {
    return this.productService.getProductsByCategory(Number(categoryId));
  }

  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('admin/products')
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('admin/products/:id/update')
  updateProduct(@Param('id') id: string, @Body() dto: CreateProductDto) {
    return this.productService.updateProduct(Number(id), dto);
  }

  @ApiResponse({ status: 200, description: 'Stock reduced successfully' })
  @ApiResponse({ status: 400, description: 'Quantity exceeds stock' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('admin/products/:id/reduce')
  reduceStock(@Param('id') id: string, @Body() dto: ReduceStockDto) {
    return this.productService.reduceStock(Number(id), dto);
  }

  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('admin/products/:id/delete')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(Number(id));
  }
}