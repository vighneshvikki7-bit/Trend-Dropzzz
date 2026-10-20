/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { FloatingWhatsApp } from './components/FloatingWhatsApp.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';

function AppContent() {
  const { path } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Dedicated Separate Admin Portal (/admin, /admin/, #admin, ?admin)
  const normalizedPath = (path || '/').toLowerCase().trim();
  if (
    normalizedPath === '/admin' ||
    normalizedPath.startsWith('/admin/') ||
    normalizedPath.startsWith('/admin?') ||
    normalizedPath.startsWith('/admin#')
  ) {
    return <AdminPage />;
  }

  // 2. Customer Storefront Routes (with zero admin buttons)
  const renderCustomerRoute = () => {
    // Product Details: /product/:slug
    if (path.startsWith('/product/')) {
      const slug = path.replace('/product/', '').split('/')[0].split('?')[0];
      return <ProductDetailPage slug={slug} />;
    }

    // Category: /category/:category
    if (path.startsWith('/category/kitchen-accessories')) {
      return <HomePage initialCategory="Kitchen Accessories" searchQuery={searchQuery} />;
    }
    if (path.startsWith('/category/home-accessories')) {
      return <HomePage initialCategory="Home Accessories" searchQuery={searchQuery} />;
    }

    // About Store: /about
    if (path === '/about') {
      return <AboutPage />;
    }

    // Default: Home Page
    return <HomePage initialCategory="All" searchQuery={searchQuery} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      <Header
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
      />

      <main className="flex-1">
        {renderCustomerRoute()}
      </main>

      <Footer />
      <CartDrawer />
      <FloatingWhatsApp />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </RouterProvider>
  );
}
