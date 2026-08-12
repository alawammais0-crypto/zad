import { create } from 'zustand';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  restaurantName: string;
  restaurantImage: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';
  statusText: string;
  estimatedTime: string;
  createdAt: string;
  deliveryAddress: string;
}

const defaultOrders: Order[] = [
  {
    id: 'ord-101',
    orderNumber: '#YF-8921',
    restaurantName: 'مطعم رويال بالاس',
    restaurantImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=90',
    items: [
      { name: 'وجبة بيتزا سوبر سوبريم عائلية', quantity: 1, price: 65000 },
      { name: 'عصير برتقال طازج 1L', quantity: 2, price: 15000 },
    ],
    subtotal: 95000,
    deliveryFee: 3000,
    total: 98000,
    status: 'on_the_way',
    statusText: 'السائق في الطريق إليك 🛵',
    estimatedTime: '15-20 دقيقة',
    createdAt: 'اليوم، 01:15 م',
    deliveryAddress: 'السويداء - العجيلات (بجانب مدرسة المتفوقين)',
  },
  {
    id: 'ord-100',
    orderNumber: '#YF-7743',
    restaurantName: 'مطعم البيتزا الذهبية',
    restaurantImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=90',
    items: [
      { name: 'بيتزا مارجريتا كلاسيك', quantity: 2, price: 45000 },
    ],
    subtotal: 90000,
    deliveryFee: 3000,
    total: 93000,
    status: 'delivered',
    statusText: 'تم التوصيل بنجاح',
    estimatedTime: 'مكتمل',
    createdAt: 'أمس، 08:30 م',
    deliveryAddress: 'السويداء - العجيلات',
  },
];

interface OrdersState {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  cancelOrder: (id: string) => void;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: defaultOrders,

  addOrder: (newOrderData) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...newOrderData,
      id: `ord-${Date.now()}`,
      orderNumber: `#YF-${randomNum}`,
      createdAt: 'الآن',
    };

    set((state) => ({
      orders: [newOrder, ...state.orders],
    }));

    return newOrder;
  },

  cancelOrder: (id) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id
          ? { ...o, status: 'cancelled', statusText: 'تم إلغاء الطلب' }
          : o
      ),
    }));
  },
}));
