import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CreateOrderDto {
  restaurantId: number;
  items: { menuItemId: number; quantity: number }[];
}

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateOrderDto) {
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        id: { in: dto.items.map((i) => i.menuItemId) },
        restaurantId: dto.restaurantId,
      },
    });

    if (menuItems.length !== dto.items.length) {
      throw new BadRequestException('Some menu items do not belong to this restaurant');
    }

    return this.prisma.order.create({
      data: {
        userId,
        restaurantId: dto.restaurantId,
        items: {
          create: dto.items.map((i) => ({
            menuItemId: i.menuItemId,
            quantity: i.quantity,
          })),
        },
      },
      include: { items: { include: { menuItem: true } }, restaurant: true },
    });
  }

  async findOne(id: number, userId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { menuItem: true } }, restaurant: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new NotFoundException('Order not found');
    return order;
  }
}
