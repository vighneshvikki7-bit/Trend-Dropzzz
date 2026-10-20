import React, { useState } from 'react';
import { Product } from '../types.ts';
import { getProductUrl } from '../utils/whatsapp.ts';
import { X, Copy, Check, Share2 } from 'lucide-react';

interface ShareModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ product, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const url = getProductUrl(product.slug);
  const shareText = `Check out ${product.name} on Trend Dropzz for ₹${product.discountPrice.toLocaleString('en-IN')}: ${url}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} - Trend Dropzz`,
          text: `Check out ${product.name} at Trend Dropzz!`,
          url: url,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTwitterShare = () => {
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(twUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 p-6 text-stone-900 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Share Product</h3>
            <p className="text-xs text-stone-500">Share this unique product link with customers or friends</p>
          </div>
        </div>

        {/* Product Preview Snippet */}
        <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl mb-5 border border-stone-100">
          <img
            src={product.images?.[0] || '/src/assets/images/hero_kitchen_home_showcase_1792352797924.jpg'}
            alt={product.name}
            className="w-12 h-12 object-cover rounded-lg border border-stone-200"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-stone-900 truncate">{product.name}</p>
            <p className="text-xs text-amber-700 font-medium">₹{product.discountPrice.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Copy Link Input Bar */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="text"
            readOnly
            value={url}
            className="w-full text-xs bg-stone-100 border border-stone-300 rounded-lg px-3 py-2.5 text-stone-700 select-all font-mono truncate"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800 text-xs font-semibold transition-colors shrink-0 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={handleWhatsAppShare}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-emerald-100 bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-800 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 fill-emerald-600 mb-1" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.874.808 2.796.808 3.183 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.768-5.768-5.768zm3.364 8.167c-.144.405-.837.774-1.17.824-.312.045-.694.073-2.18-.544-1.748-.724-2.883-2.485-2.971-2.6-.088-.117-.707-.941-.707-1.796 0-.855.447-1.277.608-1.452.161-.176.353-.22.47-.22.117 0 .235.001.338.006.108.005.253-.041.396.301.147.353.5 1.22.544 1.308.044.088.073.191.015.308-.059.118-.088.192-.176.294-.088.103-.186.23-.265.31-.088.088-.18.183-.077.36.103.176.458.756.983 1.224.676.602 1.246.788 1.423.876.176.088.279.073.382-.044.103-.118.441-.515.559-.691.118-.176.235-.147.397-.088.162.059 1.029.485 1.206.574.176.088.294.132.338.206.044.074.044.426-.1.831zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.981-1.306A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
            </svg>
            <span className="text-[11px] font-semibold">WhatsApp</span>
          </button>

          <button
            onClick={handleFacebookShare}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-blue-100 bg-blue-50/60 hover:bg-blue-100/70 text-blue-800 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 fill-blue-600 mb-1" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="text-[11px] font-semibold">Facebook</span>
          </button>

          <button
            onClick={handleTwitterShare}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 fill-stone-900 mb-1" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span className="text-[11px] font-semibold">X / Twitter</span>
          </button>
        </div>

        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="w-full mt-3 py-2 text-xs text-stone-600 hover:text-stone-900 border border-stone-200 rounded-lg hover:bg-stone-50 font-medium transition-colors cursor-pointer"
          >
            More Share Options
          </button>
        )}
      </div>
    </div>
  );
};
