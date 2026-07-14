import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HotWheelsProduct } from '../types';
import { X, Star, Check, ShoppingCart, ShieldAlert, Award, Calendar, Weight } from 'lucide-react';

interface ProductModalProps {
  product: HotWheelsProduct | null;
  onClose: () => void;
  onAddToCart: (product: HotWheelsProduct) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const isOutOfStock = product.stock === 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative bg-[#0d0d0e] border border-zinc-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[520px] z-10"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-zinc-500 hover:text-white bg-black/60 hover:bg-zinc-900 border border-zinc-800/60 rounded-full transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left Side: Product High-Resolution Showcase Image */}
          <div className="w-full md:w-1/2 relative bg-zinc-950/80 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-zinc-900 min-h-[220px] md:min-h-0">
            {/* Blister Card Logo Backing Design */}
            <div className="absolute inset-4 rounded-xl border border-dashed border-zinc-800 flex items-center justify-center select-none pointer-events-none opacity-40">
              <span className="font-display font-extrabold text-[42px] text-zinc-900 tracking-wider">DIECAST</span>
            </div>

            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full max-h-[200px] md:max-h-[300px] object-cover rounded-xl relative z-10"
            />

            <span className="absolute bottom-4 left-4 z-10 px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#cca43b]/10 border border-[#cca43b]/25 text-[#cca43b] rounded">
              {product.scale} SCALE
            </span>
          </div>

          {/* Right Side: Collector Technical Information Sheet */}
          <div className="w-full md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              {/* Rarity & Year Badge */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold bg-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded uppercase">
                  {product.series}
                </span>
                <span className="text-[10px] font-mono font-bold text-[#cca43b]">
                  {product.year} RELEASE
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display font-black text-2xl text-white leading-tight mb-2">
                {product.name}
              </h3>

              {/* Price & SKU Info */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-2xl font-black text-[#cca43b]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-mono text-zinc-500">
                  SKU: <span className="text-zinc-400 font-bold">{product.sku}</span>
                </span>
              </div>

              {/* Rating stars */}
              <div className="flex items-center gap-1.5 mb-4 text-xs font-mono">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 stroke-amber-400'
                          : 'stroke-zinc-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-zinc-300 font-bold">{product.rating.toFixed(1)}</span>
                <span className="text-zinc-600">({product.reviewsCount} collector reviews)</span>
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Key Features Checklist */}
              <div className="mb-5">
                <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-2">
                  COLLECTOR SPECIFICATIONS
                </h4>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-zinc-300 font-sans">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 truncate">
                      <div className="p-0.5 bg-[#cca43b]/10 rounded text-[#cca43b] flex-shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="truncate">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Call To Action Buttons (Add/Soldout) */}
            <div className="pt-4 border-t border-zinc-900 mt-4 flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Availability</span>
                {isOutOfStock ? (
                  <span className="text-red-500 text-xs font-mono font-bold">OUT OF STOCK</span>
                ) : (
                  <span className="text-[#44aa44] text-xs font-mono font-bold">
                    {product.stock} IN STOCK
                  </span>
                )}
              </div>

              {isOutOfStock ? (
                <button
                  disabled
                  className="px-6 py-2.5 bg-zinc-900 text-zinc-600 font-mono text-xs font-bold rounded-xl cursor-not-allowed border border-zinc-800"
                >
                  SOLD OUT
                </button>
              ) : (
                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="px-6 py-3 bg-[#cca43b] hover:bg-[#b58f30] text-black font-mono text-xs font-bold uppercase rounded-xl transition-all shadow-lg shadow-amber-500/5 flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  ADD TO VAULT
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
