import React from 'react';
import { buildGeneralSupportWhatsAppUrl } from '../utils/whatsapp.ts';
import { STORE_CONFIG } from '../data/initialProducts.ts';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip on hover */}
      <div className="mr-3 hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-stone-900 text-white text-xs py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap">
          Order or chat on WhatsApp ({STORE_CONFIG.formattedWhatsapp})
        </div>
      </div>

      <a
        href={buildGeneralSupportWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Trend Dropzz on WhatsApp"
        className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
      >
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.874.808 2.796.808 3.183 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.768-5.768-5.768zm3.364 8.167c-.144.405-.837.774-1.17.824-.312.045-.694.073-2.18-.544-1.748-.724-2.883-2.485-2.971-2.6-.088-.117-.707-.941-.707-1.796 0-.855.447-1.277.608-1.452.161-.176.353-.22.47-.22.117 0 .235.001.338.006.108.005.253-.041.396.301.147.353.5 1.22.544 1.308.044.088.073.191.015.308-.059.118-.088.192-.176.294-.088.103-.186.23-.265.31-.088.088-.18.183-.077.36.103.176.458.756.983 1.224.676.602 1.246.788 1.423.876.176.088.279.073.382-.044.103-.118.441-.515.559-.691.118-.176.235-.147.397-.088.162.059 1.029.485 1.206.574.176.088.294.132.338.206.044.074.044.426-.1.831zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.981-1.306A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
        </svg>
      </a>
    </div>
  );
};
