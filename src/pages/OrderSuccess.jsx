import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Package, Home, Download, MapPin, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // State to hold order details
    const [orderId, setOrderId] = useState(location.state?.orderId || `TMP-${Date.now().toString().slice(-6)}`);
    const [canteenNames, setCanteenNames] = useState(location.state?.canteenNames || []);
    const [items, setItems] = useState(location.state?.items || []);

    // Effect to fetch order details if not passed in state (e.g., page refresh)
    useEffect(() => {
        const fetchOrder = async () => {
            if (!location.state?.items && location.state?.orderId) {
                try {
                    const docRef = doc(db, "orders", location.state.orderId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setItems(data.items || []);
                        // Extract unique canteen names from items
                        const names = [...new Set(data.items.map(i => i.canteenName).filter(n => n))];
                        setCanteenNames(names);
                    }
                } catch (error) {
                    console.error("Error fetching order:", error);
                }
            }
        };
        fetchOrder();
    }, [location.state]);

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
            <div className="max-w-xl w-full text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-100"
                >
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Order Successful!</h1>
                    <p className="text-slate-500 text-lg mb-8">
                        Your delicious meal is being prepared. You will receive a notification when it's ready for pickup.
                    </p>

                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm mb-10 text-left">
                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-50">
                            <div className="flex items-center space-x-3">
                                <div className="bg-primary-50 p-2 rounded-xl">
                                    <Package className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Order ID</p>
                                    <p className="text-lg font-bold text-slate-900">#{orderId.slice(0, 8).toUpperCase()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status</p>
                                <p className="text-green-600 font-bold">In Preparation</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-sm items-start">
                                <span className="text-slate-500 shrink-0">Pick up at</span>
                                <div className="text-right">
                                    {canteenNames.length > 0 ? (
                                        canteenNames.map((name, idx) => (
                                            <p key={idx} className="font-bold text-slate-900 flex items-center justify-end gap-1">
                                                <Utensils className="w-3 h-3 text-slate-400" />
                                                <span>{name}</span>
                                            </p>
                                        ))
                                    ) : (
                                        <span className="font-bold text-slate-900">Main Square Canteen</span>
                                    )}
                                </div>
                            </div>

                            {/* Item Summary Preview */}
                            <div className="flex justify-between text-sm items-start pt-2 border-t border-slate-50 border-dashed">
                                <span className="text-slate-500">Items ({items.reduce((acc, i) => acc + i.quantity, 0)})</span>
                                <div className="text-right max-w-[200px]">
                                    <p className="font-medium text-slate-700 text-xs truncate">
                                        {items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Estimated Time</span>
                                <span className="font-bold text-slate-900">15 - 20 Minutes</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/"
                            className="w-full sm:w-auto btn-primary px-8 py-4 flex items-center justify-center space-x-2"
                        >
                            <Home className="w-5 h-5" />
                            <span>Back to Home</span>
                        </Link>
                        <button
                            className="w-full sm:w-auto btn-secondary px-8 py-4 flex items-center justify-center space-x-2"
                            onClick={() => window.print()}
                        >
                            <Download className="w-5 h-5" />
                            <span>Download Receipt</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OrderSuccess;
