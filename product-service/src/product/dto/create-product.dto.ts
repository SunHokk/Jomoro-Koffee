import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(999)
  stock: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  category_id: number;
}