export interface ExclusiveOffer {
  id: string;
  title: string;
  restaurantName: string;
  restaurantId: string;
  description: string;
  originalPrice: number;
  offerPrice: number;
  discountPercentage: number;
  imageUrl: string;
  badge: string;
  category: string; // 'shawarma' | 'pizza' | 'burger' | 'broasted' | 'dessert'
  timeLeft: string;
  isPopular?: boolean;
}

export const exclusiveOffers: ExclusiveOffer[] = [
  {
    id: 'off-house-shawarma',
    title: 'عرض الشاورما العربي الذهبي',
    restaurantName: 'House Food',
    restaurantId: '2',
    description: 'وجبة شاورما عربي صاج محمص، ثومية كريمية، مخلل وبطاطا مقرمشة',
    originalPrice: 28000,
    offerPrice: 15000,
    discountPercentage: 46,
    imageUrl: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=1200&q=85',
    badge: '🔥 حصري للغاية',
    category: 'shawarma',
    timeLeft: 'ينتهي خلال 05:30:00',
    isPopular: true,
  },
  {
    id: 'off-pizza-combo',
    title: 'عرض كومبو البيتزا العائلية',
    restaurantName: 'مطعم البيتزا الذهبية',
    restaurantId: '1',
    description: 'بيتزا عائلية سوبر سوبريم + عصير طبيعي 1L + بطاطا ودجز مجاناً',
    originalPrice: 65000,
    offerPrice: 39000,
    discountPercentage: 40,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85',
    badge: '⚡ الخيار الأفضل',
    category: 'pizza',
    timeLeft: 'ينتهي خلال 03:15:00',
    isPopular: true,
  },
  {
    id: 'off-burger-double',
    title: 'وجبة برجر تشيدر دبل عائلية',
    restaurantName: 'مطعم رويال بالاس',
    restaurantId: '3',
    description: '2 برجر لحم بلدي مشوي على الفحم غرقان صوص شيدر + بطاطا ومشروب',
    originalPrice: 42000,
    offerPrice: 25000,
    discountPercentage: 40,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=85',
    badge: '🍔 الأكثر طلباً',
    category: 'burger',
    timeLeft: 'ينتهي خلال 06:45:00',
  },
  {
    id: 'off-broasted-combo',
    title: 'وجبة بروستد 4 قطع مقرمش',
    restaurantName: 'House Food',
    restaurantId: '2',
    description: '4 قطع دجاج مقرمش ذهبي مع كولسلو، بطاطا مقلية وثومية حارة',
    originalPrice: 45000,
    offerPrice: 29000,
    discountPercentage: 35,
    imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=1200&q=85',
    badge: '🍗 توفير 16,000 ل.س',
    category: 'broasted',
    timeLeft: 'ينتهي اليوم',
  },
  {
    id: 'off-crepe-nutella',
    title: 'كريب نوتيلا بالموز والمكسرات',
    restaurantName: 'مطعم الشام الذهبي',
    restaurantId: '4',
    description: 'كريب طازج غرقان شوكولا نوتيلا، شرائح موز، فستق حلبي وآيس كريم',
    originalPrice: 22000,
    offerPrice: 12000,
    discountPercentage: 45,
    imageUrl: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=1200&q=85',
    badge: '🍫 حلو السهرة',
    category: 'dessert',
    timeLeft: 'ساعات قليلة متبقية',
  },
];
