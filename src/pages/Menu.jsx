import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Minus, Star, Info, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, getDocs, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const Menu = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, cartItems, updateQuantity } = useCart();
    const [activeCategory, setActiveCategory] = useState('All');
    const [canteen, setCanteen] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Canteen Details
                // Assuming canteens are stored with their ID as the document ID or in a field.
                // Based on previous files, we used query by 'id' field in some places, but let's be robust.

                // First try to get by document ID (if typical Firestore usage)
                let canteenData = null;
                const canteenDocRef = doc(db, "canteens", id);
                const canteenDocSnap = await getDoc(canteenDocRef);

                if (canteenDocSnap.exists()) {
                    canteenData = { id: canteenDocSnap.id, ...canteenDocSnap.data() };
                } else {
                    // Fallback: Query by 'id' field if it's a structural field (like in dummyData legacy)
                    const canteensRef = collection(db, "canteens");
                    // Firestore is type sensitive. Try string first then number.
                    let q = query(canteensRef, where("id", "==", id));
                    let querySnapshot = await getDocs(q);

                    if (querySnapshot.empty) {
                        q = query(canteensRef, where("id", "==", parseInt(id)));
                        querySnapshot = await getDocs(q);
                    }

                    if (!querySnapshot.empty) {
                        canteenData = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
                    }
                }

                setCanteen(canteenData);

                if (canteenData) {
                    // Fetch Menu Items with REAL-TIME Listener
                    const menuItemsRef = collection(db, "menuItems");
                    let menuQ = query(menuItemsRef, where("canteenId", "==", parseInt(id)));

                    // Simple initial check to see if we need string ID instead
                    // For onSnapshot, we can't easily "await" and retry without complexity, 
                    // so we will setup listener based on robust logic or just try both?
                    // Better approach: Since we don't know if ID is string or int in DB,
                    // we can try one, if empty, try other. onSnapshot returns unsubscribe.

                    // To keep it simple and effective:
                    // 1. Try fetching ONCE to determine ID type (fast)
                    // 2. Then set up onSnapshot on the correct query.

                    let validQuery = query(menuItemsRef, where("canteenId", "==", parseInt(id)));
                    const checkSnapshot = await getDocs(validQuery);
                    if (checkSnapshot.empty) {
                        validQuery = query(menuItemsRef, where("canteenId", "==", id));
                    }

                    const unsubscribe = onSnapshot(validQuery, (snapshot) => {
                        const items = snapshot.docs.map(doc => {
                            const data = doc.data();
                            // Log strictly for debugging to see what Admin is sending
                            console.log(`Item: ${data.name}, available: ${data.available}, isSoldOut: ${data.isSoldOut}`);
                            return {
                                id: doc.id,
                                ...data
                            };
                        });
                        setMenuItems(items);
                        setLoading(false);
                    });

                    // Cleanup listener
                    return () => unsubscribe();
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching menu data:", error);
                setLoading(false);
            }
        };

        if (id) {
            // fetchData returns a cleanup function (unsubscribe) if it sets one up.
            // But since fetchData is async, we need a wrapper to handle the cleanup return.
            let cleanup;
            fetchData().then(c => cleanup = c);
            return () => {
                if (cleanup) cleanup();
            };
        }
    }, [id]);

    const filteredMenu = menuItems.filter(item =>
        (activeCategory === 'All' || item.category === activeCategory)
    );

    const categories = ['All', ...new Set(menuItems.map(i => i.category))];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 font-bold animate-pulse">Loading Menu...</p>
                </div>
            </div>
        );
    }

    if (!canteen) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800">Canteen not found</h2>
                    <button onClick={() => navigate('/')} className="mt-4 btn-primary">Back to Home</button>
                </div>
            </div>
        );
    }

    const getItemQuantity = (itemId) => {
        return cartItems.find(item => item.id === itemId)?.quantity || 0;
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Canteen Banner */}
            <div className="relative h-64 md:h-80 w-full">
                <img
                    src={canteen.image}
                    alt={canteen.name}
                    className="w-full h-full object-cover brightness-[1.1]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                <button
                    onClick={() => navigate(`/college/${canteen.collegeId}`)}
                    className="absolute top-6 left-6 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40 transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="absolute bottom-8 left-6 md:left-12 right-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">POPULAR</span>
                                <span className="flex items-center space-x-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded text-white text-xs">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span>{canteen.rating}</span>
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2">{canteen.name}</h1>
                            <p className="text-slate-200">{canteen.foodType} • {canteen.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Scroller */}
            <div className="sticky top-[64px] z-40 bg-white border-b border-slate-100 px-4 py-4 md:px-12">
                <div className="max-w-7xl mx-auto flex space-x-4 overflow-x-auto no-scrollbar">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${activeCategory === category
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-12 mt-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center space-x-2">
                    <ShoppingBag className="w-6 h-6 text-primary-600" />
                    <span>Menu Items</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredMenu.map((item, index) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center space-x-4 hover:shadow-lg transition-shadow"
                            >
                                <div className="relative h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className={`w-full h-full object-cover ${(item.isSoldOut === true || item.isSoldOut === "true" || item.available === false || item.available === "false") ? 'grayscale opacity-80' : ''}`}
                                    />
                                    <div className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-white ${item.type === 'Veg' ? 'bg-green-500' : 'bg-red-500'}`}>
                                        {item.type}
                                    </div>
                                    {(item.isSoldOut === true || item.isSoldOut === "true" || item.available === false || item.available === "false") && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="text-white text-[10px] font-black uppercase tracking-widest bg-red-600 px-2 py-1 rounded">Sold Out</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-grow">
                                    <h3 className="font-bold text-slate-900 text-lg mb-1">{item.name}</h3>
                                    <p className="text-primary-600 font-bold mb-4">₹{item.price}</p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-400 font-medium">
                                            {(item.isSoldOut === true || item.isSoldOut === "true" || item.available === false || item.available === "false") ? 'Unavailable' : `Qty: ${getItemQuantity(item.id)}`}
                                        </span>

                                        {(item.isSoldOut === true || item.isSoldOut === "true" || item.available === false || item.available === "false") ? (
                                            <button
                                                disabled
                                                className="bg-slate-100 text-slate-400 py-1.5 px-3 text-sm rounded-lg font-bold cursor-not-allowed border border-slate-200"
                                            >
                                                Sold Out
                                            </button>
                                        ) : getItemQuantity(item.id) > 0 ? (
                                            <div className="flex items-center space-x-3 bg-primary-50 rounded-lg p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="bg-white p-1 rounded-md text-primary-600 shadow-sm hover:bg-primary-100 transition-colors"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="font-bold text-primary-700 min-w-[20px] text-center">{getItemQuantity(item.id)}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="bg-white p-1 rounded-md text-primary-600 shadow-sm hover:bg-primary-100 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => addToCart({ ...item, canteenName: canteen.name, canteenId: canteen.id })}
                                                className="btn-primary py-1.5 px-3 text-sm flex items-center space-x-1"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span>Add</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Floating Cart Button for Mobile */}
            {cartItems.length > 0 && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="fixed bottom-6 left-4 right-4 md:hidden z-50"
                >
                    <button
                        onClick={() => navigate('/cart')}
                        className="w-full bg-primary-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-2xl"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <ShoppingBag className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-primary-100 font-medium underline">View Cart</p>
                                <p className="text-sm font-bold">{cartItems.length} Items</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold">₹{cartItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0)}</span>
                            <ChevronLeft className="w-5 h-5 rotate-180" />
                        </div>
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default Menu;
