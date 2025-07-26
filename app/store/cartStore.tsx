import { create } from 'zustand'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartStore {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,
  
  addItem: (item) => set((state) => {
    const existingItem = state.items.find(i => i.id === item.id)
    
    if (existingItem) {
      const updatedItems = state.items.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      )
      return {
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: updatedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
      }
    } else {
      const newItems = [...state.items, { ...item, quantity: 1 }]
      return {
        items: newItems,
        totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
      }
    }
  }),
  
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
  
  clearCart: () => set({
    items: [],
    totalItems: 0,
    totalPrice: 0
  })
}))

export default useCartStore