import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { LinkModule } from './link/link.module';
import { SharedModule } from './shared/shared.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 33066,
      username: 'root',
      password: 'root',
      database: 'ambassador',
      autoLoadEntities: true,
      synchronize: true,
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    AuthModule,
    ProductModule,
    OrderModule,
    LinkModule,
    SharedModule,
  ],
})
export class AppModule {}
