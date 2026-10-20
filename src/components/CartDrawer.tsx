import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { useRouter } from '../context/RouterContext.tsx';
import { buildCartWhatsAppUrl } from '../utils/whatsapp.ts';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal, totalCount, clearCart } = useCart();
  const { navigate } = useRouter();

  if (!isCartOpen) return null;

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;
    const url = buildCartWhatsAppUrl(items);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-stone-900" />
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Your Shopping Bag
              </h2>
              <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-semibold tabular-nums">
                {totalCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-medium text-stone-900 text-base mb-1">Your bag is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Explore our curated collection of Kitchen & Home accessories and add your favorite items.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/');
                  }}
                  className="px-5 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-4">
                  <img
                    src={item.product.images?.[0] || '/src/assets/images/hero_kitchen_home_showcase_1792352797924.jpg'}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg border border-stone-200 bg-stone-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          onClick={() => {
                            setIsCartOpen(false);
                            navigate(`/product/${item.product.slug}`);
                          }}
                          className="text-xs font-semibold text-stone-900 hover:text-amber-800 cursor-pointer line-clamp-2"
                        >
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-stone-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">{item.product.category}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 rounded-l transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-medium text-stone-800 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 rounded-r transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <span className="text-xs font-bold text-stone-950 tabular-nums">
                        ₹{(item.product.discountPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50/50 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900 tabular-nums">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charges</span>
                  <span className="text-emerald-700 font-medium">Confirmed on WhatsApp</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-950">
                  <span>Estimated Total</span>
                  <span className="tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* WhatsApp Checkout CTA */}
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm shadow-md transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.874.808 2.796.808 3.183 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.768-5.768-5.768zm3.364 8.167c-.144.405-.837.774-1.17.824-.312.045-.694.073-2.18-.544-1.748-.724-2.883-2.485-2.971-2.6-.088-.117-.707-.941-.707-1.796 0-.855.447-1.277.608-1.452.161-.176.353-.22.47-.22.117 0 .235.001.338.006.108.005.253-.041.396.301.147.353.5 1.22.544 1.308.044.088.073.191.015.308-.059.118-.088.192-.176.294-.088.103-.186.23-.265.31-.088.088-.18.183-.077.36.103.176.458.756.983 1.224.676.602 1.246.788 1.423.876.176.088.279.073.382-.044.103-.118.441-.515.559-.691.118-.176.235-.147.397-.088.162.059 1.029.485 1.206.574.176.088.294.132.338.206.044.074.044.426-.1.831zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.981-1.306A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                </svg>
                <span>Order via WhatsApp ({totalCount} items)</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-stone-500">
                <button
                  onClick={clearCart}
                  className="hover:text-red-600 transition-colors cursor-pointer"
                >
                  Clear Bag
                </button>
                <span className="text-stone-400">Direct order to +91 9745912447</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
