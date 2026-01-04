import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Star, ArrowRight, Search, Heart, Utensils, ChevronLeft, MapPin, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const Home = () => {
    const { collegeId } = useParams();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [canteens, setCanteens] = useState([]);
    const [college, setCollege] = useState(null);

    useEffect(() => {
        let unsubscribeCollege = null;
        let unsubscribeCanteens = null;

        const setupListeners = async () => {
            setLoading(true);
            try {
                // 1. Resolve College ID (String vs Number)
                const collegesRef = collection(db, "colleges");
                let qCollege = query(collegesRef, where("id", "==", parseInt(collegeId)));
                let collegeSnapshot = await getDocs(qCollege);

                if (collegeSnapshot.empty) {
                    qCollege = query(collegesRef, where("id", "==", collegeId));
                    collegeSnapshot = await getDocs(qCollege);
                }

                if (!collegeSnapshot.empty) {
                    const collegeDoc = collegeSnapshot.docs[0];
                    const collegeData = collegeDoc.data();
                    if (collegeData.isHidden === true || collegeData.isHidden === "true") {
                        setCollege(null);
                    } else {
                        setCollege(collegeData);
                    }

                    // Listen to College Updates (Real-time)
                    // We found the specific query that works, reuse it or listen to the doc directly
                    // Listening to the doc directly is safer if we have the Ref, but we queried by field 'id'.
                    // So we continue listening to the Query (which should return 1 doc).
                    unsubscribeCollege = onSnapshot(qCollege, (snapshot) => {
                        if (!snapshot.empty) {
                            const data = snapshot.docs[0].data();
                            if (data.isHidden === true || data.isHidden === "true") {
                                setCollege(null);
                            } else {
                                setCollege(data);
                            }
                        } else {
                            setCollege(null);
                        }
                    });

                    // 2. Resolve Canteens (Real-time) based on the resolved College ID type logic
                    const canteensRef = collection(db, "canteens");
                    // Assuming collegeId in canteens matches the type we found, or we try both?
                    // Let's rely on the URL param 'collegeId' again.

                    let qCanteens = query(canteensRef, where("collegeId", "==", parseInt(collegeId)));
                    // Quick check if this query yields empty, to decide which to listen to?
                    // Ideally we should just listen to the valid one.
                    // Doing a quick getDocs to decide which query to listen to is fine.
                    let checkCanteens = await getDocs(qCanteens);
                    if (checkCanteens.empty) {
                        qCanteens = query(canteensRef, where("collegeId", "==", collegeId));
                    }

                    unsubscribeCanteens = onSnapshot(qCanteens, (snapshot) => {
                        const canteensData = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        }));
                        setCanteens(canteensData);
                        setLoading(false);
                    });

                } else {
                    setCollege(null);
                    setLoading(false);
                }

            } catch (error) {
                console.error("Error setting up listeners:", error);
                setLoading(false);
            }
        };

        if (collegeId) {
            setupListeners();
        }

        return () => {
            if (unsubscribeCollege) unsubscribeCollege();
            if (unsubscribeCanteens) unsubscribeCanteens();
        };
    }, [collegeId]);

    const filteredCanteens = canteens.filter(canteen => {
        const name = canteen.name || '';
        const foodType = canteen.foodType || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            foodType.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-[#FF8C1A] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 font-bold animate-pulse">Loading Canteens...</p>
                </div>
            </div>
        );
    }

    if (!college) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-12 rounded-[3rem] shadow-xl text-center max-w-md w-full border border-slate-100"
                >
                    <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MapPin className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Institution Not Found</h2>
                    <p className="text-slate-500 font-medium mb-8 leading-relaxed">The campus you are looking for isn't registered in our system yet.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
                    >
                        Back to Selection
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* --- Premium College Hero --- */}
            <section className="relative pt-24 pb-32 flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={college.image}
                        className="w-full h-full object-cover brightness-[0.3]"
                        alt={college.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate('/')}
                        className="mb-10 flex items-center space-x-3 text-white/80 hover:text-white font-bold transition-all bg-white/10 hover:bg-white/20 w-fit px-6 py-3 rounded-2xl backdrop-blur-xl border border-white/10 group shadow-2xl"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs uppercase tracking-widest">Select University</span>
                    </motion.button>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl"
                    >
                        <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-none tracking-tight">
                            {college.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center space-x-3 text-white bg-[#FF8C1A] w-fit px-6 py-2.5 rounded-2xl shadow-xl shadow-orange-500/20 ring-1 ring-white/20 uppercase tracking-[0.2em] text-[10px] font-black">
                                <MapPin className="w-4 h-4" />
                                <span>{college.location}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                <span>Official Campus Partner</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- Refined Search Area --- */}
            <section className="max-w-7xl mx-auto px-4 -mt-12 mb-12 relative z-20">
                <div className="bg-white p-2 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col lg:flex-row gap-2 items-center">
                    <div className="relative flex-grow w-full flex items-center group">
                        <div className="pl-6 pr-4">
                            <Search className="text-slate-400 w-6 h-6 group-focus-within:text-[#FF8C1A] transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Find your favorite canteen or dish..."
                            className="flex-grow py-5 bg-transparent outline-none text-slate-900 text-lg font-bold placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="hidden md:block bg-slate-900 hover:bg-[#FF8C1A] text-white px-10 py-5 rounded-[1.2rem] font-black shadow-lg transition-all active:scale-95 text-xs uppercase tracking-widest">
                            Search
                        </button>
                    </div>
                </div>

                {/* Filter Chips */}
                <div className="flex flex-wrap justify-start mt-8 gap-3">
                    {['All Hubs', 'Veg Only', 'Non-Veg', 'Snacks'].map((filter) => (
                        <button
                            key={filter}
                            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${(filter === 'All Hubs' && !searchTerm)
                                ? 'bg-[#FF8C1A] text-white border-transparent shadow-lg shadow-orange-200'
                                : 'bg-white text-slate-500 border-slate-100 hover:border-[#FF8C1A]/30 hover:bg-orange-50'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </section>

            {/* --- Canteen Grid --- */}
            <section className="max-w-7xl mx-auto px-4 pt-16 pb-32">
                <div className="flex items-end justify-between mb-12 border-b border-slate-100 pb-8">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <span>Available Hubs</span>
                            {loading && <RefreshCw className="w-5 h-5 text-slate-300 animate-spin" />}
                        </h2>
                        <p className="text-slate-500 font-medium">Verified dining spots uploaded by campus administration</p>
                    </div>
                    <div className="text-[#FF8C1A] font-black text-xs uppercase tracking-widest bg-orange-50 px-4 py-2 rounded-xl border border-orange-100/50 shadow-sm">
                        {filteredCanteens.length} Hubs Found
                    </div>
                </div>

                <AnimatePresence>
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {filteredCanteens.length > 0 ? (
                            filteredCanteens.map((canteen, index) => (
                                <motion.div
                                    key={canteen.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`group rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm transition-all duration-500 flex flex-col ${(canteen.isOnline === true || canteen.isOnline === "true") ? 'bg-slate-50 grayscale cursor-not-allowed opacity-75' : 'bg-white hover:shadow-2xl hover:-translate-y-2'}`}
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={canteen.image}
                                            alt={canteen.name}
                                            className={`w-full h-full object-cover transition-transform duration-1000 ${(canteen.isOnline === true || canteen.isOnline === "true") ? '' : 'group-hover:scale-110'}`}
                                        />
                                        <div className="absolute top-5 left-5">
                                            <div className="bg-emerald-500/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center space-x-2 shadow-lg border border-emerald-400/50">
                                                <ShieldCheck className="w-4 h-4 text-white" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Admin Verified</span>
                                            </div>
                                        </div>
                                        <div className="absolute top-5 right-5 flex flex-col items-end gap-2">
                                            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center space-x-2 shadow-lg border border-white/50">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="text-sm font-black text-slate-900">{canteen.rating}</span>
                                            </div>
                                            {(canteen.isOnline === true || canteen.isOnline === "true") && (
                                                <div className="bg-red-500 text-white px-3 py-1.5 rounded-xl flex items-center shadow-lg border border-red-400">
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Unavailable</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
                                        <div className="absolute bottom-5 left-8">
                                            <div className="flex items-center space-x-2 text-white/90 text-[10px] font-black uppercase tracking-[0.2em]">
                                                <Utensils className="w-3.5 h-3.5 text-[#FF8C1A]" />
                                                <span>{canteen.foodType}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className={`text-2xl font-black text-slate-900 transition-colors leading-tight ${(canteen.isOnline === true || canteen.isOnline === "true") ? '' : 'group-hover:text-[#FF8C1A]'}`}>
                                                {canteen.name}
                                            </h3>
                                            <button className={`p-2 rounded-full transition-all group/heart ${(canteen.isOnline === true || canteen.isOnline === "true") ? 'bg-slate-100' : 'hover:bg-orange-50'}`}>
                                                <Heart className={`w-5 h-5 text-slate-300 transition-all ${(canteen.isOnline === true || canteen.isOnline === "true") ? '' : 'group-hover/heart:text-[#FF8C1A]'}`} />
                                            </button>
                                        </div>

                                        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 line-clamp-2">
                                            {canteen.description}
                                        </p>

                                        <div className="mb-6 flex items-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                            <span>Admin Updated: Today, 10:45 AM</span>
                                        </div>

                                        <div className="mt-auto">
                                            {(canteen.isOnline === true || canteen.isOnline === "true") ? (
                                                <button
                                                    disabled
                                                    className="w-full bg-slate-200 text-slate-400 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-3 cursor-not-allowed"
                                                >
                                                    <span>Currently Closed</span>
                                                </button>
                                            ) : (
                                                <Link
                                                    to={`/canteen/${canteen.id}`}
                                                    className="w-full bg-slate-50 group-hover:bg-[#FF8C1A] text-slate-800 group-hover:text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-3 transition-all duration-300 shadow-sm group-hover:shadow-orange-200"
                                                >
                                                    <span>Enter Hub</span>
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-inner">
                                    <Search className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2">No Hubs Found</h3>
                                <p className="text-slate-500 font-medium">Try searching for a different keyword or check back later.</p>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="mt-8 text-[#FF8C1A] font-black uppercase text-xs tracking-widest hover:underline"
                                >
                                    View All Available Hubs
                                </button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </section>

            {/* Mobile Sticky CTA */}
            <div className="fixed bottom-6 left-6 right-6 md:hidden z-50">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-transform"
                >
                    <Search className="w-5 h-5 text-[#FF8C1A]" />
                    <span>Search Canteens</span>
                </button>
            </div>
        </div>
    );
};

export default Home;
