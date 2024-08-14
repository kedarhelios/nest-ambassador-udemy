import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductCreateDto } from './dto/productCreate.dto';
import { ProductUpdateDto } from './dto/productUpdate.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';
import { Product } from './entity/product';

@Controller('admin')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private eventEmitter2: EventEmitter2,
  ) {}

  @Get('products')
  async all() {
    return await this.productService.find({});
  }

  @Post('products')
  async create(@Body() productBody: ProductCreateDto) {
    const product = await this.productService.save(productBody);
    this.eventEmitter2.emit('product_updated');
    return product;
  }

  @Get('products/:id')
  async get(@Param('id') id: string) {
    return await this.productService.findOne({ id });
  }

  @Put('products/:id')
  async update(@Param('id') id: string, @Body() productBody: ProductUpdateDto) {
    await this.productService.udpate(id, productBody);

    this.eventEmitter2.emit('product_updated');

    return await this.productService.findOne({ id });
  }

  @CacheKey('products_frontend')
  @CacheTTL(30 * 60)
  @UseInterceptors(CacheInterceptor)
  @Get('ambassador/products/frontend')
  async frontend() {
    return await this.productService.find({});
  }

  @Get('ambassador/products/backend')
  async backend(@Req() req: Request) {
    let products = await this.cacheManager.get<Product[]>('products_backend');
    if (!products) {
      products = await this.productService.find({});
      await this.cacheManager.set('products_backend', products, 1800);
    }

    if (req.query.s) {
      const s = req.query.s.toString().toLowerCase();
      products = products.filter(
        (val) => val.title.toLowerCase().indexOf(s) >= 0,
      );
    }

    const page = parseInt(req.query.page as string) || 1;

    const limit = 9;
    const data = products.slice((page - 1) * limit, page * limit);
    const total = products.length;

    return {
      data,
      total,
      page,
      last_page: Math.ceil(total / limit),
    };
  }
}
