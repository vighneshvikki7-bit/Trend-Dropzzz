import React, { useState, useEffect } from 'react';
import { Product } from '../types.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useRouter } from '../context/RouterContext.tsx';
import { STORE_CONFIG } from '../data/initialProducts.ts';
import { TrendDropLogo } from '../components/Logo.tsx';
import { buildProductWhatsAppUrl, getProductUrl } from '../utils/whatsapp.ts';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Check,
  AlertCircle,
  HelpCircle,
  LogOut,
  Key,
  Layers,
  ArrowRight,
  RefreshCw,
  X,
  Phone,
  Lock,
  Copy,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { isAdmin, adminEmail, login, logout, isLoading: authLoading } = useAuth();
  const { navigate } = useRouter();

  // Login Form States
  const [emailInput, setEmailInput] = useState('admin@trenddropzz.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin Dashboard States
  const [activeTab, setActiveTab] = useState<'products' | 'new' | 'deployment' | 'security'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Add / Edit Product Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [customCategory, setCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    discountPrice: '',
    description: '',
    category: 'Kitchen Accessories',
    stockStatus: 'in_stock' as 'in_stock' | 'low_stock' | 'out_of_stock',
    stockCount: 30,
    isPublished: true,
    isFeatured: false,
    images: [] as string[],
    newImageUrl: '',
    highlightInput: '',
    highlights: [] as string[],
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Security Form State
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [securityMsg, setSecurityMsg] = useState({ type: '', text: '' });

  // Load products when admin is authenticated
  const loadAdminProducts = async () => {
    setLoadingProducts(true);
    try {
      const all = await api.getProducts();
      setProducts(all);
    } catch (err) {
      console.error('Error fetching admin products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminProducts();
    }
  }, [isAdmin]);

  // Handle Login Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await login(passwordInput, emailInput);
    } catch (err: any) {
      setLoginError(err.message || 'Invalid administrator email or password');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleFillDefaultCredentials = () => {
    setEmailInput('admin@trenddropzz.com');
    setPasswordInput('trenddropzz2026');
  };

  // Populate form for editing
  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    const isStandardCat = ['Kitchen Accessories', 'Home Accessories'].includes(product.category);
    setCustomCategory(!isStandardCat);
    setCustomCategoryName(!isStandardCat ? product.category : '');

    setFormData({
      name: product.name,
      slug: product.slug,
      price: product.price.toString(),
      discountPrice: product.discountPrice.toString(),
      description: product.description,
      category: product.category,
      stockStatus: product.stockStatus,
      stockCount: product.stockCount,
      isPublished: product.isPublished,
      isFeatured: product.isFeatured,
      images: [...product.images],
      newImageUrl: '',
      highlightInput: '',
      highlights: product.highlights ? [...product.highlights] : [],
    });
    setFormError('');
    setFormSuccess('');
    setActiveTab('new');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset Form for New Product
  const handleResetForm = () => {
    setEditingProduct(null);
    setCustomCategory(false);
    setCustomCategoryName('');
    setFormData({
      name: '',
      slug: '',
      price: '',
      discountPrice: '',
      description: '',
      category: 'Kitchen Accessories',
      stockStatus: 'in_stock',
      stockCount: 30,
      isPublished: true,
      isFeatured: false,
      images: [],
      newImageUrl: '',
      highlightInput: '',
      highlights: [],
    });
    setFormError('');
    setFormSuccess('');
  };

  // Handle Image Upload from device
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        await new Promise<void>((resolve) => {
          reader.onload = async () => {
            const base64Data = reader.result as string;
            try {
              // Upload to server disk /uploads/
              const uploadedUrl = await api.uploadImage(base64Data, file.name);
              setFormData((prev) => ({
                ...prev,
                images: [...prev.images, uploadedUrl],
              }));
            } catch {
              // Direct fallback
              setFormData((prev) => ({
                ...prev,
                images: [...prev.images, base64Data],
              }));
            }
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }
    } finally {
      setUploadingImage(false);
      // Reset input value
      e.target.value = '';
    }
  };

  // Add Image via URL
  const handleAddImageUrl = () => {
    if (!formData.newImageUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, prev.newImageUrl.trim()],
      newImageUrl: '',
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index),
    }));
  };

  const handleMakeImagePrimary = (index: number) => {
    setFormData((prev) => {
      const img = prev.images[index];
      const rest = prev.images.filter((_, idx) => idx !== index);
      return { ...prev, images: [img, ...rest] };
    });
  };

  // Add highlight bullet point
  const handleAddHighlight = () => {
    if (!formData.highlightInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, prev.highlightInput.trim()],
      highlightInput: '',
    }));
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, idx) => idx !== index),
    }));
  };

  // Handle Form Submit & Permanent Database Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.name.trim()) {
      setFormError('Please enter a valid product name.');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setFormError('Please enter a valid MRP price.');
      return;
    }

    const finalCategory = customCategory
      ? customCategoryName.trim() || 'General Accessories'
      : formData.category;

    if (formData.images.length === 0) {
      setFormError('Please upload at least one product image or paste an image URL.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<Product> = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || undefined,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : Number(formData.price),
        description: formData.description.trim(),
        category: finalCategory,
        stockStatus: formData.stockStatus,
        stockCount: Number(formData.stockCount) || 1,
        isPublished: formData.isPublished,
        isFeatured: formData.isFeatured,
        images: formData.images,
        highlights: formData.highlights,
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
        setFormSuccess('Product updated permanently in database!');
      } else {
        await api.createProduct(payload);
        setFormSuccess('Product created and saved permanently to database!');
        handleResetForm();
      }

      await loadAdminProducts();
      setTimeout(() => {
        setActiveTab('products');
      }, 1000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save product to database');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick toggle publish/draft
  const handleTogglePublish = async (product: Product) => {
    try {
      const nextState = !product.isPublished;
      await api.updateProduct(product.id, { isPublished: nextState });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isPublished: nextState } : p))
      );
    } catch (err) {
      alert('Failed to update publish status');
    }
  };

  // Delete product permanently
  const handleDeleteProduct = async (id: string) => {
    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDeletingProductId(null);
    } catch (err) {
      alert('Failed to delete product from database');
    }
  };

  // Copy shareable product link
  const handleCopyLink = (slug: string) => {
    const url = getProductUrl(slug);
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  // Change Master Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMsg({ type: '', text: '' });

    if (newAdminPassword.length < 6) {
      setSecurityMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }
    if (newAdminPassword !== confirmPassword) {
      setSecurityMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    try {
      await api.changePassword(newAdminPassword, newAdminEmail || undefined);
      setSecurityMsg({ type: 'success', text: 'Admin security credentials updated permanently in database!' });
      setNewAdminPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setSecurityMsg({ type: 'error', text: err.message || 'Failed to update credentials' });
    }
  };

  // ==========================================
  // 1. Separate Secure Admin Login Page
  // ==========================================
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4 selection:bg-amber-500 selection:text-stone-950">
        <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <TrendDropLogo size={76} variant="emblem" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-white tracking-tight">
                Trend Dropzz Portal
              </h1>
              <p className="text-xs text-stone-400 mt-1">
                Authorized Store Administrator Authentication
              </p>
            </div>
          </div>

          {/* Secure Credentials Info Box */}
          <div className="p-3.5 bg-stone-950 border border-stone-800 rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between text-stone-300">
              <span className="font-semibold text-stone-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Root Administrator Access
              </span>
              <button
                type="button"
                onClick={handleFillDefaultCredentials}
                className="text-[11px] text-amber-400 hover:text-amber-300 underline cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
            <div className="font-mono text-[11px] text-stone-400 space-y-0.5">
              <p>Email: <strong className="text-stone-200">admin@trenddropzz.com</strong></p>
              <p>Password: <strong className="text-stone-200">trenddropzz2026</strong></p>
            </div>
            <p className="text-[10px] text-stone-500">
              Passphrase can be customized anytime inside the Security Settings tab.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-950/70 border border-red-800 text-red-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full text-xs px-3.5 py-3 bg-stone-950 border border-stone-800 rounded-xl text-white placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-stone-400 hover:text-stone-200"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin password"
                className="w-full text-xs px-3.5 py-3 bg-stone-950 border border-stone-800 rounded-xl text-white placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-stone-950 font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer mt-2"
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-stone-800">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-stone-400 hover:text-white transition-colors"
            >
              ← Return to Customer Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Products for Admin Table
  const filteredProducts = products.filter((p) => {
    const matchCat = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchSearch =
      !searchFilter ||
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchFilter.toLowerCase());
    return matchCat && matchSearch;
  });

  const categories = Array.from(new Set(['Kitchen Accessories', 'Home Accessories', ...products.map((p) => p.category)]));

  // ==========================================
  // 2. Authenticated Admin Dashboard
  // ==========================================
  return (
    <div className="min-h-screen bg-[#FBFBFA] pb-16">
      {/* Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <TrendDropLogo size={42} variant="emblem" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold text-stone-900 leading-tight">
                  Trend Dropzz Admin
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Live DB Active
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Connected: <strong className="text-stone-700">{adminEmail}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">View Storefront</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-2 overflow-x-auto gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Product Catalog ({products.length})</span>
            </button>

            <button
              onClick={() => {
                handleResetForm();
                setActiveTab('new');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'new'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{editingProduct ? 'Edit Product' : 'Add New Product'}</span>
            </button>

            <button
              onClick={() => setActiveTab('deployment')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'deployment'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Deployment & Custom Domain</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'security'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Admin Security</span>
            </button>
          </div>

          <button
            onClick={loadAdminProducts}
            disabled={loadingProducts}
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${loadingProducts ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Tab 1: Product Catalog Table */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Filter Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search products by title or slug..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="text-xs px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 w-full sm:w-72 shadow-2xs"
                />

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="text-xs px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none shadow-2xs"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  handleResetForm();
                  setActiveTab('new');
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer self-end sm:self-auto shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-600">
                  <thead className="bg-stone-50 border-b border-stone-200 uppercase text-[11px] font-bold text-stone-700 tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Item Details</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price / Discount</th>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4">Visibility</th>
                      <th className="py-3.5 px-4 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-stone-400">
                          No products found in the database. Tap &ldquo;Add Product&rdquo; above to create one.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.images?.[0] || '/src/assets/images/hero_kitchen_home_showcase_1792352797924.jpg'}
                                alt={prod.name}
                                className="w-13 h-13 object-cover rounded-xl border border-stone-200 bg-stone-100 shrink-0"
                              />
                              <div className="min-w-0 max-w-xs space-y-0.5">
                                <p className="font-semibold text-stone-900 truncate text-sm">{prod.name}</p>
                                <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-500">
                                  <span>/product/{prod.slug}</span>
                                  <button
                                    onClick={() => handleCopyLink(prod.slug)}
                                    title="Copy Shareable Link"
                                    className="hover:text-stone-900 cursor-pointer p-0.5"
                                  >
                                    {copiedSlug === prod.slug ? (
                                      <Check className="w-3 h-3 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-stone-800 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                              {prod.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 tabular-nums">
                            <div className="font-bold text-stone-950 text-sm">
                              ₹{prod.discountPrice.toLocaleString('en-IN')}
                            </div>
                            {prod.price > prod.discountPrice && (
                              <div className="text-[11px] text-stone-400 line-through">
                                ₹{prod.price.toLocaleString('en-IN')}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                                prod.stockStatus === 'in_stock'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                                  : prod.stockStatus === 'low_stock'
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
                                  : 'bg-red-50 text-red-800 border border-red-200/60'
                              }`}
                            >
                              {prod.stockStatus === 'in_stock'
                                ? `In Stock (${prod.stockCount})`
                                : prod.stockStatus === 'low_stock'
                                ? `Low Stock (${prod.stockCount})`
                                : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleTogglePublish(prod)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                prod.isPublished
                                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                              }`}
                              title={prod.isPublished ? 'Click to Hide from Customers' : 'Click to Publish to Customers'}
                            >
                              {prod.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              <span>{prod.isPublished ? 'Published' : 'Hidden'}</span>
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Test WhatsApp Order */}
                              <a
                                href={buildProductWhatsAppUrl(prod, 1)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Test WhatsApp Order Link (+91 9745912447)"
                              >
                                <Phone className="w-4 h-4" />
                              </a>

                              {/* View live link */}
                              <button
                                onClick={() => window.open(getProductUrl(prod.slug), '_blank')}
                                className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                                title="Open Live Shareable Link"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => handleStartEdit(prod)}
                                className="p-2 text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                title="Edit Product Details & Price"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => setDeletingProductId(prod.id)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Product Permanently"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Add / Edit Product Form */}
        {activeTab === 'new' && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-stone-900">
                  {editingProduct ? `Edit: ${editingProduct.name}` : 'Add Unlimited New Product'}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Direct database insertion with persistent storage. Changes reflect automatically on customer storefront.
                </p>
              </div>
              {editingProduct && (
                <button
                  onClick={handleResetForm}
                  className="text-xs text-stone-500 hover:text-stone-900 underline cursor-pointer"
                >
                  Cancel Edit (Create New)
                </button>
              )}
            </div>

            {formError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern Stainless Steel Kitchen Spice Organizer"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs px-3.5 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Unique Shareable Slug (auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. kitchen-organizer-rack"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full text-xs px-3.5 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white font-mono"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Category *
                  </label>
                  {!customCategory ? (
                    <div className="flex gap-2">
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          if (e.target.value === '__custom__') {
                            setCustomCategory(true);
                          } else {
                            setFormData({ ...formData, category: e.target.value });
                          }
                        }}
                        className="flex-1 text-xs px-3.5 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white"
                      >
                        <option value="Kitchen Accessories">Kitchen Accessories</option>
                        <option value="Home Accessories">Home Accessories</option>
                        <option value="__custom__">+ Add Custom Category...</option>
                      </select>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type custom category name..."
                        value={customCategoryName}
                        onChange={(e) => setCustomCategoryName(e.target.value)}
                        className="flex-1 text-xs px-3.5 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setCustomCategory(false)}
                        className="px-3 text-xs text-stone-500 hover:text-stone-800"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Price (MRP) */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Original MRP Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 1999"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full text-xs px-3.5 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white"
                  />
                </div>

                {/* Discount / Selling Price */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Discounted Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 1299"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    className="w-full text-xs px-3.5 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white"
                  />
                  {formData.price && formData.discountPrice && Number(formData.price) > Number(formData.discountPrice) && (
                    <p className="text-[11px] text-emerald-700 mt-1 font-semibold">
                      Savings for Customer: {Math.round(((Number(formData.price) - Number(formData.discountPrice)) / Number(formData.price)) * 100)}% OFF
                    </p>
                  )}
                </div>

                {/* Stock Status */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Stock Availability
                  </label>
                  <select
                    value={formData.stockStatus}
                    onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value as any })}
                    className="w-full text-xs px-3.5 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>

                {/* Stock Count */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Stock Units Available
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stockCount}
                    onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                    className="w-full text-xs px-3.5 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white"
                  />
                </div>
              </div>

              {/* Multiple Product Images */}
              <div className="space-y-3 pt-3 border-t border-stone-100">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Product Images (Upload multiple images or paste URLs) *
                </label>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Upload from Computer */}
                  <label className="flex items-center justify-center gap-2 px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold cursor-pointer transition-colors border border-stone-300 shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingImage ? 'Uploading Image...' : 'Upload from Device'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>

                  {/* Paste URL */}
                  <div className="flex-1 flex gap-2">
                    <input
                      type="url"
                      placeholder="Or paste external web image URL..."
                      value={formData.newImageUrl}
                      onChange={(e) => setFormData({ ...formData, newImageUrl: e.target.value })}
                      className="flex-1 text-xs px-3.5 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-5 py-3 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 cursor-pointer shrink-0"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {/* Image Previews */}
                {formData.images.length > 0 ? (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {formData.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative w-24 h-24 rounded-2xl border-2 border-stone-200 bg-stone-50 overflow-hidden group shadow-xs"
                      >
                        <img src={imgUrl} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute top-1.5 left-1.5 bg-amber-500 text-stone-950 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                            Cover
                          </span>
                        )}
                        <div className="absolute inset-0 bg-stone-950/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleMakeImagePrimary(idx)}
                              className="text-[10px] text-white hover:text-amber-400 font-semibold cursor-pointer"
                            >
                              Set Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="text-[10px] text-red-300 hover:text-red-400 font-semibold cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-400 italic">No images added yet.</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1 pt-2 border-t border-stone-100">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Full Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe material, dimensions, care instructions, and customer benefits..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs px-3.5 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white"
                />
              </div>

              {/* Key Highlights / Bullets */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Key Specifications / Highlights
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Heavy-duty rust-proof carbon steel or 500ml capacity..."
                    value={formData.highlightInput}
                    onChange={(e) => setFormData({ ...formData, highlightInput: e.target.value })}
                    className="flex-1 text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHighlight();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="px-5 py-2.5 bg-stone-800 text-white rounded-xl text-xs font-semibold hover:bg-stone-700 cursor-pointer"
                  >
                    Add Bullet
                  </button>
                </div>

                {formData.highlights.length > 0 && (
                  <ul className="flex flex-wrap gap-2 pt-1">
                    {formData.highlights.map((h, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-1.5 px-3 py-1 bg-stone-100 rounded-lg text-xs text-stone-800 border border-stone-200"
                      >
                        <span>{h}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(idx)}
                          className="text-stone-400 hover:text-red-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Visibility & Toggles */}
              <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-800">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-stone-900"
                  />
                  <span>Publish Immediately (Visible to Customers)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-800">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-stone-900"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              {/* Submit Bar */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-5 py-3 border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  {isSubmitting ? 'Saving to Database...' : editingProduct ? 'Update Product in Database' : 'Save & Publish Product'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Deployment & Custom Domain */}
        {activeTab === 'deployment' && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 space-y-8 shadow-xs">
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Deployment & Custom Domain Setup
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Instructions for permanently hosting Trend Dropzz on free or low-cost cloud platforms with persistent storage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Render.com */}
              <div className="p-6 border border-stone-200 rounded-2xl bg-stone-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-stone-900 text-sm">1. Render.com</h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                    Free / Low-Cost
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Hosts the full-stack Node.js + Express app directly with automatic continuous deployment.
                </p>
                <ol className="text-xs text-stone-600 space-y-1.5 list-decimal list-inside">
                  <li>Push this repository to GitHub.</li>
                  <li>In <strong>render.com</strong>, click <strong>New Web Service</strong>.</li>
                  <li>Build Command: <code className="bg-white px-1.5 py-0.5 rounded border border-stone-200">npm install && npm run build</code></li>
                  <li>Start Command: <code className="bg-white px-1.5 py-0.5 rounded border border-stone-200">npm start</code></li>
                  <li>Environment Variable: <code className="bg-white px-1.5 py-0.5 rounded border border-stone-200">NODE_ENV=production</code></li>
                </ol>
              </div>

              {/* Railway.app */}
              <div className="p-6 border border-stone-200 rounded-2xl bg-stone-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-stone-900 text-sm">2. Railway.app</h3>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                    Persistent Volume
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  One-click deploy with a persistent storage disk mounted at <code className="bg-white px-1 py-0.5 rounded border">/data</code>.
                </p>
                <ol className="text-xs text-stone-600 space-y-1.5 list-decimal list-inside">
                  <li>Create project on <strong>railway.app</strong> and connect repo.</li>
                  <li>Add Volume mounted to <code className="bg-white px-1 py-0.5 rounded border">/data</code>.</li>
                  <li>Start command automatically executes <code className="bg-white px-1 py-0.5 rounded border">npm start</code>.</li>
                </ol>
              </div>
            </div>

            {/* Custom Domain trenddropzz.com */}
            <div className="p-6 bg-stone-900 text-white rounded-2xl space-y-3">
              <h3 className="font-bold text-base text-amber-400">Custom Domain Configuration (trenddropzz.com)</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Connect your purchased domain <strong>trenddropzz.com</strong> (from GoDaddy, Hostinger, or Namecheap):
              </p>
              <div className="bg-stone-800 p-4 rounded-xl text-xs font-mono space-y-1.5 text-stone-200">
                <p>DNS Record Type: <strong>CNAME</strong></p>
                <p>Host: <strong>@</strong> or <strong>www</strong></p>
                <p>Target: <strong>[Your Cloud Provider Assigned Domain]</strong></p>
                <p>SSL Certificate: Automatically provisioned free of charge</p>
              </div>
              <p className="text-xs text-stone-400">
                All unique product links (e.g. <code className="text-amber-300">trenddropzz.com/product/kitchen-organizer-rack</code>) will resolve directly to the live product with instant WhatsApp ordering.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Security & Master Password */}
        {activeTab === 'security' && (
          <div className="max-w-xl mx-auto bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 space-y-6 shadow-xs">
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Admin Security & Password
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Update your administrator email and master passphrase. Persisted permanently in database.
              </p>
            </div>

            {securityMsg.text && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                  securityMsg.type === 'error'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                {securityMsg.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <Check className="w-4 h-4 shrink-0" />
                )}
                <span>{securityMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  placeholder={adminEmail || 'admin@trenddropzz.com'}
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  New Admin Password (Min. 6 characters) *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter new strong password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full text-xs px-3.5 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-type new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-xs px-3.5 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Update Credentials in Database
              </button>
            </form>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingProductId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-stone-200">
              <h3 className="font-serif text-lg font-bold text-stone-900">Delete Product Permanently?</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                This will remove the product permanently from the live database and customer storefront. This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeletingProductId(null)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProduct(deletingProductId)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
