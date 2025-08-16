export interface ItemVariant {
  id?: number;
  variant_name: string;
  price: number;
  item_id?: number;
}

export interface Item {
  id?: number;
  name: string;
  category?: string;
  unit?: string;
  description?: string;
  variants?: ItemVariant[];
}