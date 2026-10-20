import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { STORE_CONFIG } from '../data/initialProducts.ts';
import { TrendDropLogo } from './Logo.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Phone,
  ArrowRight,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { buildGeneralSupportWhatsAppUrl } from '../utils/whatsapp.ts';

interface HeaderProps {
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
}

export const Header: React.FC<HeaderProps> = ({ onSearchChange, searchQuery = '' }) => {
  const { path, navigate } = useRouter();
  const { totalCount, setIsCartOpen } = useCart();
  const { isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const navLinks = [
    { label: 'All Products', href: '/' },
    { label: 'Kitchen Accessories', href: '/category/kitchen-accessories' },
    { label: 'Home Accessories', href: '/category/home-accessories' },
    { label: 'About Store', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top micro announcement bar */}
      <div className="bg-stone-900 text-stone-200 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="text-amber-400 font-medium">Trend Dropzz Exclusive</span>
            <span className="text-stone-500">·</span>
            <span>Direct WhatsApp Orders</span>
            <span className="text-stone-500">·</span>
            <span>Verified Quality & Safe Delivery Across Kerala</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-stone-300 shrink-0">
            <a
              href={buildGeneralSupportWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>WhatsApp: {STORE_CONFIG.formattedWhatsapp}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - 3 Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6 md:gap-8">
        {/* Zone 1: Brand Logo & Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              navigate('/');
              setMobileMenuOpen(false);
            }}
            className="text-left group cursor-pointer"
          >
            <TrendDropLogo variant="horizontal" />
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600">
          {navLinks.map((link) => {
            const isActive =
              path === link.href || (link.href !== '/' && path.startsWith(link.href));
            return (
              <button
                key={link.label}
                onClick={() => navigate(link.href)}
                className={`transition-colors whitespace-nowrap cursor-pointer relative py-1 ${
                  isActive
                    ? 'text-stone-950 font-semibold'
                    : 'hover:text-stone-950'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Search, Admin, Cart Actions */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Quick Search Input */}
          <div className="relative">
            {isSearchExpanded ? (
              <div className="flex items-center bg-stone-100 rounded-lg px-2.5 py-1.5 w-48 sm:w-64 border border-stone-300">
                <Search className="w-4 h-4 text-stone-400 shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Search organizers, jars, decor..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none"
                />
                <button
                  onClick={() => {
                    setIsSearchExpanded(false);
                    onSearchChange?.('');
                  }}
                  className="text-stone-400 hover:text-stone-600 ml-1 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchExpanded(true)}
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                title="Search products"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>


          {/* Admin Dashboard Quick Access (Only rendered when logged in as admin) */}
          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/10 text-amber-800 hover:bg-amber-500/20 text-xs font-semibold rounded-lg border border-amber-300 transition-colors cursor-pointer"
              title="Return to Admin Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center p-2.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-stone-950 text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center tabular-nums shadow-sm">
                {totalCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => {
                navigate(link.href);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 px-3 text-sm font-medium text-stone-800 hover:bg-stone-50 rounded-md"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 px-3">
            <span>Customer WhatsApp:</span>
            <a
              href={buildGeneralSupportWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 font-medium"
            >
              {STORE_CONFIG.formattedWhatsapp}
            </a>
          </div>
          <div className="pt-2 border-t border-stone-100 flex justify-end px-3">
            <button
              onClick={() => {
                navigate('/admin');
                setMobileMenuOpen(false);
              }}
              className="inline-flex items-center gap-1.5 text-stone-400 hover:text-stone-800 text-xs py-1 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Portal Login</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
