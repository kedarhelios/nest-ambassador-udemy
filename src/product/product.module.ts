import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/product';
import { SharedModule } from 'src/shared/shared.module';
import { ProductListener } from './listeners/product.listener';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), SharedModule],
  controllers: [ProductController],
  providers: [ProductService, ProductListener],
})
export class ProductModule {}
