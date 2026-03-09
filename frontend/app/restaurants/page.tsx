'use client';

import Link from 'next/link';
import { useRestaurants } from '@/lib/hooks/useRestaurants';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function RestaurantsPage() {
  const { data: restaurants, isLoading, error } = useRestaurants();

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Failed to load restaurants</div>;

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Restaurants</h1>
      <div className="flex flex-col gap-4">
        {restaurants?.map((r) => (
          <Link key={r.id} href={`/restaurants/${r.id}`}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>{r.name}</CardTitle>
                {r.description && <CardDescription>{r.description}</CardDescription>}
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
