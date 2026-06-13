export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  salePrice: number | null;
  image: string;
  category: string;
  isNew: boolean;
  isBest: boolean;
}
