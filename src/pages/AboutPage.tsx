import React from 'react';
import { STORE_CONFIG } from '../data/initialProducts.ts';
import { useRouter } from '../context/RouterContext.tsx';
import { buildGeneralSupportWhatsAppUrl } from '../utils/whatsapp.ts';
import { Phone, CheckCircle2, ArrowRight, ShieldCheck, HeartHandshake, Package } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero Intro */}
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
          About Trend Dropzz
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Elevating Kerala Homes with Functional Design
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Trend Dropzz is an online destination for high-utility kitchen accessories and aesthetic home decor. We believe modern everyday living should be organized, elegant, and effortless.
        </p>
      </div>

      {/* Story Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-10 shadow-xs space-y-6">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Our Story & Mission</h2>
        <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <p>
            Started with a passion for smart home solutions, <strong>Trend Dropzz</strong> curates products that solve real day-to-day problems in modern kitchens and living spaces: from heavy-duty spice organizers and drip-free glass dispensers to handcrafted decorative vases and premium cotton rope storage bins.
          </p>
          <p>
            Unlike complicated websites that require tedious account creations and online card registrations, we believe in <strong>personal human service</strong>. Every order is handled directly via WhatsApp with our store team at <strong>+91 9745912447</strong>, ensuring real-time stock confirmation, customized shipping updates, and direct peace of mind.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-stone-100">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-stone-900 text-sm">Curated Aesthetics</h3>
            <p className="text-xs text-stone-500 leading-normal">
              Every item is tested for durability, rust-resistance, and visual harmony in modern homes.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-stone-900 text-sm">1-Tap WhatsApp Orders</h3>
            <p className="text-xs text-stone-500 leading-normal">
              Direct checkout on WhatsApp with immediate human assistance and tracking details.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-stone-900 text-sm">Quality Inspected</h3>
            <p className="text-xs text-stone-500 leading-normal">
              Carefully packaged to arrive safely at your doorstep anywhere in Kerala.
            </p>
          </div>
        </div>
      </div>

      {/* Direct Contact & WhatsApp Box */}
      <div className="bg-stone-900 text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-serif text-2xl font-bold text-white">Have a question or custom inquiry?</h3>
          <p className="text-xs text-stone-300">
            Our team is available on WhatsApp daily to assist you with products and orders.
          </p>
        </div>

        <a
          href={buildGeneralSupportWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Phone className="w-4 h-4" />
          <span>Chat on WhatsApp: {STORE_CONFIG.formattedWhatsapp}</span>
        </a>
      </div>
    </div>
  );
};
