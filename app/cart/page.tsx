'use client'
import useCartStore from '@/app/store/cartStore';

export default function CartPage() {
  const items = useCartStore(state => state.items)
  const totalPrice = useCartStore(state => state.totalPrice)
  
  return (
    <div>
      <h1>Cart</h1>
      <div>
        {items.map(item => (
          <div key={item.id}>
            <h2>{item.name}</h2>
            <p>{item.price}</p>
          </div>
        ))}
      </div>
      <p>Total Price: {totalPrice}</p>
    </div>
  );
}