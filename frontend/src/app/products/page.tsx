'use client';
import { useParams } from 'next/navigation';

export default function ProductsPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Product ID: {id}</h1>
    </div>
  );
}