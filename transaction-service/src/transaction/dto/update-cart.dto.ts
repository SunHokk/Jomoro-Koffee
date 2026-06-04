import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class UpdateCartDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}