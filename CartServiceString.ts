// cart-item.interface.ts
export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string; // Optional image URL
}

// product.interface.ts (for items that can be added to cart)
export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl?: string;
}
