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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const transaction_service_1 = require("./transaction.service");
const add_cart_dto_1 = require("./dto/add-cart.dto");
const update_cart_dto_1 = require("./dto/update-cart.dto");
const jwt_guard_1 = require("./jwt.guard");
let TransactionController = class TransactionController {
    transactionService;
    constructor(transactionService) {
        this.transactionService = transactionService;
    }
    getCart(req) {
        return this.transactionService.getCart(req.user.id);
    }
    addToCart(req, dto) {
        return this.transactionService.addToCart(req.user.id, dto);
    }
    updateCart(req, productId, dto) {
        return this.transactionService.updateCart(req.user.id, Number(productId), dto);
    }
    deleteCartItem(req, productId) {
        return this.transactionService.deleteCartItem(req.user.id, Number(productId));
    }
    clearCart(req) {
        return this.transactionService.clearCart(req.user.id);
    }
    getOrders(req) {
        return this.transactionService.getOrders(req.user.id);
    }
    getOrderDetail(req, id) {
        return this.transactionService.getOrderDetail(req.user.id, Number(id));
    }
    getProfile(req) {
        const token = req.headers.authorization?.split(' ')[1];
        return this.transactionService.getProfile(req.user.id, token);
    }
    checkout(req) {
        return this.transactionService.checkout(req.user.id);
    }
};
exports.TransactionController = TransactionController;
__decorate([
    (0, common_1.Get)('cart'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TransactionController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)('cart'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_cart_dto_1.AddCartDto]),
    __metadata("design:returntype", void 0)
], TransactionController.prototype, "addToCart", null);
__decorate([
    (0, common_1.Post)('cart/:product_id/update'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('product_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_cart_dto_1.UpdateCartDto]),
    __metadata("design:returntype", void 0)
], TransactionController.prototype, "updateCart", null);
__decorate([
    (0, common_1.Post)('cart/:product_id/delete'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('product_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TransactionController.prototype, "deleteCartItem", null);
__decorate([
    (0, common_1.Post)('cart/clear'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TransactionController.prototype, "clearCart", null);
__decorate([
    (0, common_1.Get)('orders'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TransactionController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Post)('orders/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TransactionController.prototype, "getOrderDetail", null);
__decorate([
    (0, common_1.Get)('profiles'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TransactionController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('orders'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TransactionController.prototype, "checkout", null);
exports.TransactionController = TransactionController = __decorate([
    (0, swagger_1.ApiTags)('Transaction'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [transaction_service_1.TransactionService])
], TransactionController);
//# sourceMappingURL=transaction.controller.js.map