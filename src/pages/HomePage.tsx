import React, { useState, useEffect } from 'react';
import { Product } from '../types.ts';
import { api } from '../services/api.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { ShareModal } from '../components/ShareModal.tsx';
import { STORE_CONFIG } from '../data/initialProducts.ts';
import { useRouter } from '../context/RouterContext.tsx';
import { buildGeneralSupportWhatsAppUrl } from '../utils/whatsapp.ts';
import {
  ArrowRight,
  SlidersHorizontal,
  Search,
  CheckCircle2,
  Package,
} from 'lucide-react';

interface HomePageProps {
  initialCategory?: string;
  searchQuery?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ initialCategory = 'All', searchQuery = '' }) => {
  const { navigate } = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [sharingProduct, setSharingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (initialCategory && initialCategory !== selectedCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      setIsLoading(true);
      try {
        const items = await api.getProducts();
        if (isMounted) setProducts(items);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter products by category and search
  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.discountPrice - b.discountPrice;
    if (sortBy === 'price-desc') return b.discountPrice - a.discountPrice;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    // Default featured
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const categories = ['All', 'Kitchen Accessories', 'Home Accessories'];

  return (
    <div className="space-y-12 pb-16">
      {/* Editorial Storefront Hero */}
      <section className="relative overflow-hidden bg-stone-900 text-white rounded-2xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[440px] md:min-h-[500px]">
          {/* Left Text Zone */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase mb-3">
                <span>Modern Living Essentials · Curated for Kerala</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight max-w-xl">
                Functional Kitchens. Beautiful Modern Homes.
              </h1>
              <p className="mt-4 text-stone-300 text-sm sm:text-base leading-relaxed max-w-lg">
                Discover high-efficiency kitchen organizers, borosilicate dispensers, and handcrafted home accessories. Direct, hassle-free ordering via WhatsApp.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setSelectedCategory('Kitchen Accessories');
                  const el = document.getElementById('catalog-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>Kitchen Accessories</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('Home Accessories');
                  const el = document.getElementById('catalog-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-semibold border border-stone-700 transition-all cursor-pointer"
              >
                Home Accessories
              </button>

              <a
                href={buildGeneralSupportWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 text-xs text-stone-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>WhatsApp Store Support</span>
              </a>
            </div>

            {/* Quick Trust Badges */}
            <div className="mt-8 pt-6 border-t border-stone-800/80 flex flex-wrap items-center gap-6 text-xs text-stone-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" /> WhatsApp Direct Order
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" /> Kerala Delivery
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" /> Verified Premium Quality
              </span>
            </div>
          </div>

          {/* Right Image Showcase */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
            <img
              src="/src/assets/images/hero_kitchen_home_showcase_1792352797924.jpg"
              alt="Trend Dropzz Kitchen & Home Collection"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-stone-900 via-stone-900/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Controls: Category tabs & Sort options */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          {/* Category Tabs (Segmented functional buttons) */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl overflow-x-auto max-w-full">
            {categories.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {cat === 'All' ? 'All Products' : cat}
                </button>
              );
            })}
          </div>

          {/* Right Sort & Count */}
          <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
            <span className="text-xs text-stone-500 tabular-nums">
              Showing <strong className="text-stone-900">{sortedProducts.length}</strong> items
            </span>

            <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products by"
                className="bg-transparent focus:outline-none cursor-pointer pr-2 font-medium"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Latest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Query Feedback */}
        {searchQuery && (
          <div className="flex items-center justify-between bg-amber-50/70 border border-amber-200/60 rounded-xl px-4 py-2 text-xs text-amber-900">
            <span>
              Searching for: &ldquo;<strong>{searchQuery}</strong>&rdquo;
            </span>
            <button
              onClick={() => setSelectedCategory('All')}
              className="underline text-amber-800 hover:text-amber-950 font-medium cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-xl p-4 border border-stone-200 animate-pulse space-y-4">
                <div className="aspect-4/3 bg-stone-200 rounded-lg" />
                <div className="h-4 bg-stone-200 rounded w-1/3" />
                <div className="h-5 bg-stone-200 rounded w-3/4" />
                <div className="h-4 bg-stone-200 rounded w-1/2" />
                <div className="h-9 bg-stone-200 rounded" />
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 p-8">
            <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-stone-800">No products found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-6">
              No products match your current filter or search criteria. Try browsing another category or resetting the search.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
              }}
              className="px-5 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onShareClick={(prod) => setSharingProduct(prod)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Share Product Dialog */}
      <ShareModal
        product={sharingProduct}
        isOpen={Boolean(sharingProduct)}
        onClose={() => setSharingProduct(null)}
      />
    </div>
  );
};
