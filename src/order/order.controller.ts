import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('admin/order')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.save(createOrderDto);
  }

  @Get()
  findAll() {
    return this.orderService.find({}, ['order_items', 'user_id']);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne({ id }, ['order_items', 'user_id']);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.udpate(id, updateOrderDto);
  }
}
