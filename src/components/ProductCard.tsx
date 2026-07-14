import React from 'react';
import { HotWheelsProduct } from '../types';
import { Star, ShoppingCart, Eye, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: HotWheelsProduct;
  onQuickView: (product: HotWheelsProduct) => void;
  onAddToCart: (product: HotWheelsProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
}) => {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'Super Treasure Hunt':
        return 'bg-gradient-to-r from-amber-600 to-[#cca43b] text-white font-extrabold shadow-lg shadow-amber-500/10';
      case 'Exclusive':
        return 'bg-gradient-to-r from-zinc-700 to-zinc-900 border border-zinc-700 text-zinc-100 font-bold';
      case 'Rare':
        return 'bg-[#cca43b] text-black font-semibold';
      default:
        return 'bg-zinc-800 text-zinc-300';
    }
  };

  return (
    <div className="group relative bg-[#131315] border border-zinc-800/80 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#cca43b]/50 hover:shadow-2xl hover:shadow-[#cca43b]/5 flex flex-col h-full">
      {/* Sleek Header Accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#cca43b] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Image Showcase Frame */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-950/40 flex items-center justify-center p-3">
        {/* Rarity & Scale Floating Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          <span className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider rounded-md font-mono ${getRarityBadgeColor(product.rarity)}`}>
            {product.rarity}
          </span>
          <span className="self-start px-2 py-0.5 text-[10px] font-mono font-semibold bg-black/70 border border-zinc-700/50 text-[#cca43b] rounded-md">
            {product.scale}
          </span>
        </div>

        {/* Release Year badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-md">
            {product.year}
          </span>
        </div>

        {/* High-Resolution Vehicle Image */}
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-lg transform duration-500 group-hover:scale-103"
        />

        {/* Quick actions overlay visible on desktop hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={() => onQuickView(product)}
            className="p-3 bg-zinc-900 hover:bg-[#cca43b] text-white rounded-full transition-all duration-200 transform translate-y-4 group-hover:translate-y-0 shadow-lg"
            title="Quick View Details"
          >
            <Eye className="w-5 h-5" />
          </button>
          {!isOutOfStock && (
            <button
              onClick={() => onAddToCart(product)}
              className="p-3 bg-[#cca43b] hover:bg-[#b58f30] text-black rounded-full transition-all duration-200 transform translate-y-4 group-hover:translate-y-0 shadow-lg shadow-amber-500/10"
              title="Add to Vault"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Content & Metadata */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Series Badge */}
        <div className="mb-1 text-xs font-mono text-zinc-400 font-medium flex items-center justify-between">
          <span>{product.series}</span>
          <span className="text-[10px] text-zinc-500">{product.sku}</span>
        </div>

        {/* Product Title */}
        <h3 className="font-display font-bold text-lg text-white group-hover:text-[#cca43b] transition-colors duration-200 line-clamp-1 mb-2">
          {product.name}
        </h3>

        {/* Technical specifications row */}
        <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-mono mb-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-zinc-600" style={{ backgroundColor: product.color.toLowerCase().includes('blue') ? '#0066cc' : product.color.toLowerCase().includes('orange') ? '#ff5e00' : product.color.toLowerCase().includes('green') ? '#44aa44' : product.color.toLowerCase().includes('red') ? '#cc2222' : '#999999' }} />
            {product.color.split(' ')[0]}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
            <span className="text-zinc-300 font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-zinc-600">({product.reviewsCount})</span>
          </span>
        </div>

        {/* Push content to bottom of card */}
        <div className="mt-auto pt-3 border-t border-zinc-900 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest leading-none mb-1">Price</span>
            <span className="font-mono text-lg font-extrabold text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Direct Buy / Cart Action */}
          <div className="flex items-center gap-1.5">
            {isOutOfStock ? (
              <span className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 text-zinc-500 rounded-xl font-mono text-xs font-semibold">
                Sold Out
              </span>
            ) : (
              <>
                {isLowStock && (
                  <span className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-amber-500 mr-2">
                    <AlertCircle className="w-3 h-3 text-amber-500" /> Only {product.stock} left!
                  </span>
                )}
                <button
                  onClick={() => onAddToCart(product)}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-[#cca43b] hover:text-black hover:border-transparent text-white rounded-xl transition-all duration-200 font-mono text-xs font-semibold flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Add
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
