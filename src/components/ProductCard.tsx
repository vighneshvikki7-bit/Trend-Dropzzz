import React, { useState } from 'react';
import { Product } from '../types.ts';
import { useRouter } from '../context/RouterContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { buildProductWhatsAppUrl, getProductUrl } from '../utils/whatsapp.ts';
import { ShoppingBag, Share2, Check, ExternalLink } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onShareClick?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onShareClick }) => {
  const { navigate } = useRouter();
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const discountPercent =
    product.price > product.discountPrice
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = buildProductWhatsAppUrl(product, 1);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShareClick) {
      onShareClick(product);
    } else {
      const url = getProductUrl(product.slug);
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const primaryImage = product.images?.[0] || '/src/assets/images/hero_kitchen_home_showcase_1792352797924.jpg';

  return (
    <div
      onClick={() => navigate(`/product/${product.slug}`)}
      className="group flex flex-col bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer text-left"
    >
      {/* Product Image Container */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        {!imageError ? (
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-stone-100 text-stone-400">
            <span className="font-serif text-sm font-medium text-stone-600">{product.name}</span>
            <span className="text-xs text-stone-400 mt-1">Trend Dropzz Collection</span>
          </div>
        )}

        {/* Top Floating Controls */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleShare}
            className="p-1.5 bg-white/90 backdrop-blur-xs rounded-full text-stone-700 hover:text-stone-900 hover:bg-white shadow-xs transition-colors"
            title="Share Product"
            aria-label="Share Product"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Discount Tag */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-amber-500 text-stone-950 font-bold text-[11px] px-2 py-0.5 rounded-md shadow-xs">
            {discountPercent}% OFF
          </div>
        )}

        {/* Stock Alert if Out of Stock */}
        {product.stockStatus === 'out_of_stock' && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-red-600/90 rounded-md">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Category without pill box */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
            <span className="uppercase tracking-wider font-semibold text-[11px] text-amber-800">
              {product.category}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {product.stockStatus === 'in_stock'
                ? 'In Stock'
                : product.stockStatus === 'low_stock'
                ? 'Only Few Left'
                : 'Sold Out'}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="font-medium text-stone-900 text-base line-clamp-2 leading-snug group-hover:text-amber-800 transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-2.5 flex items-baseline gap-2 tabular-nums">
            <span className="text-lg font-bold text-stone-950">
              ₹{product.discountPrice.toLocaleString('en-IN')}
            </span>
            {product.price > product.discountPrice && (
              <span className="text-xs text-stone-400 line-through">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
          {/* Buy Now (Direct WhatsApp) */}
          <button
            onClick={handleBuyNow}
            disabled={product.stockStatus === 'out_of_stock'}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            {/* WhatsApp brand svg */}
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.874.808 2.796.808 3.183 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.768-5.768-5.768zm3.364 8.167c-.144.405-.837.774-1.17.824-.312.045-.694.073-2.18-.544-1.748-.724-2.883-2.485-2.971-2.6-.088-.117-.707-.941-.707-1.796 0-.855.447-1.277.608-1.452.161-.176.353-.22.47-.22.117 0 .235.001.338.006.108.005.253-.041.396.301.147.353.5 1.22.544 1.308.044.088.073.191.015.308-.059.118-.088.192-.176.294-.088.103-.186.23-.265.31-.088.088-.18.183-.077.36.103.176.458.756.983 1.224.676.602 1.246.788 1.423.876.176.088.279.073.382-.044.103-.118.441-.515.559-.691.118-.176.235-.147.397-.088.162.059 1.029.485 1.206.574.176.088.294.132.338.206.044.074.044.426-.1.831zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.981-1.306A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
            </svg>
            <span className="whitespace-nowrap">Buy Now</span>
          </button>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stockStatus === 'out_of_stock'}
            className="p-2 border border-stone-200 hover:border-stone-900 hover:bg-stone-50 disabled:border-stone-200 disabled:opacity-40 text-stone-700 rounded-lg transition-colors cursor-pointer"
            title="Add to Shopping Cart"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
