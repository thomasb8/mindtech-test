require('dotenv/config');
const { PrismaClient } = require('../dist/generated/prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();

  await prisma.restaurant.createMany({
    data: [
      { name: 'Burger Palace', description: 'Classic American burgers' },
      { name: 'Pizza Roma', description: 'Authentic Italian pizza' },
      { name: 'Sushi Garden', description: 'Fresh Japanese sushi' },
    ],
  });

  const restaurants = await prisma.restaurant.findMany();

  await prisma.menuItem.createMany({
    data: [
      { name: 'Classic Burger', price: 9.99, restaurantId: restaurants[0].id },
      { name: 'Cheese Burger', price: 11.99, restaurantId: restaurants[0].id },
      { name: 'Bacon Burger', price: 13.99, restaurantId: restaurants[0].id },
      { name: 'Veggie Burger', price: 10.99, restaurantId: restaurants[0].id },
      { name: 'Fries', price: 3.99, restaurantId: restaurants[0].id },
      { name: 'Onion Rings', price: 4.99, restaurantId: restaurants[0].id },
      { name: 'Milkshake', price: 5.99, restaurantId: restaurants[0].id },
      { name: 'Margherita', price: 12.99, restaurantId: restaurants[1].id },
      { name: 'Pepperoni', price: 14.99, restaurantId: restaurants[1].id },
      { name: 'BBQ Chicken', price: 15.99, restaurantId: restaurants[1].id },
      { name: 'Four Cheese', price: 14.49, restaurantId: restaurants[1].id },
      { name: 'Calzone', price: 13.99, restaurantId: restaurants[1].id },
      { name: 'Tiramisu', price: 6.99, restaurantId: restaurants[1].id },
      { name: 'Salmon Nigiri', price: 8.99, restaurantId: restaurants[2].id },
      { name: 'Tuna Roll', price: 10.99, restaurantId: restaurants[2].id },
      { name: 'Spicy Tuna Roll', price: 11.99, restaurantId: restaurants[2].id },
      { name: 'Dragon Roll', price: 13.99, restaurantId: restaurants[2].id },
      { name: 'Edamame', price: 4.49, restaurantId: restaurants[2].id },
      { name: 'Miso Soup', price: 3.49, restaurantId: restaurants[2].id },
    ],
  });

  console.log('Seeded successfully');
}

main().catch(console.error).finally(() => prisma.$disconnect());
