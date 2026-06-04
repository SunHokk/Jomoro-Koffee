import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: 'jomoro_secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService, JwtStrategy],
})
export class ProductModule {}