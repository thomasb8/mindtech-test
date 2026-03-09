'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useOrder } from '@/lib/hooks/useOrders';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useOrder(Number(id));

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error || !order) return <div className="p-8 text-red-500">Order not found</div>;

  const total = order.items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Order #{order.id}</h1>
      <p className="text-muted-foreground mb-6">
        {order.restaurant.name} &middot; <span className="capitalize">{order.status}</span>
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Items</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.menuItem.name} × {item.quantity}
              </span>
              <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Link href="/restaurants" className="text-sm underline underline-offset-4">
        Back to restaurants
      </Link>
    </main>
  );
}
