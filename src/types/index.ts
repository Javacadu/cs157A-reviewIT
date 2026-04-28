export interface User {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
}

export interface Item {
  id: number;
  name: string;
  description: string | null;
  category_id: number;
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface Review {
  id: number;
  item_id: number;
  user_id: number;
  rating: number;
  title: string;
  body: string | null;
  created_at: Date;
  updated_at: Date;
}

// Joined / enriched types used in UI responses
export interface ReviewWithUser extends Review {
  username: string;
}

export interface ReviewWithItem extends Review {
  item_name: string;
}

export interface ItemWithCategory extends Item {
  category_name: string;
}

// Full item details with category name and creator username
export interface ItemWithDetails extends Item {
  category_name: string;
  creator_username: string;
}
