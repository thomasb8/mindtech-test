import { Controller, Get, Post, Param, Body, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService, CreateOrderDto } from './orders.service';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  create(@Req() req: { user: { id: number } }, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, dto);
  }

  @Get(':id')
  findOne(@Req() req: { user: { id: number } }, @Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id, req.user.id);
  }
}
