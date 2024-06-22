import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({description: 'ID of the product in the cart',example: 1})
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({description: 'Quantity of the product in the cart',example: 2})
  quantity: number;
}

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {
  @ApiProperty({description: 'ID of the product in the cart (optional for updates)',example: 1})
  productId?: number;

  @IsNumber()
  @Min(1)
  @ApiProperty({description: 'Quantity of the product in the cart (optional for updates)',example: 5})
  quantity?: number;
}