import React, { useState, useEffect } from 'react';
import { Product } from '../types.ts';
import { api } from '../services/api.ts';
import { useRouter } from '../context/RouterContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { buildProductWhatsAppUrl, getProductUrl } from '../utils/whatsapp.ts';
import { ShareModal } from '../components/ShareModal.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import { STORE_CONFIG } from '../data/initialProducts.ts';
import {
  ShoppingBag,
  Share2,
  Check,
  ShieldCheck,
  Truck,
  ArrowLeft,
  ChevronRight,
  Plus,
  Minus,
  Phone,
  PackageCheck,
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const { navigate } = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const found = await api.getProduct(slug);
        if (isMounted && found) {
          setProduct(found);
          setSelectedImageIndex(0);
          setQuantity(1);

          // Fetch related items from same category
          const all = await api.getProducts({ category: found.category });
          if (isMounted) {
            setRelatedProducts(all.filter((p) => p.id !== found.id).slice(0, 4));
          }
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProductData();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse space-y-8">
        <div className="h-6 bg-stone-200 rounded w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 aspect-4/3 bg-stone-200 rounded-2xl" />
          <div className="lg:col-span-5 space-y-4">
            <div className="h-8 bg-stone-200 rounded w-3/4" />
            <div className="h-6 bg-stone-200 rounded w-1/3" />
            <div className="h-24 bg-stone-200 rounded" />
            <div className="h-12 bg-stone-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Product Not Found</h2>
        <p className="text-sm text-stone-500">
          The product you are looking for is either unavailable or has been removed.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  const discountPercent =
    product.price > product.discountPrice
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

  const currentImageUrl =
    product.images?.[selectedImageIndex] ||
    product.images?.[0] ||
    '/src/assets/images/hero_kitchen_home_showcase_1792352797924.jpg';

  // Handle direct WhatsApp Buy Now
  const handleBuyNow = () => {
    const url = buildProductWhatsAppUrl(product, quantity);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleCopyLink = () => {
    const url = getProductUrl(product.slug);
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <button
          onClick={() => navigate('/')}
          className="hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <button
          onClick={() => {
            if (product.category.toLowerCase().includes('kitchen')) {
              navigate('/category/kitchen-accessories');
            } else {
              navigate('/category/home-accessories');
            }
          }}
          className="hover:text-stone-900 transition-colors cursor-pointer"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-stone-800 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid: Gallery Left + Contiguous Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/3 w-full bg-stone-100 rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
            <img
              src={currentImageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-amber-500 text-stone-950 text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                SAVE {discountPercent}%
              </span>
            )}

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-xs rounded-full text-stone-700 hover:text-stone-900 hover:bg-white shadow-sm transition-colors cursor-pointer"
              title="Share Product"
              aria-label="Share Product"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Multiple Image Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImageIndex === index
                      ? 'border-amber-600 ring-2 ring-amber-600/20'
                      : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            {/* Category & Stock Tag */}
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
              <span className="uppercase tracking-wider font-semibold text-amber-800">
                {product.category}
              </span>
              <span aria-hidden="true">·</span>
              <span
                className={`font-medium ${
                  product.stockStatus === 'in_stock'
                    ? 'text-emerald-700'
                    : product.stockStatus === 'low_stock'
                    ? 'text-amber-700'
                    : 'text-red-600'
                }`}
              >
                {product.stockStatus === 'in_stock'
                  ? 'In Stock & Ready to Dispatch'
                  : product.stockStatus === 'low_stock'
                  ? 'Low Stock (Few pieces left)'
                  : 'Currently Out of Stock'}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
              {product.name}
            </h1>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-stone-950 tabular-nums">
                ₹{product.discountPrice.toLocaleString('en-IN')}
              </span>
              {product.price > product.discountPrice && (
                <span className="text-base text-stone-400 line-through tabular-nums">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
                {discountPercent}% Savings
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Select Quantity:
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-2 text-stone-600 hover:text-stone-950 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-semibold text-stone-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs text-stone-500 tabular-nums">
                Total: <strong className="text-stone-900">₹{(product.discountPrice * quantity).toLocaleString('en-IN')}</strong>
              </span>
            </div>
          </div>

          {/* Purchase CTA Buttons */}
          <div className="space-y-3 pt-2">
            {/* Primary Buy Now via WhatsApp */}
            <button
              onClick={handleBuyNow}
              disabled={product.stockStatus === 'out_of_stock'}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.874.808 2.796.808 3.183 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.768-5.768-5.768zm3.364 8.167c-.144.405-.837.774-1.17.824-.312.045-.694.073-2.18-.544-1.748-.724-2.883-2.485-2.971-2.6-.088-.117-.707-.941-.707-1.796 0-.855.447-1.277.608-1.452.161-.176.353-.22.47-.22.117 0 .235.001.338.006.108.005.253-.041.396.301.147.353.5 1.22.544 1.308.044.088.073.191.015.308-.059.118-.088.192-.176.294-.088.103-.186.23-.265.31-.088.088-.18.183-.077.36.103.176.458.756.983 1.224.676.602 1.246.788 1.423.876.176.088.279.073.382-.044.103-.118.441-.515.559-.691.118-.176.235-.147.397-.088.162.059 1.029.485 1.206.574.176.088.294.132.338.206.044.074.044.426-.1.831zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.981-1.306A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
              </svg>
              <span>Buy Now on WhatsApp</span>
            </button>

            {/* Secondary Add to Cart & Share */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stockStatus === 'out_of_stock'}
                className="flex items-center justify-center gap-2 py-3 px-4 border border-stone-300 hover:border-stone-900 hover:bg-stone-50 disabled:opacity-40 text-stone-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center justify-center gap-2 py-3 px-4 border border-stone-300 hover:border-stone-900 hover:bg-stone-50 text-stone-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Product</span>
              </button>
            </div>
          </div>

          {/* WhatsApp Direct Order Instructions */}
          <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-emerald-950 text-xs space-y-1">
            <p className="font-semibold flex items-center gap-1.5 text-emerald-900">
              <PackageCheck className="w-4 h-4 text-emerald-600" />
              Direct WhatsApp Checkout
            </p>
            <p className="text-emerald-800/90 leading-relaxed text-[11px]">
              Clicking <strong>Buy Now</strong> opens WhatsApp with your pre-filled product details. Our store team confirms delivery charges, timelines, and payment options directly with you.
            </p>
          </div>

          {/* Trust Value Strip */}
          <div className="pt-4 border-t border-stone-100 grid grid-cols-2 gap-4 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-stone-400 shrink-0" />
              <span>Fast Kerala Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-stone-400 shrink-0" />
              <span>100% Quality Inspected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description & Highlights */}
      <div className="bg-white rounded-2xl border border-stone-200 p-8 space-y-6">
        <div>
          <h2 className="font-serif text-xl font-bold text-stone-900 mb-3">Product Description</h2>
          <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {product.highlights && product.highlights.length > 0 && (
          <div className="pt-6 border-t border-stone-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900 mb-3">
              Key Features & Specifications
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-stone-700">
              {product.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-700 font-bold mt-0.5">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Related {product.category}
            </h2>
            <button
              onClick={() => {
                if (product.category.toLowerCase().includes('kitchen')) {
                  navigate('/category/kitchen-accessories');
                } else {
                  navigate('/category/home-accessories');
                }
              }}
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 transition-colors"
            >
              View More →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard
                key={relProduct.id}
                product={relProduct}
                onShareClick={() => {
                  setProduct(relProduct);
                  setIsShareModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        product={product}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};
