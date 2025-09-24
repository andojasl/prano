import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  size?: string
  size_quantity?: number
}

interface CartStore {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isHydrated: boolean
  setHydrated: () => void
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updateQuantityWithSize: (id: string, quantity: number, size: string, size_quantity: number) => void
  clearCart: () => void
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      isHydrated: false,
      
      setHydrated: () => set({ isHydrated: true }),
      
      addItem: (item, quantity = 1) => set((state) => {
        const existingItem = state.items.find(i => i.id === item.id && i.size === item.size)

        if (existingItem) {
          const newQuantity = Math.min(10, existingItem.quantity + quantity) // Cap at 10
          const updatedItems = state.items.map(i =>
            i.id === item.id && i.size === item.size ? { ...i, quantity: newQuantity } : i
          )
          return {
            items: updatedItems,
            totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
            totalPrice: updatedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
          }
        } else {
          const cappedQuantity = Math.min(10, quantity) // Cap initial quantity at 10
          const newItems = [...state.items, { ...item, quantity: cappedQuantity }]
          return {
            items: newItems,
            totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0),
            totalPrice: newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
          }
        }
      }),

      getItems: () => get().items,
      getTotalItems: () => get().totalItems,
      getTotalPrice: () => get().totalPrice,
      
      removeItem: (id) => set((state) => {
        const newItems = state.items.filter(item => item.id !== id)
        return {
          items: newItems,
          totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0),
          totalPrice: newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
        }
      }),
      updateQuantity: (id, quantity) => set((state) => {
        if (quantity <= 0) {
          const newItems = state.items.filter(item => item.id !== id)
          return {
            items: newItems,
            totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0),
            totalPrice: newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
          }
        }
        
        const updatedItems = state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
        return {
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
          totalPrice: updatedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
        }
      }),
      
      updateQuantityWithSize: (id, quantity, size: string, size_quantity: number) => set((state) => {
        if (quantity <= 0) {
          const newItems = state.items.filter(item => !(item.id === id && item.size === size))
          return {
            items: newItems,
            totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0),
            totalPrice: newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
          }
        }
        
        // Cap the quantity at the maximum available stock for this size
        const maxQuantity = Math.min(quantity, size_quantity)
        
        const updatedItems = state.items.map(item =>
          item.id === id && item.size === size ? { ...item, quantity: maxQuantity } : item
        )
        return {
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
          totalPrice: updatedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
        }
      }),
      
      clearCart: () => set({
        items: [],
        totalItems: 0,
        totalPrice: 0
      })
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)

export default useCartStore