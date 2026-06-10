import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { AddCartDto } from './dto/add-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtGuard } from './jwt.guard';

@ApiTags('Transaction')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // Cart endpoints
  @ApiResponse({ status: 200, description: 'Returns cart items' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('cart')
  getCart(@Request() req) {
    return this.transactionService.getCart(req.user.id);
  }

  @ApiResponse({ status: 201, description: 'Product added to cart successfully' })
  @ApiResponse({ status: 400, description: 'Quantity exceeds stock / product already in cart' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('cart')
  addToCart(@Request() req, @Body() dto: AddCartDto) {
    return this.transactionService.addToCart(req.user.id, dto);
  }

  @ApiResponse({ status: 200, description: 'Cart updated successfully' })
  @ApiResponse({ status: 400, description: 'Quantity exceeds stock' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @Post('cart/:product_id/update')
  updateCart(@Request() req, @Param('product_id') productId: string, @Body() dto: UpdateCartDto) {
    return this.transactionService.updateCart(req.user.id, Number(productId), dto);
  }

  @ApiResponse({ status: 200, description: 'Product removed from cart successfully' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @Post('cart/:product_id/delete')
  deleteCartItem(@Request() req, @Param('product_id') productId: string) {
    return this.transactionService.deleteCartItem(req.user.id, Number(productId));
  }

  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @Post('cart/clear')
  clearCart(@Request() req) {
    return this.transactionService.clearCart(req.user.id);
  }

  // Order endpoints
  @ApiResponse({ status: 200, description: 'Returns list of orders' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('orders')
  getOrders(@Request() req) {
    return this.transactionService.getOrders(req.user.id);
  }

  @ApiResponse({ status: 200, description: 'Returns order detail' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @Post('orders/:id')
  getOrderDetail(@Request() req, @Param('id') id: string) {
    return this.transactionService.getOrderDetail(req.user.id, Number(id));
  }

  // Profile endpoint
  @ApiResponse({ status: 200, description: 'Returns user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('profiles')
  getProfile(@Request() req) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.transactionService.getProfile(req.user.id, token);
  }

  // Checkout endpoint
  @ApiResponse({ status: 201, description: 'Checkout successful, returns order_id' })
  @ApiResponse({ status: 400, description: 'Cart is empty' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('orders')
  checkout(@Request() req) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.transactionService.checkout(req.user.id, token);
  }
}