'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/useAuthRedirect';
import { useRestaurant } from '@/lib/hooks/useRestaurants';
import { useCreateOrder } from '@/lib/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function RestaurantPage() {
  useRequireAuth();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: restaurant, isLoading, error } = useRestaurant(Number(id));
  const createOrder = useCreateOrder();
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error || !restaurant) return <div className="p-8 text-red-500">Restaurant not found</div>;

  const setQty = (menuItemId: number, qty: number) =>
    setQuantities((prev) => ({ ...prev, [menuItemId]: Math.max(0, qty) }));

  const total = restaurant.menuItems.reduce(
    (sum, item) => sum + item.price * (quantities[item.id] ?? 0),
    0,
  );

  const handleOrder = async () => {
    const items = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([menuItemId, quantity]) => ({ menuItemId: Number(menuItemId), quantity }));

    if (items.length === 0) return;

    const order = await createOrder.mutateAsync({ restaurantId: restaurant.id, items });
    router.push(`/orders/${order.id}`);
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">{restaurant.name}</h1>
      {restaurant.description && (
        <p className="text-muted-foreground mb-6">{restaurant.description}</p>
      )}

      <div className="flex flex-col gap-3 mb-8">
        {restaurant.menuItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setQty(item.id, (quantities[item.id] ?? 0) - 1)}>
                  −
                </Button>
                <span className="w-6 text-center">{quantities[item.id] ?? 0}</span>
                <Button variant="outline" size="sm" onClick={() => setQty(item.id, (quantities[item.id] ?? 0) + 1)}>
                  +
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="font-semibold">Total: ${total.toFixed(2)}</p>
        <Button onClick={handleOrder} disabled={total === 0 || createOrder.isPending}>
          {createOrder.isPending ? 'Placing order...' : 'Place order'}
        </Button>
      </div>
      {createOrder.isError && (
        <p className="text-red-500 mt-2 text-sm">{createOrder.error?.message}</p>
      )}
    </main>
  );
}
