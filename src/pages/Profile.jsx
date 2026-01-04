import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    ShoppingBag,
    Heart,
    CreditCard,
    Settings,
    ChevronRight,
    CheckCircle2,
    XCircle,
    User as UserIcon,
    Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('Orders');

    const sidebarItems = [
        { id: 'Orders', name: 'My Orders', icon: ShoppingBag, color: 'text-primary-600' },
        { id: 'EditProfile', name: 'Edit Profile', icon: UserIcon, color: 'text-orange-500' },
        { id: 'Favorites', name: 'Favorites', icon: Heart, color: 'text-rose-500' },
        { id: 'Wallet', name: 'Payments', icon: CreditCard, color: 'text-indigo-500' },
        { id: 'Settings', name: 'Settings', icon: Settings, color: 'text-slate-500' },
    ];

    const pastOrders = [
        {
            id: 'ORD-99124',
            canteenName: 'Gourmet Kitchen',
            itemCount: 3,
            date: 'Nov 18, 2025',
            time: '10:14 AM',
            status: 'Delivered',
            amount: 245,
            items: ['Spiced Latte', 'Avocado Toast', 'Blueberry Muffin'],
            image: 'https://images.unsplash.com/photo-1567529684892-0f29630553ad?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: 'ORD-88231',
            canteenName: 'The Curry Pot',
            itemCount: 2,
            date: 'May 31, 2025',
            time: '09:34 AM',
            status: 'Cancelled',
            amount: 180,
            items: ['Chicken Tikka', 'Butter Naan'],
            image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=400'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />

                            <div className="relative">
                                <div className="relative w-24 h-24 mb-6">
                                    <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg">
                                        {user?.name?.[0] || 'J'}
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-md border border-slate-100 text-slate-400 hover:text-primary-600 transition-colors">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>

                                <h1 className="text-2xl font-black text-slate-900 mb-1">{user?.name || 'Jashwanth Reddy'}</h1>
                                <p className="text-slate-400 font-medium text-sm mb-6 uppercase tracking-widest">{user?.email || 'Student Account'}</p>

                                <div className="space-y-2">
                                    {sidebarItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${activeTab === item.id
                                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 translate-x-2'
                                                : 'text-slate-500 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : item.color}`} />
                                                <span className="font-bold text-sm">{item.name}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 opacity-50 ${activeTab === item.id ? 'block' : 'hidden md:block'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Content Section */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-3xl font-black text-slate-900">
                                        {activeTab === 'Orders' ? 'Order History' : sidebarItems.find(i => i.id === activeTab)?.name}
                                    </h2>
                                </div>

                                {activeTab === 'Orders' && (
                                    <div className="space-y-6">
                                        {pastOrders.map((order) => (
                                            <div key={order.id} className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/40 border border-slate-100 hover:border-primary-200 transition-all group">
                                                <div className="flex flex-col md:flex-row gap-6">
                                                    <div className="w-full md:w-32 h-32 flex-shrink-0">
                                                        <img src={order.image} className="w-full h-full object-cover rounded-[1.5rem] shadow-md group-hover:scale-105 transition-transform duration-500" alt="" />
                                                    </div>

                                                    <div className="flex-grow space-y-3">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="text-xl font-black text-slate-900">{order.canteenName}</h3>
                                                                <div className="flex items-center space-x-2 mt-1">
                                                                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">{order.id}</span>
                                                                    <span className="text-slate-300">•</span>
                                                                    <span className="text-xs text-slate-400 font-medium">{order.date}</span>
                                                                </div>
                                                            </div>
                                                            <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                                {order.status === 'Delivered' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                                <span className="text-[10px] font-black uppercase tracking-wider">{order.status}</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2">
                                                            {order.items.map((item, i) => (
                                                                <span key={i} className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{item}</span>
                                                            ))}
                                                        </div>

                                                        <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                                                            <div className="text-2xl font-black text-slate-900">₹{order.amount}</div>
                                                            <div className="flex space-x-3">
                                                                <button className="bg-white text-slate-900 border border-slate-200 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Support</button>
                                                                <button className="bg-primary-600 text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all active:scale-95">Reorder</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'EditProfile' && (
                                    <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden relative">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full -mr-32 -mt-32 opacity-50" />
                                        <div className="relative">
                                            <div className="flex items-center space-x-8 mb-12">
                                                <div className="relative">
                                                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-orange-400 to-rose-500 shadow-xl flex items-center justify-center text-white text-5xl font-black">
                                                        {user?.name?.[0] || 'J'}
                                                    </div>
                                                    <button type="button" className="absolute -bottom-3 -right-3 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 text-primary-600 hover:scale-110 transition-transform">
                                                        <Camera className="w-6 h-6" />
                                                    </button>
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-900">Personal Details</h3>
                                                    <p className="text-slate-400 font-medium">Update your campus account info</p>
                                                </div>
                                            </div>

                                            <form className="space-y-6 max-w-xl">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                                        <input
                                                            type="text"
                                                            defaultValue={user?.name}
                                                            className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-primary-500 transition-all outline-none"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                                        <input
                                                            type="tel"
                                                            defaultValue="9951072399"
                                                            className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-primary-500 transition-all outline-none"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                                    <input
                                                        type="email"
                                                        defaultValue={user?.email}
                                                        className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-primary-500 transition-all outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">College ID Number</label>
                                                    <input
                                                        type="text"
                                                        defaultValue="22241A0501"
                                                        className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-primary-500 transition-all outline-none"
                                                        placeholder="Enter College ID"
                                                    />
                                                </div>
                                                <div className="pt-6">
                                                    <button type="button" className="bg-primary-600 text-white px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all active:scale-95">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
