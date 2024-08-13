import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductCreateDto } from './dto/productCreate.dto';
import { ProductUpdateDto } from './dto/productUpdate.dto';

@Controller('admin')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('products')
  async all() {
    return await this.productService.find({});
  }

  @Post('products')
  async create(@Body() productBody: ProductCreateDto) {
    return await this.productService.save(productBody);
  }

  @Get('products/:id')
  async get(@Param('id') id: string) {
    return await this.productService.findOne({ id });
  }

  @Put('products/:id')
  async update(@Param('id') id: number, @Body() productBody: ProductUpdateDto) {
    await this.productService.udpate(id, productBody);
    return await this.productService.findOne({ id });
  }
}
