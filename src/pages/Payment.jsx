import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const Payment = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const tax = cartTotal * 0.05;
    const platformFee = 10;
    const grandTotal = Math.round(cartTotal + tax + platformFee);

    const handlePayment = async (e) => {
        e.preventDefault();
        setError('');

        if (parseInt(amount) !== grandTotal) {
            return setError(`Please enter the exact total amount: ₹${grandTotal}`);
        }

        setLoading(true);

        try {
            // Simulate Payment Gateway Delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 1. Prepare data (excluding Firestore Sentinels which often fail JSON serialization)
            const rawOrderData = {
                userId: user?.uid || 'guest',
                userName: user?.name || 'Guest User',
                userEmail: user?.email || '',
                items: cartItems,
                totalAmount: grandTotal,
                tax: tax,
                platformFee: platformFee,
                status: 'Pending',
                paymentStatus: 'Paid',
                paymentMethod: 'Online',
                canteenIds: [...new Set(cartItems.map(item => item.canteenId).filter(id => id))],
                orderedAt: new Date().toISOString()
            };

            // 2. Sanitize to remove 'undefined' values (common Firestore error source)
            const cleanData = JSON.parse(JSON.stringify(rawOrderData));

            // 3. Add Firestore Sentinels back (they must be distinct objects)
            const orderData = {
                ...cleanData,
                createdAt: serverTimestamp()
            };

            console.log("Submitting Order to Firestore:", orderData);

            const docRef = await addDoc(collection(db, "orders"), orderData);
            console.log("Order WRITE SUCCESS. ID:", docRef.id);

            setLoading(false);
            const successState = {
                orderId: docRef.id,
                items: cartItems,
                canteenNames: [...new Set(cartItems.map(i => i.canteenName).filter(n => n))],
            };
            clearCart();
            navigate('/order-success', { state: successState });

        } catch (err) {
            console.error("FIRESTORE WRITE FAILED:", err);

            let errorMessage = "Failed to place order.";

            if (err.code === 'permission-denied') {
                errorMessage = "Access Denied: You do not have permission to place orders (Security Rules).";
            } else if (err.code === 'unavailable') {
                errorMessage = "Network Error: deeply check your internet connection or Firebase quota.";
            } else if (err.message) {
                errorMessage += ` ${err.message}`;
            }

            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
            >
                <div className="bg-primary-600 p-8 text-white text-center">
                    <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold">Secure Payment</h1>
                    <p className="opacity-80">Confirm your order amount to proceed</p>
                </div>

                <div className="p-8">
                    <div className="mb-10 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-500">Order Total</span>
                            <span className="text-2xl font-black text-slate-900">₹{grandTotal}</span>
                        </div>
                        <p className="text-xs text-slate-400 text-center uppercase tracking-widest font-bold mt-2">Dummy Payment Session</p>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 block uppercase tracking-wider">
                                Confirm Total Amount (₹)
                            </label>
                            <input
                                type="number"
                                required
                                className="w-full text-3xl font-bold text-center py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-primary-500 focus:ring-0 outline-none transition-all"
                                placeholder="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            {error && (
                                <div className="flex items-center space-x-2 text-red-500 text-sm font-medium mt-2 animate-pulse">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full h-16 rounded-2xl text-white font-bold text-lg shadow-xl transition-all flex items-center justify-center space-x-3 ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 active:scale-95'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Processing Payment...</span>
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="w-6 h-6" />
                                        <span>Pay ₹{grandTotal}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="text-center mt-8 text-xs text-slate-400 flex items-center justify-center space-x-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Encrypted with dummy 256-bit security</span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Payment;
