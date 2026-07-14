import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag, Plus, Minus, CreditCard, ChevronLeft, CheckCircle2, Flame, Truck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'submitting' | 'confirmed'>('cart');
  
  // Shipping form state
  const [shippingForm, setShippingForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '4111 2222 3333 4444',
    cardExpiry: '12/28',
    cardCvc: '992',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [receiptNumber, setReceiptNumber] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 1999;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingCost = subtotal === 0 ? 0 : isFreeShipping ? 0 : 99;
  const taxRate = 0.12; // 12% GST
  const estimatedTax = subtotal * taxRate;
  const grandTotal = subtotal + shippingCost + estimatedTax;

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!shippingForm.name.trim()) errors.name = 'Full name is required';
    if (!shippingForm.email.trim() || !shippingForm.email.includes('@')) errors.email = 'Valid email is required';
    if (!shippingForm.address.trim()) errors.address = 'Address is required';
    if (!shippingForm.city.trim()) errors.city = 'City is required';
    if (!shippingForm.zip.trim()) errors.zip = 'PIN code is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setCheckoutStep('submitting');
    setTimeout(() => {
      setReceiptNumber(`NOBY-ORD-${Math.floor(100000 + Math.random() * 900000)}`);
      setCheckoutStep('confirmed');
    }, 2000);
  };

  const handleCloseAndReset = () => {
    onClose();
    // After drawer animation completes, reset steps
    setTimeout(() => {
      setCheckoutStep('cart');
      if (checkoutStep === 'confirmed') {
        onClearCart();
      }
    }, 4000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseAndReset}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Right Slide-Out Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-[#0c0c0d] border-l border-zinc-900 z-50 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* 1. Header of the Drawer */}
            <div className="p-5 border-b border-zinc-900 flex items-center justify-between bg-zinc-950">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#cca43b]/10 text-[#cca43b] rounded-xl">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-white text-base uppercase tracking-wider">
                    NOBY VALUABLES CART
                  </h3>
                  <p className="text-[11px] font-mono text-zinc-500">
                    {cartItems.length} Premium {cartItems.length === 1 ? 'item' : 'items'} in Vault
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseAndReset}
                className="p-2 text-zinc-500 hover:text-white rounded-xl hover:bg-zinc-900 transition-all duration-150"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Scrollable Body Content */}
            <div className="flex-grow overflow-y-auto p-5 flex flex-col gap-5">
              {checkoutStep === 'cart' && (
                <>
                  {/* Free Shipping Alert banner */}
                  {cartItems.length > 0 && (
                    <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex flex-col gap-2.5">
                      <div className="flex items-center justify-between text-xs font-mono font-bold">
                        <span className="flex items-center gap-1.5 text-zinc-300">
                          <Truck className="w-4 h-4 text-[#cca43b]" /> shipping tracker
                        </span>
                        {isFreeShipping ? (
                          <span className="text-emerald-400 uppercase tracking-wider">Unlocked!</span>
                        ) : (
                          <span className="text-zinc-500">
                            Add ₹{(freeShippingThreshold - subtotal).toLocaleString('en-IN')} more
                          </span>
                        )}
                      </div>
                      <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#cca43b] to-[#b58f30] transition-all duration-300"
                          style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-normal">
                        {isFreeShipping
                          ? 'Congrats! Your collection order qualifies for FREE Express Insured Shipping.'
                          : 'Orders over ₹1,999 qualify for free express shipping. Save on shipping fees!'}
                      </p>
                    </div>
                  )}

                  {/* Empty State */}
                  {cartItems.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center py-20 text-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-zinc-900/60 flex items-center justify-center border border-zinc-800 text-zinc-600">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-lg text-white">Your Cart is Empty</h4>
                        <p className="text-sm text-zinc-500 max-w-xs mx-auto mt-1">
                          Browse the showroom and add some premium models to your personal vault collection.
                        </p>
                      </div>
                      <button
                        onClick={onClose}
                        className="mt-2 px-5 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-[#cca43b]/50 hover:bg-[#cca43b]/5 text-white text-xs font-mono font-bold rounded-xl transition-all"
                      >
                        RETURN TO SHOWROOM
                      </button>
                    </div>
                  ) : (
                    /* Items list */
                    <div className="flex flex-col gap-3">
                      {cartItems.map((item) => {
                        const isMaxReached = item.quantity >= item.product.stock;
                        return (
                          <div
                            key={item.product.id}
                            className="bg-zinc-950 border border-zinc-900 p-3.5 rounded-2xl flex gap-3.5 relative overflow-hidden group hover:border-zinc-800 transition-colors"
                          >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-900/50 rounded-xl overflow-hidden border border-zinc-800/80 p-1 flex-shrink-0">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>

                            <div className="flex-grow flex flex-col min-w-0">
                              <div className="flex justify-between items-start gap-1">
                                <h4 className="text-sm font-display font-bold text-white truncate pr-4">
                                  {item.product.name}
                                </h4>
                                <button
                                  onClick={() => onRemoveItem(item.product.id)}
                                  className="text-zinc-600 hover:text-red-500 p-1 transition-colors -mt-1 -mr-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="flex gap-2 items-center text-[10px] font-mono text-zinc-500 mb-2 mt-0.5">
                                <span>{item.product.series}</span>
                                <span>•</span>
                                <span>{item.product.scale}</span>
                              </div>

                              <div className="flex items-center justify-between mt-auto">
                                {/* Quantity selector */}
                                <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
                                  <button
                                    onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                    className="p-1 text-zinc-500 hover:text-white rounded transition-colors"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="px-2 text-xs font-mono font-bold text-white min-w-[20px] text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                    disabled={isMaxReached}
                                    className={`p-1 rounded transition-colors ${
                                      isMaxReached
                                        ? 'text-zinc-800 cursor-not-allowed'
                                        : 'text-zinc-500 hover:text-white'
                                    }`}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                <div className="text-right">
                                  <span className="text-xs font-mono text-zinc-400 font-semibold block">
                                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                                  </span>
                                  <span className="text-[9px] font-mono text-zinc-600 block">
                                    ₹{item.product.price.toLocaleString('en-IN')} ea
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* SHIPPING INFORMATION FORM STEP */}
              {checkoutStep === 'shipping' && (
                <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-zinc-900 mb-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('cart')}
                      className="p-1 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h4 className="font-display font-bold text-sm text-white">COLLECTOR SHIPPING DETAILS</h4>
                      <p className="text-[10px] font-mono text-[#cca43b]">Secure Checkout Integration</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={shippingForm.name}
                      onChange={handleFormChange}
                      placeholder="Aarav Sharma"
                      className={`bg-zinc-950 border text-zinc-200 placeholder-zinc-700 rounded-xl px-3.5 py-2 text-sm outline-none transition ${
                        formErrors.name ? 'border-red-500' : 'border-zinc-800 focus:border-[#ff5e00]'
                      }`}
                    />
                    {formErrors.name && <span className="text-[10px] text-red-500 font-mono">{formErrors.name}</span>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingForm.email}
                      onChange={handleFormChange}
                      placeholder="collector@hotwheels.in"
                      className={`bg-zinc-950 border text-zinc-200 placeholder-zinc-700 rounded-xl px-3.5 py-2 text-sm outline-none transition ${
                        formErrors.email ? 'border-red-500' : 'border-zinc-800 focus:border-[#ff5e00]'
                      }`}
                    />
                    {formErrors.email && <span className="text-[10px] text-red-500 font-mono">{formErrors.email}</span>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase">Delivery Address</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingForm.address}
                      onChange={handleFormChange}
                      placeholder="Flat 402, Sea Breeze, Bandra West"
                      className={`bg-zinc-950 border text-zinc-200 placeholder-zinc-700 rounded-xl px-3.5 py-2 text-sm outline-none transition ${
                        formErrors.address ? 'border-red-500' : 'border-zinc-800 focus:border-[#ff5e00]'
                      }`}
                    />
                    {formErrors.address && <span className="text-[10px] text-red-500 font-mono">{formErrors.address}</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase">City</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingForm.city}
                        onChange={handleFormChange}
                        placeholder="Mumbai"
                        className={`bg-zinc-950 border text-zinc-200 placeholder-zinc-700 rounded-xl px-3.5 py-2 text-sm outline-none transition ${
                          formErrors.city ? 'border-red-500' : 'border-zinc-800 focus:border-[#ff5e00]'
                        }`}
                      />
                      {formErrors.city && <span className="text-[10px] text-red-500 font-mono">{formErrors.city}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase">PIN Code</label>
                      <input
                        type="text"
                        name="zip"
                        value={shippingForm.zip}
                        onChange={handleFormChange}
                        placeholder="400001"
                        className={`bg-zinc-950 border text-zinc-200 placeholder-zinc-700 rounded-xl px-3.5 py-2 text-sm outline-none transition ${
                          formErrors.zip ? 'border-red-500' : 'border-zinc-800 focus:border-[#ff5e00]'
                        }`}
                      />
                      {formErrors.zip && <span className="text-[10px] text-red-500 font-mono">{formErrors.zip}</span>}
                    </div>
                  </div>

                  {/* Payment simulation (Preset visual detail) */}
                  <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 flex flex-col gap-3 mt-1">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-400">
                      <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-[#cca43b]" /> DEMO CREDIT CARD</span>
                      <span className="text-[10px] bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded border border-zinc-800">SIMULATION</span>
                    </div>

                    <div className="flex flex-col gap-2 font-mono">
                      <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl text-xs text-zinc-300">
                        Card: {shippingForm.cardNumber}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400">
                        <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-center">Exp: {shippingForm.cardExpiry}</div>
                        <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-center">CVC: {shippingForm.cardCvc}</div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 mt-2 bg-[#cca43b] hover:bg-[#b58f30] text-black font-mono font-bold uppercase text-xs rounded-xl transition-all shadow-lg shadow-amber-500/5 flex items-center justify-center gap-2"
                  >
                    PLACE ORDER (₹{grandTotal.toLocaleString('en-IN')})
                  </button>
                </form>
              )}

              {/* PROCESSING LOADING SUBMIT */}
              {checkoutStep === 'submitting' && (
                <div className="flex-grow flex flex-col items-center justify-center py-20 text-center gap-5">
                  <div className="w-14 h-14 rounded-full border-4 border-zinc-800 border-t-[#cca43b] animate-spin" />
                  <div>
                    <h4 className="font-display font-bold text-lg text-white">SECURING RESERVATION...</h4>
                    <p className="text-sm text-zinc-500 max-w-xs mx-auto mt-1">
                      Processing your secure collection order and preparing your luxury showcase model...
                    </p>
                  </div>
                </div>
              )}

              {/* CONFRIMED SCREEN */}
              {checkoutStep === 'confirmed' && (
                <div className="flex-grow flex flex-col items-center justify-center py-10 text-center gap-5">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <h4 className="font-display font-extrabold text-2xl text-white tracking-tight uppercase">
                      ORDER SECURED!
                    </h4>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                      Congratulations collector! Your models are being prepared for premium bubble-wrapped transport.
                    </p>
                  </div>

                  {/* Summary card */}
                  <div className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl p-4 text-left font-mono text-xs flex flex-col gap-2">
                    <div className="flex justify-between border-b border-zinc-900 pb-2 mb-1">
                      <span className="text-zinc-500">Receipt ID:</span>
                      <span className="text-white font-bold">{receiptNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Deliver to:</span>
                      <span className="text-zinc-300">{shippingForm.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Delivery:</span>
                      <span className="text-[#cca43b] font-bold">Free Express</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-zinc-900 pt-2 mt-1">
                      <span className="text-zinc-300">Total Paid:</span>
                      <span className="text-emerald-400">₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-zinc-600 font-mono leading-normal max-w-xs">
                    A confirmation email was simulated and sent to <span className="text-zinc-400">{shippingForm.email}</span>. Thank you for using noby Premium Showcase!
                  </p>

                  <button
                    onClick={handleCloseAndReset}
                    className="w-full py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-white font-mono text-xs font-bold rounded-xl transition"
                  >
                    CONTINUE BROWSING
                  </button>
                </div>
              )}
            </div>

            {/* 3. Footer with Totals (Only in 'cart' view step) */}
            {checkoutStep === 'cart' && cartItems.length > 0 && (
              <div className="p-5 border-t border-zinc-900 bg-zinc-950 flex flex-col gap-4">
                <div className="flex flex-col gap-2 font-mono text-xs">
                  <div className="flex justify-between text-zinc-500">
                    <span>Subtotal:</span>
                    <span className="text-zinc-200">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Collector Shipping:</span>
                    {isFreeShipping ? (
                      <span className="text-emerald-400 font-semibold uppercase">FREE</span>
                    ) : (
                      <span className="text-zinc-200">₹{shippingCost.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>GST (12%):</span>
                    <span className="text-zinc-200">₹{estimatedTax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white border-t border-zinc-900 pt-2.5 mt-1">
                    <span>Total Estimated:</span>
                    <span className="text-[#cca43b] text-base">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutStep('shipping')}
                  className="w-full py-4 bg-[#cca43b] hover:bg-[#b58f30] text-black font-mono font-bold uppercase text-xs rounded-xl tracking-wider transition-all shadow-lg shadow-amber-500/5 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  SECURE CHECKOUT
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
