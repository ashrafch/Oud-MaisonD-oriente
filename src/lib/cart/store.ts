import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types/catalog';
import type { Coupon } from '@/lib/supabase/coupons';

export type CartItem = { productId: string; quantity: number };
export type ToastMessage = { id: string; title: string; description?: string; tone?: 'success' | 'info' | 'warning' };
export type CustomerDraft = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  notes?: string;
};
export type Order = {
  id: string;
  items: CartItem[];
  customer: CustomerDraft;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'new' | 'paid' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
};

type CartState = {
  items: CartItem[];
  catalogProducts: Product[];
  wishlist: string[];
  orders: Order[];
  recentlyViewed: string[];
  couponCode: string;
  isCartDrawerOpen: boolean;
  toast?: ToastMessage;
  addItem: (productId: string, product?: Product) => void;
  syncProducts: (products: Product[]) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleWishlist: (productId: string) => void;
  addRecentlyViewed: (productId: string) => void;
  setCouponCode: (code: string) => void;
  createOrder: (order: Omit<Order, 'id' | 'status' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  notify: (message: Omit<ToastMessage, 'id'>) => void;
  dismissToast: () => void;
};

export const formatPrice = (value: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);

export function mergeProducts(...productSets: Product[][]): Product[] {
  const products = new Map<string, Product>();
  productSets.flat().forEach((product) => {
    if (!products.has(product.id)) products.set(product.id, product);
  });
  return [...products.values()];
}

export const calculateCart = (items: CartItem[], products: Product[], couponCode = '', coupons?: Coupon[]) => {
  const subtotal = items.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  const normalizedCoupon = couponCode.trim().toUpperCase();
  const availableCoupons = coupons ?? [
    { code: 'OUDE10', type: 'percent', value: 10, active: true },
    { code: 'WELCOME15', type: 'percent', value: 15, active: true }
  ];
  const coupon = availableCoupons.find((entry) => entry.active && entry.code.toUpperCase() === normalizedCoupon);
  const discount = coupon?.type === 'percent' ? subtotal * (coupon.value / 100) : coupon?.type === 'fixed' ? coupon.value : 0;
  const shipping = subtotal - discount >= 79 || subtotal === 0 ? 0 : 6.9;
  return { subtotal, discount, shipping, total: Math.max(0, subtotal - discount + shipping) };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      catalogProducts: [],
      wishlist: [],
      orders: [],
      recentlyViewed: [],
      couponCode: '',
      isCartDrawerOpen: false,
      addItem: (productId, product) => set((state) => {
        const existing = state.items.find((item) => item.productId === productId);
        const items = existing
          ? state.items.map((item) => item.productId === productId ? { ...item, quantity: Math.min(item.quantity + 1, 99) } : item)
          : [...state.items, { productId, quantity: 1 }];
        return {
          items,
          catalogProducts: product ? mergeProducts([product], state.catalogProducts) : state.catalogProducts,
          isCartDrawerOpen: true,
          toast: { id: crypto.randomUUID(), title: 'Aggiunto al carrello', description: 'Il prodotto è pronto per il checkout.', tone: 'success' }
        };
      }),
      syncProducts: (products) => set((state) => ({
        catalogProducts: mergeProducts(products, state.catalogProducts)
      })),
      setQuantity: (productId, quantity) => set((state) => ({
        items: quantity <= 0
          ? state.items.filter((item) => item.productId !== productId)
          : state.items.map((item) => item.productId === productId ? { ...item, quantity: Math.min(quantity, 99) } : item)
      })),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter((item) => item.productId !== productId),
        toast: { id: crypto.randomUUID(), title: 'Prodotto rimosso', tone: 'info' }
      })),
      clearCart: () => set({ items: [], couponCode: '' }),
      openCartDrawer: () => set({ isCartDrawerOpen: true }),
      closeCartDrawer: () => set({ isCartDrawerOpen: false }),
      addRecentlyViewed: (productId) => set((state) => ({
        recentlyViewed: [productId, ...state.recentlyViewed.filter((item) => item !== productId)].slice(0, 8)
      })),
      toggleWishlist: (productId) => set((state) => {
        const wishlist = state.wishlist.includes(productId)
          ? state.wishlist.filter((item) => item !== productId)
          : [...state.wishlist, productId];
        return {
          wishlist,
          toast: {
            id: crypto.randomUUID(),
            title: wishlist.includes(productId) ? 'Salvato in wishlist' : 'Rimosso dalla wishlist',
            tone: 'success'
          }
        };
      }),
      setCouponCode: (couponCode) => set({
        couponCode,
        toast: couponCode ? { id: crypto.randomUUID(), title: 'Coupon applicato', description: couponCode.toUpperCase(), tone: 'success' } : undefined
      }),
      createOrder: (orderInput) => {
        const order: Order = {
          ...orderInput,
          id: `OUDE-${Date.now().toString().slice(-7)}`,
          status: 'new',
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          orders: [order, ...state.orders],
          items: [],
          couponCode: '',
          toast: { id: crypto.randomUUID(), title: 'Ordine creato', description: order.id, tone: 'success' }
        }));
        return order;
      },
      updateOrderStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map((order) => order.id === orderId ? { ...order, status } : order),
        toast: { id: crypto.randomUUID(), title: 'Stato ordine aggiornato', tone: 'success' }
      })),
      notify: (message) => set({ toast: { ...message, id: crypto.randomUUID() } }),
      dismissToast: () => set({ toast: undefined })
    }),
    { name: 'oude-commerce-store', partialize: (state) => ({ items: state.items, catalogProducts: state.catalogProducts, wishlist: state.wishlist, orders: state.orders, couponCode: state.couponCode, recentlyViewed: state.recentlyViewed }) }
  )
);

export function getStoredProducts(seedProducts: Product[]): Product[] {
  if (typeof window === 'undefined') return seedProducts;
  const raw = window.localStorage.getItem('oude-products');
  if (!raw) return seedProducts;
  try {
    const custom = JSON.parse(raw) as Product[];
    const seedIds = new Set(seedProducts.map((product) => product.id));
    return [...custom.filter((product) => !seedIds.has(product.id)), ...seedProducts];
  } catch {
    return seedProducts;
  }
}

export function setStoredProducts(products: Product[]) {
  window.localStorage.setItem('oude-products', JSON.stringify(products));
}
