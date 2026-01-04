import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Tag, LifeBuoy, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    // Track scroll position for navbar style
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleOrderClick = () => {
        if (window.location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById('partner-institutions');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            const element = document.getElementById('partner-institutions');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 px-6 py-3 ${scrolled ? 'bg-white shadow-xl border-b border-slate-100' : 'bg-white shadow-sm'}`}>
            <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                {/* Left Section: Logo */}
                <div className="flex items-center space-x-12">
                    <Link to="/" className="flex-shrink-0 hover:scale-105 transition-transform duration-300">
                        <div className="bg-[#fc8019] p-2 rounded-2xl shadow-lg shadow-orange-100/50">
                            <img
                                src="/logo.png"
                                alt="Campus Canteen"
                                className="h-9 w-auto brightness-0 invert"
                            />
                        </div>
                    </Link>
                </div>

                {/* Right Section: Nav Items */}
                <div className="flex items-center space-x-10">
                    <div
                        onClick={handleOrderClick}
                        className="flex items-center space-x-3 text-slate-700 hover:text-[#fc8019] font-bold cursor-pointer transition-all"
                    >
                        <Tag className="w-5 h-5" />
                        <span className="text-base">Order</span>
                    </div>

                    <Link to="/about" className="flex items-center space-x-3 text-slate-700 hover:text-[#fc8019] font-bold transition-all">
                        <Info className="w-5 h-5" />
                        <span className="text-base">About</span>
                    </Link>

                    <div className="flex items-center space-x-3 text-slate-700 hover:text-[#fc8019] font-bold cursor-pointer transition-all">
                        <LifeBuoy className="w-5 h-5" />
                        <span className="text-base">Help</span>
                    </div>

                    {user ? (
                        <div className="relative group">
                            <div className="flex items-center space-x-3 text-slate-700 hover:text-[#fc8019] font-bold cursor-pointer transition-all pb-4 -mb-4">
                                <User className="w-5 h-5" />
                                <span className="text-base uppercase truncate max-w-[100px]">{user.name.split(' ')[0]}</span>
                            </div>
                            <div className="hidden group-hover:block absolute top-full right-0 bg-white shadow-2xl rounded-xl border border-slate-100 p-2 min-w-[200px] z-50 pt-3">
                                <div className="absolute -top-2 left-0 right-0 h-2 bg-transparent"></div>
                                <Link to="/profile" className="w-full text-left px-4 py-3 hover:bg-slate-50 text-slate-700 rounded-lg text-sm flex items-center space-x-3 border-b border-slate-50 mb-1">
                                    <User className="w-4 h-4 text-slate-400" />
                                    <span>My Profile</span>
                                </Link>
                                <button onClick={handleLogout} className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 rounded-lg text-sm flex items-center space-x-3">
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center space-x-3 text-slate-700 hover:text-[#fc8019] font-bold transition-all">
                            <User className="w-5 h-5" />
                            <span className="text-base">Sign In</span>
                        </Link>
                    )}

                    <Link to="/cart" className="flex items-center space-x-3 text-slate-700 hover:text-[#00b200] font-bold transition-all relative group">
                        <div className="relative">
                            <ShoppingCart className={`w-5 h-5 ${cartCount > 0 ? 'text-[#00b200]' : 'text-slate-700'}`} />
                            {cartCount > 0 && (
                                <span className="absolute -top-4 -right-2 text-sm font-black text-[#00b200]">{cartCount}</span>
                            )}
                        </div>
                        <span className="text-base">Cart</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
