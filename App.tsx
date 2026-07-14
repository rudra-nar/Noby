import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HOTWHEELS_PRODUCTS } from './data/products';
import { HotWheelsProduct, CartItem, FilterState } from './types';
import { ProductCard } from './components/ProductCard';
import { Filters } from './components/Filters';
import { CartDrawer } from './components/CartDrawer';
import { ProductModal } from './components/ProductModal';
import { ToastNotification } from './components/ToastNotification';
import { 
  Flame, 
  ShoppingCart, 
  SlidersHorizontal, 
  Sparkles, 
  TrendingUp, 
  Package, 
  RotateCcw,
  Star,
  Layers,
  Award,
  BookOpen,
  Home,
  Info,
  X,
  ShieldCheck,
  Truck
} from 'lucide-react';

// Import our custom-generated high-resolution hero image
// @ts-expect-error - generated asset has no typescript declaration
import heroBanner from './assets/images/hotwheels_hero_banner_1784045661893.jpg';

export default function App() {
  // --- Cart State Persistence ---
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('hw_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('hw_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- Filter State ---
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    scale: [],
    series: [],
    year: [],
    priceRange: [0, 10000],
    sortBy: 'featured',
  });

  // --- Modal & Drawer States ---
  const [selectedProduct, setSelectedProduct] = useState<HotWheelsProduct | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // --- Toasts Notifications ---
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'cart-add' | 'info' }>>([]);

  const triggerToast = (message: string, type: 'success' | 'cart-add' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Metadata extraction for filters list ---
  const availableScales = Array.from(new Set(HOTWHEELS_PRODUCTS.map((p) => p.scale))).sort();
  const availableSeries = Array.from(new Set(HOTWHEELS_PRODUCTS.map((p) => p.series))).sort();
  const availableYears = Array.from(new Set(HOTWHEELS_PRODUCTS.map((p) => p.year))).sort((a, b) => b - a);

  // --- Filter application ---
  const filteredProducts = HOTWHEELS_PRODUCTS.filter((product) => {
    // 1. Search Query Match
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(q);
      const matchesColor = product.color.toLowerCase().includes(q);
      const matchesSku = product.sku.toLowerCase().includes(q);
      const matchesDesc = product.description.toLowerCase().includes(q);
      const matchesSeries = product.series.toLowerCase().includes(q);
      if (!matchesName && !matchesColor && !matchesSku && !matchesDesc && !matchesSeries) {
        return false;
      }
    }

    // 2. Scale Filter Match
    if (filters.scale.length > 0 && !filters.scale.includes(product.scale)) {
      return false;
    }

    // 3. Series Filter Match
    if (filters.series.length > 0 && !filters.series.includes(product.series)) {
      return false;
    }

    // 4. Year Filter Match
    if (filters.year.length > 0 && !filters.year.includes(product.year)) {
      return false;
    }

    // 5. Price Range Match
    const [minPrice, maxPrice] = filters.priceRange;
    if (product.price < minPrice || product.price > maxPrice) {
      return false;
    }

    return true;
  });

  // --- Sorting application ---
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'year-desc':
        return b.year - a.year;
      case 'rating':
        return b.rating - a.rating;
      case 'featured':
      default:
        // Default ranking sorting
        return a.id.localeCompare(b.id);
    }
  });

  // --- Shopping Cart Handlers ---
  const handleAddToCart = (product: HotWheelsProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          triggerToast(`Maximum stock limit reached for ${product.name}!`, 'info');
          return prev;
        }
        triggerToast(`Added another ${product.name} to vault!`, 'cart-add');
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      triggerToast(`Secured ${product.name} to vault!`, 'cart-add');
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    const product = HOTWHEELS_PRODUCTS.find((p) => p.id === productId);
    if (product && newQuantity > product.stock) {
      triggerToast(`Only ${product.stock} units available in archive stock.`, 'info');
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    const item = cartItems.find((i) => i.product.id === productId);
    if (item) {
      triggerToast(`${item.product.name} removed from vault.`, 'info');
    }
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      scale: [],
      series: [],
      year: [],
      priceRange: [0, 10000],
      sortBy: 'featured',
    });
    triggerToast('Filters reset successfully!', 'info');
  };

  const totalCartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 flex flex-col font-sans selection:bg-[#cca43b] selection:text-black pb-24 md:pb-0">
      {/* 1. Header Promotion Bar */}
      <div className="bg-zinc-950 text-zinc-300 font-mono text-[10px] sm:text-xs font-bold py-2 px-4 text-center select-none flex items-center justify-center gap-2 tracking-widest border-b border-zinc-900">
        <Sparkles className="w-3.5 h-3.5 text-[#cca43b] animate-pulse" />
        <span>LIMITED EDITION RELEASES: FREE EXPRESS COURIER SHIPPING ON ORDERS OVER ₹1,999</span>
        <Sparkles className="w-3.5 h-3.5 text-[#cca43b] animate-pulse" />
      </div>

      {/* 2. Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#070708]/90 backdrop-blur-xl border-b border-zinc-900/80 px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo with clean professional brand look */}
          <div className="flex items-center gap-3 select-none group">
            <div className="p-2.5 bg-[#cca43b]/10 border border-[#cca43b]/30 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-[#cca43b]/20">
              <Sparkles className="w-5 h-5 text-[#cca43b]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-2xl tracking-tighter text-white uppercase">noby</span>
                <span className="text-[10px] bg-[#cca43b]/10 border border-[#cca43b]/30 text-[#cca43b] px-1.5 py-0.5 rounded font-mono font-bold">
                  TOY STORE
                </span>
              </div>
              <p className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase leading-none mt-0.5">
                PREMIUM COLLECTOR VAULT
              </p>
            </div>
          </div>

          {/* Quick Stats Block (Desktop) */}
          <div className="hidden md:flex items-center gap-6 font-mono text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Package className="w-4 h-4 text-zinc-600" />
              <span>12 Rare Models</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-zinc-600" />
              <span>4 Scales</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-zinc-600" />
              <span>Red Line Club Exclusives</span>
            </div>
          </div>

          {/* Actions Block: Cart toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-zinc-900 border border-zinc-800 hover:border-[#cca43b] rounded-xl transition-all duration-200 group flex items-center gap-2"
              id="shopping-cart-button"
            >
              <ShoppingCart className="w-4 h-4 text-zinc-400 group-hover:text-[#cca43b] transition-colors" />
              <span className="hidden sm:inline font-mono text-xs font-bold text-zinc-300">Vault Cart</span>
              
              <AnimatePresence>
                {totalCartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 bg-[#cca43b] text-black text-[10px] font-mono font-black h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center border-2 border-[#070708]"
                  >
                    {totalCartItemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

        </div>
      </header>

      {/* 3. Hero Visual Section */}
      <section className="relative overflow-hidden bg-zinc-950 border-b border-zinc-900">
        <div className="absolute inset-0 bg-gradient-to-t from-[#070708] via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-black/40 z-10" />

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-20 relative z-20 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          
          {/* Hero text descriptor */}
          <div className="w-full md:w-1/2 flex flex-col gap-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/80 border border-zinc-800 rounded-full w-fit">
              <Sparkles className="w-3.5 h-3.5 text-[#cca43b]" />
              <span className="text-[10px] font-mono font-bold text-zinc-300 tracking-wider uppercase">noby Executive Curations</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-none uppercase">
              THE PREMIUM <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cca43b] via-amber-400 to-amber-200">
                COLLECTOR’S
              </span> VAULT
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-lg font-sans">
              noby Toy Store represents India's premier high-end destination for authentic miniature diecast collectibles.
              Discover pristine 1:64 mainline models, elite 1:18 scale masterpieces, and rare collector exclusives.
              Meticulously authenticated and sourced for passionate Indian collectors with express domestic white-glove courier delivery.
            </p>

            {/* Micro details panel */}
            <div className="grid grid-cols-3 gap-4 mt-2 max-w-md font-mono border-t border-zinc-900 pt-5">
              <div>
                <span className="text-xs text-zinc-500 block">AUTHENTIC</span>
                <span className="text-sm font-bold text-zinc-200">Insured Pack</span>
              </div>
              <div>
                <span className="text-xs text-zinc-500 block">EXECUTIVE</span>
                <span className="text-sm font-bold text-zinc-200">Licensed Gear</span>
              </div>
              <div>
                <span className="text-xs text-zinc-500 block">EXCLUSIVE</span>
                <span className="text-sm font-bold text-[#cca43b]">Vault Series</span>
              </div>
            </div>
          </div>

          {/* High-Resolution Hero Visual Showcase */}
          <div className="w-full md:w-1/2 relative aspect-16/9 rounded-2xl overflow-hidden border border-zinc-800/80 shadow-2xl shadow-black">
            <img
              src={heroBanner}
              alt="Hot Wheels High-Resolution Showcase"
              className="w-full h-full object-cover transform scale-102 hover:scale-105 duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
            {/* Soft decorative shadow/border glow on the image */}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
          </div>

        </div>
      </section>

      {/* 4. Main Product Catalog & Dashboard Grid */}
      <main id="showroom-section" className="flex-grow max-w-7xl mx-auto w-full px-4 lg:px-8 py-8 flex flex-col gap-6">
        
        {/* Mobile Filter Trigger Floating Bar */}
        <div className="flex md:hidden items-center justify-between bg-[#131315] border border-zinc-800 p-3.5 rounded-xl gap-3">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="flex items-center gap-2 text-xs font-mono font-bold text-white bg-zinc-900 px-4 py-2.5 rounded-lg border border-zinc-800 flex-grow justify-center"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#cca43b]" />
            FILTER ({filters.scale.length + filters.series.length + filters.year.length + (filters.search ? 1 : 0)})
          </button>
          
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
            className="bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#cca43b]"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low-High</option>
            <option value="price-desc">Price: High-Low</option>
            <option value="year-desc">Newest First</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar Filters (Desktop View) */}
          <aside className="hidden md:block col-span-1">
            <div className="sticky top-28">
              <Filters
                filters={filters}
                onFiltersChange={setFilters}
                availableScales={availableScales}
                availableSeries={availableSeries}
                availableYears={availableYears}
                totalResultsCount={sortedProducts.length}
              />
            </div>
          </aside>

          {/* Products Content Pane (3/4 grid) */}
          <section className="col-span-1 md:col-span-3 flex flex-col gap-6">
            
            {/* Catalog Toolbar Header (Desktop View) */}
            <div className="hidden md:flex items-center justify-between bg-[#131315] border border-zinc-900/60 p-4 rounded-2xl">
              <div>
                <h2 className="font-display font-extrabold text-lg text-white">THE SHOWROOM GALLERY</h2>
                <p className="text-xs font-mono text-zinc-500 mt-0.5">
                  Showing {sortedProducts.length} of {HOTWHEELS_PRODUCTS.length} premium models
                </p>
              </div>

              {/* Sort by dropdown */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-zinc-500">Sort By:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                  className="bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 px-3 py-2 rounded-xl focus:outline-none focus:border-[#cca43b] cursor-pointer"
                >
                  <option value="featured">Featured Collection</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="year-desc">Release: Newest First</option>
                  <option value="rating">Top Rated Collector Score</option>
                </select>
              </div>
            </div>

            {/* Active Filters Row (Desktop & Mobile) */}
            {(filters.scale.length > 0 || filters.series.length > 0 || filters.year.length > 0 || filters.search) && (
              <div className="flex flex-wrap items-center gap-2 p-3 bg-zinc-950 border border-zinc-900 rounded-xl">
                <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold mr-1">Active:</span>
                
                {filters.search && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded-lg">
                    Search: "{filters.search}"
                    <button onClick={() => setFilters({ ...filters, search: '' })} className="hover:text-red-500 font-bold ml-1">×</button>
                  </span>
                )}

                {filters.scale.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#cca43b]/10 border border-[#cca43b]/20 text-xs text-[#cca43b] rounded-lg font-mono">
                    Scale: {s}
                    <button onClick={() => setFilters({ ...filters, scale: filters.scale.filter((item) => item !== s) })} className="hover:text-red-500 font-bold ml-1">×</button>
                  </span>
                ))}

                {filters.series.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded-lg">
                    Series: {s}
                    <button onClick={() => setFilters({ ...filters, series: filters.series.filter((item) => item !== s) })} className="hover:text-red-500 font-bold ml-1">×</button>
                  </span>
                ))}

                {filters.year.map((y) => (
                  <span key={y} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-[#cca43b]/20 text-xs text-zinc-300 rounded-lg font-mono">
                    Year: {y}
                    <button onClick={() => setFilters({ ...filters, year: filters.year.filter((item) => item !== y) })} className="hover:text-red-500 font-bold ml-1">×</button>
                  </span>
                ))}

                <button
                  onClick={handleResetFilters}
                  className="text-[10px] font-mono text-red-500 hover:underline ml-auto pr-1"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Empty Showcase Fallback */}
            {sortedProducts.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center bg-[#131315] border border-zinc-900 rounded-2xl p-6">
                <div className="w-16 h-16 rounded-full bg-zinc-950 border border-zinc-850 flex items-center justify-center text-zinc-600 mb-4">
                  <RotateCcw className="w-6 h-6 animate-spin" style={{ animationDuration: '4s' }} />
                </div>
                <h3 className="font-display font-bold text-lg text-white">No Vehicles Match Your Query</h3>
                <p className="text-zinc-500 text-xs sm:text-sm max-w-sm mx-auto mt-1 mb-5">
                  Try adjusting or clearing your scale, series, and release year filters to explore other models in the showroom.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-[#cca43b] hover:bg-[#b58f30] text-black text-xs font-mono font-bold rounded-xl transition"
                >
                  RESET SHOWROOM FILTERS
                </button>
              </div>
            ) : (
              /* Product Showcase Cards Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setSelectedProduct}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}

          </section>

        </div>
      </main>

      {/* 5. Sleek Informative Footer */}
      <footer className="mt-auto bg-[#0c0c0d] border-t border-zinc-900/80 p-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 select-none">
            <div className="p-1.5 bg-[#cca43b]/10 border border-[#cca43b]/30 rounded-lg">
              <Sparkles className="w-4 h-4 text-[#cca43b]" />
            </div>
            <span className="font-display font-black text-sm text-white tracking-tighter uppercase">
              noby India Premium Collector Vault
            </span>
          </div>

          <p className="text-xs text-zinc-600 font-mono text-center md:text-right">
            © 2026 noby Premium India Collector Hub. Designed Minimalist. Simulated Storefront for Demo Purposes only.
          </p>
        </div>
      </footer>

      {/* --- Shopping Cart Drawer Sidebar --- */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* --- Detailed Product Modal --- */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* --- Collapsible Filters for Mobile View --- */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black z-50 md:hidden"
            />
            {/* Bottom/Right Slide-in sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-[#0c0c0d] border-t border-zinc-900 rounded-t-3xl p-5 z-50 overflow-y-auto md:hidden"
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-900">
                <span className="font-display font-bold text-base text-white">COLLECTION FILTERS</span>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="text-xs font-mono font-bold bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-800 text-zinc-400"
                >
                  Done
                </button>
              </div>

              <Filters
                filters={filters}
                onFiltersChange={setFilters}
                availableScales={availableScales}
                availableSeries={availableSeries}
                availableYears={availableYears}
                totalResultsCount={sortedProducts.length}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Premium Store Guarantee Info Modal --- */}
      <AnimatePresence>
        {isInfoOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInfoOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            
            {/* Modal Sheet */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-[#0c0c0d] border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden pointer-events-auto shadow-2xl shadow-black font-sans"
              >
                {/* Modal Header */}
                <div className="p-5 border-b border-zinc-900 flex items-center justify-between bg-zinc-950">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-[#cca43b]/10 text-[#cca43b] rounded-xl">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm tracking-wide text-zinc-100 uppercase">
                        noby Executive Guarantee
                      </h3>
                      <p className="text-[10px] font-mono text-zinc-500">
                        100% Genuine Certified Luxury Collectibles
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsInfoOpen(false)}
                    className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">
                  
                  {/* Point 1 */}
                  <div className="flex gap-4">
                    <div className="p-2.5 h-10 w-10 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-center text-[#cca43b] flex-shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100">Absolute Authenticity Guarantee</h4>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        Every collectible is sourced directly from licensed global distributors and verified through rigorous authenticity protocols. No fakes or generic reproductions are ever hosted.
                      </p>
                    </div>
                  </div>

                  {/* Point 2 */}
                  <div className="flex gap-4">
                    <div className="p-2.5 h-10 w-10 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-center text-[#cca43b] flex-shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100">Secure Indian Courier Delivery</h4>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        We offer trackable express courier delivery to pin codes across India. Orders above ₹1,999 qualify for complimentary white-glove shipping.
                      </p>
                    </div>
                  </div>

                  {/* Point 3 */}
                  <div className="flex gap-4">
                    <div className="p-2.5 h-10 w-10 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-center text-[#cca43b] flex-shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100">Mint Condition Double-Box Packaging</h4>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        To protect the integrity of the collector's card and plastic blister, all items are shipped in high-grade double-walled cardboard boxes packed securely with micro bubble wrap.
                      </p>
                    </div>
                  </div>

                  {/* Corporate message banner */}
                  <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl text-center">
                    <p className="text-[11px] font-mono text-[#cca43b]">
                      TRUSTED BY PREMIUM DIECAST COLLECTORS NATIONWIDE
                    </p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-zinc-900 bg-zinc-950 flex justify-end">
                  <button
                    onClick={() => setIsInfoOpen(false)}
                    className="px-5 py-2 bg-zinc-900 border border-zinc-800 hover:border-[#cca43b]/40 text-zinc-300 hover:text-white rounded-lg text-xs font-mono font-bold transition-all duration-200"
                  >
                    CLOSE DETAILS
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* 6. Sticky Mobile Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-900 md:hidden flex items-center justify-around py-2.5 px-2 shadow-2xl safe-bottom">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-1 text-[10px] font-mono font-bold text-zinc-400 hover:text-[#cca43b] transition-colors flex-1"
        >
          <Home className="w-5 h-5 text-zinc-400" />
          <span>Home</span>
        </button>
        
        <button
          onClick={() => {
            const el = document.getElementById('showroom-section');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="flex flex-col items-center gap-1 text-[10px] font-mono font-bold text-zinc-400 hover:text-[#cca43b] transition-colors flex-1"
        >
          <Layers className="w-5 h-5 text-zinc-400" />
          <span>Showroom</span>
        </button>

        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="relative flex flex-col items-center gap-1 text-[10px] font-mono font-bold text-zinc-400 hover:text-[#cca43b] transition-colors flex-1"
        >
          <SlidersHorizontal className="w-5 h-5 text-zinc-400" />
          <span>Filter</span>
          {(filters.scale.length + filters.series.length + filters.year.length + (filters.search ? 1 : 0)) > 0 && (
            <span className="absolute top-0 right-6 w-2 h-2 bg-[#cca43b] rounded-full animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 text-[10px] font-mono font-bold text-zinc-400 hover:text-[#cca43b] transition-colors flex-1"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-zinc-400" />
            {totalCartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#cca43b] text-black text-[9px] font-mono font-black h-4 min-w-[16px] px-0.5 rounded-full flex items-center justify-center border border-zinc-950">
                {totalCartItemsCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

        <button
          onClick={() => setIsInfoOpen(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-mono font-bold text-zinc-400 hover:text-[#cca43b] transition-colors flex-1"
        >
          <Info className="w-5 h-5 text-zinc-400" />
          <span>Guarantee</span>
        </button>
      </div>

      {/* --- Floating Toast Notification Banners --- */}
      <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
