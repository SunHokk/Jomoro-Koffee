import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
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
  controllers: [TransactionController],
  providers: [TransactionService, JwtStrategy],
})
export class TransactionModule {}