import React from 'react';
import { useRouter } from '../context/RouterContext.tsx';
import { STORE_CONFIG } from '../data/initialProducts.ts';
import { buildGeneralSupportWhatsAppUrl } from '../utils/whatsapp.ts';
import { Phone, ShieldCheck, Truck, RefreshCw, HeartHandshake, Lock } from 'lucide-react';

import { TrendDropLogo } from './Logo.tsx';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <footer className="bg-stone-900 text-stone-300 mt-20 border-t border-stone-800">
      {/* 4 Trust Value Pillars */}
      <div className="border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stone-800 text-amber-400 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Instant WhatsApp Order</h4>
              <p className="text-[11px] text-stone-400">Direct confirmation & tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stone-800 text-amber-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Kerala Delivery</h4>
              <p className="text-[11px] text-stone-400">Fast dispatch & safe delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stone-800 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Handpicked Quality</h4>
              <p className="text-[11px] text-stone-400">Inspected kitchen & home pieces</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stone-800 text-amber-400 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Dedicated Support</h4>
              <p className="text-[11px] text-stone-400">Friendly personal assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Brand info */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <TrendDropLogo size={52} variant="emblem" />
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-white leading-tight">
                {STORE_CONFIG.shopName}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-medium">
                Trending Products · Best Deals
              </span>
            </div>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
            Curated kitchen accessories, modern pantry organizers, and handcrafted home decor essentials tailored for stylish, functional living spaces across Kerala.
          </p>
          <div className="pt-2">
            <a
              href={buildGeneralSupportWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp: {STORE_CONFIG.formattedWhatsapp}</span>
            </a>
          </div>
        </div>

        {/* Categories */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Categories</h4>
          <ul className="space-y-2 text-xs text-stone-400">
            <li>
              <button
                onClick={() => navigate('/category/kitchen-accessories')}
                className="hover:text-amber-400 transition-colors text-left"
              >
                Kitchen Accessories
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/category/home-accessories')}
                className="hover:text-amber-400 transition-colors text-left"
              >
                Home Accessories & Decor
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/')}
                className="hover:text-amber-400 transition-colors text-left"
              >
                All Featured Products
              </button>
            </li>
          </ul>
        </div>

        {/* How It Works & Store Policy */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Direct WhatsApp Ordering</h4>
          <p className="text-xs text-stone-400 leading-relaxed">
            Browse our catalogue, select your favourite kitchen or home essentials, and tap <strong className="text-stone-200">Buy Now</strong>. An order summary is automatically prepared in WhatsApp where our team confirms delivery charges, estimated time, and dispatch details.
          </p>
          <div className="pt-2 text-xs text-stone-400 flex items-center gap-3">
            <span className="text-stone-400">Currency: {STORE_CONFIG.currencyCode} (₹)</span>
            <span>·</span>
            <span className="text-stone-400">All prices inclusive of taxes</span>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Discreet Store Owner Access */}
      <div className="border-t border-stone-800 py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} {STORE_CONFIG.shopName}. All rights reserved. Handcrafted for modern homes.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="inline-flex items-center gap-1.5 text-stone-500 hover:text-amber-400 transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-stone-800/80 border border-transparent hover:border-stone-700"
              title="Store Administrator & Product Management Login"
              aria-label="Admin Portal Login"
            >
              <Lock className="w-3.5 h-3.5 text-stone-500 hover:text-amber-400" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
