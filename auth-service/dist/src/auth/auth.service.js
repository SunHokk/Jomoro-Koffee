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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(dto) {
        if (!/^[a-zA-Z]+$/.test(dto.first_name)) {
            throw new common_1.BadRequestException('First name must contain letters only');
        }
        if (!/^[a-zA-Z]+$/.test(dto.last_name)) {
            throw new common_1.BadRequestException('Last name must contain letters only');
        }
        if (!/^[^\s@]+@[^\s@]+\.(com|net|org|id)$/.test(dto.email)) {
            throw new common_1.BadRequestException('Email must end with .com, .net, .org, or .id');
        }
        if (dto.password.includes(' ')) {
            throw new common_1.BadRequestException('Password cannot contain spaces');
        }
        if (dto.password.length < 8) {
            throw new common_1.BadRequestException('Password must have at least 8 characters');
        }
        if ((dto.password.match(/[0-9]/g) || []).length < 2) {
            throw new common_1.BadRequestException('Password must contain at least 2 numeric digits');
        }
        const existingUser = await this.prisma.users.findFirst({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Email already registered');
        }
        await this.prisma.users.create({
            data: {
                first_name: dto.first_name,
                last_name: dto.last_name,
                email: dto.email,
                password: dto.password,
                role: 'CUSTOMER',
            },
        });
        return { message: 'User registered successfully' };
    }
    async login(dto) {
        const user = await this.prisma.users.findFirst({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Email not found');
        }
        if (user.password !== dto.password) {
            throw new common_1.UnauthorizedException('Invalid password');
        }
        const payload = { id: user.id, role: user.role };
        const token = this.jwtService.sign(payload);
        return { access_token: token };
    }
    async getProfile(userId) {
        const user = await this.prisma.users.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        return {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map