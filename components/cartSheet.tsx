"use client";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useCartStore from "@/app/store/cartStore";
import Image from "next/image";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function CartSheet() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.totalItems);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const updateQuantityWithSize = useCartStore(
    (state) => state.updateQuantityWithSize,
  );
  const clearCart = useCartStore((state) => state.clearCart);
  console.log(items.map((item) => item.size).join(", "));

  const handleCheckout = () => {
    setIsOpen(false); // Close the sheet
    router.push("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTitle hidden>Cart</SheetTitle>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative">
          <Image src="/icons/cart.svg" alt="Cart" width={32} height={32} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] px-6 py-12 sm:w-[500px]">
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>
        {items.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id + item.size}
                className="flex flex-row justify-between items-center border-b border-gray-200 pb-4"
              >
                {item.image && (
                  <div className="flex h-32 w-32 flex-row items-center rounded-lg overflow-hidden gap-2">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={96}
                      height={96}
                    />
                  </div>
                )}
                <div className="pl-6 flex flex-col w-full gap-0">
                  <div className="flex flex-row justify-between">
                    <p className="font-medium text-xs">{item.name}</p>
                    <p className="text-xs">{item.price}€</p>
                  </div>
                  {item.size && (
                    <div>
                      <p className="text-xs text-gray-500">Size: {item.size}</p>
                      <p className="text-xs items-center flex flex-row gap-2 text-gray-500">
                        Qty: {item.quantity}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            updateQuantityWithSize(
                              item.id,
                              item.quantity - 1,
                              item.size!,
                              item.size_quantity || 999,
                            )
                          }
                        >
                          <Image
                            src="icons/minus.svg"
                            alt="-"
                            width={12}
                            height={12}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={item.quantity >= 10}
                          onClick={() =>
                            updateQuantityWithSize(
                              item.id,
                              item.quantity + 1,
                              item.size!,
                              item.size_quantity || 999,
                            )
                          }
                        >
                          <Image
                            src="icons/plus.svg"
                            alt="+"
                            width={12}
                            height={12}
                          />
                        </Button>
                      </p>
                    </div>
                  )}
                  {!item.size && (
                    <p className="text-xs items-center flex flex-row gap-2 text-gray-500">
                      Qty: {item.quantity}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Image
                          src="icons/minus.svg"
                          alt="-"
                          width={12}
                          height={12}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={item.quantity >= 10}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Image
                          src="icons/plus.svg"
                          alt="+"
                          width={12}
                          height={12}
                        />
                      </Button>
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        {items.length > 0 && (
          <div className="flex flex-row justify-end w-full">
            <Button
              variant="ghost"
              onClick={() => clearCart()}
              className=" hover:underline"
            >
              Clear cart
            </Button>
          </div>
        )}
        <div className="flex flex-row absolute bottom-6 left-6 right-6 gap-4">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-row justify-between">
              <p className="text-m">Total:</p>
              <p>{totalPrice}€</p>
            </div>
            {items.length > 0 && (
              <Button className="w-full" onClick={handleCheckout}>
                Checkout
              </Button>
            )}
            {items.length === 0 && (
              <Button className="w-full" variant="inactive">
                Checkout
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
