'use client'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import useCartStore from "@/app/store/cartStore";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

export function CartSheet() {
    const items = useCartStore((state) => state.items);
    const totalPrice = useCartStore(state => state.totalPrice)
    const updateQuantity = useCartStore(state => state.updateQuantity)
    const updateQuantityWithSize = useCartStore(state => state.updateQuantityWithSize)
    console.log(items.map(item => item.size).join(', '))

    return (
        <Sheet >
            <SheetTitle hidden>Cart</SheetTitle>
            <SheetTrigger asChild>
                <Button variant="ghost">
                    <Image src="/cart.svg" alt="Cart" width={32} height={32} />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] px-6 py-12 sm:w-[500px]">
                <h2 className="text-xl font-bold mb-4">Your Cart</h2>
                {items.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <ul className="space-y-2">
                        {items.map((item) => (
                            <li key={item.id + item.size} className="flex flex-row justify-between items-center border-b border-gray-200 pb-4">
                                {item.image && (
                                    <div className="flex h-full w-32 flex-row items-center rounded-lg overflow-hidden gap-2">
                                        <Image src={item.image} alt={item.name} width={96} height={80} />
                                    </div>
                                )}
                                <div className="pl-6 flex flex-col w-full gap-0">
                                    <p className="font-medium">{item.name}</p>
                                    <p>{item.price}€</p>
                                    {item.size && (
                                        <div>
                                            <p className="text-sm text-gray-500">Size: {item.size}</p>
                                            <p className="text-sm items-center flex flex-row gap-2 text-gray-500">Qty: {item.quantity}
                                                <Button variant="ghost" size="icon" onClick={() => updateQuantityWithSize(item.id, item.quantity - 1, item.size!)}>
                                                    <Image src="/minus.svg" alt="-" width={16} height={16} />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => updateQuantityWithSize(item.id, item.quantity + 1, item.size!)}>
                                                    <Image src="/plus.svg" alt="+" width={16} height={16} />
                                                </Button>
                                            </p>
                                        </div>
                                    )
                                    }
                                    {
                                        !item.size && (
                                            <p className="text-sm items-center flex flex-row gap-2 text-gray-500">Qty: {item.quantity}
                                                <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                                    <Image src="/minus.svg" alt="-" width={16} height={16} />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                    <Image src="/plus.svg" alt="+" width={16} height={16} />
                                                </Button>
                                            </p>
                                        )
                                    }

                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="flex flex-row absolute bottom-6 left-6 right-6 gap-4">
                    <div className="flex flex-col gap-2 w-full">
                        <p className="text-m">Total: {totalPrice}€</p>
                        <Button className="w-full">Checkout</Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
