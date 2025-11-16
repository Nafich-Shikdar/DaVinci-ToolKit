// For an Angular component (e.g., app.component.ts or a cart-view.component.ts)
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from './cart.service'; // Adjust path as needed
import { CartItem, Product } from './cart-item.interface'; // Adjust path as needed
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-cart-view',
    template: `
        <h2>Your Shopping Cart</h2>
        <div *ngIf="(cartItems$ | async)?.length === 0">
            <p>Your cart is empty.</p>
        </div>
        <div *ngIf="(cartItems$ | async)?.length > 0">
            <div *ngFor="let item of (cartItems$ | async)">
                <h3>{{ item.name }}</h3>
                <p>Price: \${{ item.price | number:'1.2-2' }}</p>
                <p>Quantity: {{ item.quantity }}</p>
                <button (click)="updateQuantity(item.productId, item.quantity - 1)">-</button>
                <button (click)="updateQuantity(item.productId, item.quantity + 1)">+</button>
                <button (click)="removeItem(item.productId)">Remove</button>
                <hr>
            </div>
            <h3>Total Items: {{ totalItems$ | async }}</h3>
            <h3>Total Price: \${{ totalPrice$ | async | number:'1.2-2' }}</h3>
            <button (click)="clearCart()">Clear Cart</button>
        </div>

        <h3>Add some demo products:</h3>
        <button (click)="addDemoProduct()">Add Fancy Gadget</button>
        <button (click)="addAnotherDemoProduct()">Add Cool Widget</button>
    `
})
export class CartViewComponent implements OnInit, OnDestroy {
    cartItems$: Observable<CartItem[]>;
    totalItems$: Observable<number>;
    totalPrice$: Observable<number>;

    private cartSubscription: Subscription | undefined; // To manage subscription if needed

    constructor(private cartService: CartService) {
        this.cartItems$ = this.cartService.cartItems$;
        this.totalItems$ = this.cartService.getCartTotalItems();
        this.totalPrice$ = this.cartService.getCartTotalPrice();
    }

    ngOnInit(): void {
        // You might subscribe here if you need side effects,
        // but often 'async' pipe in template is sufficient.
        // this.cartSubscription = this.cartItems$.subscribe(items => {
        //     console.log('Cart updated:', items);
        // });
    }

    addDemoProduct(): void {
        const demoProduct: Product = {
            id: 'gadget-123',
            name: 'Fancy Gadget',
            price: 99.99,
            description: 'A very fancy gadget for your daily needs.',
            imageUrl: 'https://example.com/gadget.jpg'
        };
        this.cartService.addItem(demoProduct);
    }

    addAnotherDemoProduct(): void {
        const anotherProduct: Product = {
            id: 'widget-456',
            name: 'Cool Widget',
            price: 24.50,
            description: 'A cool widget to enhance your life.',
            imageUrl: 'https://example.com/widget.jpg'
        };
        this.cartService.addItem(anotherProduct, 2); // Add 2 by default
    }

    updateQuantity(productId: string, newQuantity: number): void {
        this.cartService.updateItemQuantity(productId, newQuantity);
    }

    removeItem(productId: string): void {
        this.cartService.removeItem(productId);
    }

    clearCart(): void {
        this.cartService.clearCart();
    }

    ngOnDestroy(): void {
        // Unsubscribe to prevent memory leaks if you had manual subscriptions
        // this.cartSubscription?.unsubscribe();
    }
}
