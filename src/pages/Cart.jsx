import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight, Receipt, Timer } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
    const navigate = useNavigate();

    const tax = cartTotal * 0.05; // 5% GST
    const platformFee = 10;
    const grandTotal = cartTotal + tax + platformFee;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <div className="bg-primary-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-16 h-16 text-primary-200" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
                    <p className="text-slate-500 mb-8 max-w-xs mx-auto">Looks like you haven't added anything to your cart yet. Go ahead and explore our canteens!</p>
                    <Link to="/" className="btn-primary inline-flex items-center space-x-2 px-8 py-3">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Browse Canteens</span>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-slate-600 hover:text-primary-600 transition-colors font-semibold"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Continue Ordering</span>
                </button>
                <h1 className="text-3xl font-bold text-slate-900">Your Cart</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Cart Items List */}
                <div className="lg:col-span-8 space-y-6">
                    <AnimatePresence>
                        {cartItems.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white rounded-2xl p-6 border border-slate-100 flex flex-col md:flex-row items-center md:items-stretch space-y-4 md:space-y-0 md:space-x-6 hover:shadow-md transition-shadow"
                            >
                                <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-grow flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <p className="text-slate-500 text-sm mt-1">From {item.canteenName || 'Your Campus Canteen'}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-4 md:mt-0">
                                        <p className="text-xl font-bold text-primary-600">₹{item.price * item.quantity}</p>

                                        <div className="flex items-center space-x-4 bg-slate-50 rounded-xl p-1.5 border border-slate-200">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="bg-white p-1.5 rounded-lg text-slate-600 shadow-sm hover:text-primary-600 transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="font-bold text-slate-800 min-w-[20px] text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="bg-white p-1.5 rounded-lg text-slate-600 shadow-sm hover:text-primary-600 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-4">
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm sticky top-[100px]">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center space-x-2">
                            <Receipt className="w-6 h-6 text-primary-600" />
                            <span>Order Summary</span>
                        </h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span className="font-semibold text-slate-900">₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>GST (5%)</span>
                                <span className="font-semibold text-slate-900">₹{tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Platform Fee</span>
                                <span className="font-semibold text-slate-900">₹{platformFee}</span>
                            </div>
                            <div className="pt-4 border-t border-dashed border-slate-200 flex justify-between">
                                <span className="text-lg font-bold text-slate-900">Grand Total</span>
                                <span className="text-2xl font-black text-primary-600">₹{grandTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="bg-orange-50 rounded-2xl p-4 mb-8 flex items-start space-x-3">
                            <Timer className="w-5 h-5 text-orange-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-orange-800">Ready in ~15 mins</p>
                                <p className="text-xs text-orange-600">Freshly prepared just for you</p>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/payment')}
                            className="w-full btn-primary h-14 text-lg flex items-center justify-center space-x-3 shadow-xl shadow-primary-200"
                        >
                            <span>Proceed to Payment</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
