import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
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
  @Get('cart')
  getCart(@Request() req) {
    return this.transactionService.getCart(req.user.id);
  }

  @Post('cart')
  addToCart(@Request() req, @Body() dto: AddCartDto) {
    return this.transactionService.addToCart(req.user.id, dto);
  }

  @Post('cart/:product_id/update')
  updateCart(@Request() req, @Param('product_id') productId: string, @Body() dto: UpdateCartDto) {
    return this.transactionService.updateCart(req.user.id, Number(productId), dto);
  }

  @Post('cart/:product_id/delete')
  deleteCartItem(@Request() req, @Param('product_id') productId: string) {
    return this.transactionService.deleteCartItem(req.user.id, Number(productId));
  }

  @Post('cart/clear')
  clearCart(@Request() req) {
    return this.transactionService.clearCart(req.user.id);
  }

  // Order endpoints
  @Get('orders')
  getOrders(@Request() req) {
    return this.transactionService.getOrders(req.user.id);
  }

  @Post('orders/:id')
  getOrderDetail(@Request() req, @Param('id') id: string) {
    return this.transactionService.getOrderDetail(req.user.id, Number(id));
  }

  // Profile endpoint
  @Get('profiles')
  getProfile(@Request() req) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.transactionService.getProfile(req.user.id, token);
  }

  // Checkout endpoint
  @Post('orders')
  checkout(@Request() req) {
    return this.transactionService.checkout(req.user.id);
  }
}