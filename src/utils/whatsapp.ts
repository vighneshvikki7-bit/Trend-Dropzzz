import { Product, CartItem } from '../types.ts';
import { STORE_CONFIG } from '../data/initialProducts.ts';

export function getProductUrl(slug: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/product/${slug}`;
  }
  return `https://trenddropzz.com/product/${slug}`;
}

/**
 * Builds the official WhatsApp click-to-chat URL for a single product Buy Now action.
 * Complies strictly with the user's requested template:
 * 
 * Hello Trend Dropzz! I want to order this product.
 * 
 * Product Name: [Product Name]
 * Product Link: [Product URL]
 * Price: ₹[Product Price]
 * Quantity: [Quantity]
 * 
 * Please confirm product availability, delivery charges and delivery time.
 */
export function buildProductWhatsAppUrl(product: Product, quantity: number = 1): string {
  const productUrl = getProductUrl(product.slug);
  const formattedPrice = product.discountPrice.toLocaleString('en-IN');

  const message = 
`Hello Trend Dropzz! I want to order this product.

Product Name: ${product.name}
Product Link: ${productUrl}
Price: ₹${formattedPrice}
Quantity: ${quantity}

Please confirm product availability, delivery charges and delivery time.`;

  const phone = STORE_CONFIG.whatsappNumber; // '919745912447'
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds the WhatsApp order URL for multi-item cart orders.
 */
export function buildCartWhatsAppUrl(items: CartItem[]): string {
  const phone = STORE_CONFIG.whatsappNumber;
  const itemsText = items
    .map((item, idx) => {
      const itemUrl = getProductUrl(item.product.slug);
      const itemTotal = (item.product.discountPrice * item.quantity).toLocaleString('en-IN');
      return `${idx + 1}. ${item.product.name} (Qty: ${item.quantity}) - ₹${itemTotal}\n   Link: ${itemUrl}`;
    })
    .join('\n\n');

  const grandTotal = items
    .reduce((sum, item) => sum + item.product.discountPrice * item.quantity, 0)
    .toLocaleString('en-IN');

  const message =
`Hello Trend Dropzz! I want to order the following products from my cart:

${itemsText}

Total Items: ${items.reduce((s, i) => s + i.quantity, 0)}
Total Order Value: ₹${grandTotal}

Please confirm product availability, delivery charges and delivery time.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds a direct general assistance WhatsApp link.
 */
export function buildGeneralSupportWhatsAppUrl(): string {
  const phone = STORE_CONFIG.whatsappNumber;
  const message = `Hello Trend Dropzz! I am browsing your online store and have a question about your Kitchen & Home accessories.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
