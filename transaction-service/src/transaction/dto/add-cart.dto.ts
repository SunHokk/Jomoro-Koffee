import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class AddCartDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  product_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}