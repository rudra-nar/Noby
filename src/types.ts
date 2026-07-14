export interface HotWheelsProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  scale: '1:64' | '1:43' | '1:24' | '1:18';
  series: 'HW Mainline' | 'Red Line Club' | 'Car Culture' | 'Fast & Furious' | 'Retro Entertainment' | 'Pop Culture';
  year: number;
  color: string;
  rarity: 'Common' | 'Rare' | 'Super Treasure Hunt' | 'Exclusive';
  image: string;
  description: string;
  features: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  product: HotWheelsProduct;
  quantity: number;
}

export interface FilterState {
  search: string;
  scale: string[];
  series: string[];
  year: number[];
  priceRange: [number, number];
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'year-desc' | 'rating';
}
