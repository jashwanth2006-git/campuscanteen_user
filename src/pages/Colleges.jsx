import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Search, School, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const Colleges = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedState, setSelectedState] = useState('All States');
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const collegesRef = collection(db, "colleges");

        const unsubscribe = onSnapshot(collegesRef, (snapshot) => {
            const collegesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setColleges(collegesData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching colleges: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Extract unique states from colleges
    const uniqueStates = ['All States', ...new Set(colleges.map(c => c.state).filter(Boolean))].sort();

    const filteredColleges = colleges.filter(college => {
        const name = (college.name || '').toLowerCase().trim();
        const city = (college.location || '').toLowerCase().trim();
        const state = (college.state || '').toLowerCase().trim();
        const search = searchTerm.toLowerCase().trim();

        // Search Filter (Name or City)
        const matchesSearch = name.includes(search) || city.includes(search);

        // State Filter
        const matchesState = selectedState === 'All States' || state === selectedState.toLowerCase().trim();

        // Hidden Filter
        const isHidden = college.isHidden === true || college.isHidden === "true";

        return matchesSearch && matchesState && !isHidden;
    });

    const handleStateChange = (e) => {
        setSelectedState(e.target.value);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* ... (Hero Section remains) ... */}

            {/* --- Premium Hero Section (Condensed for replacement contextual match) --- */}
            <div className="relative bg-[#1a1c1e] pt-32 pb-40 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/campusbg.avif" className="w-full h-full object-cover opacity-30" alt="Campus Background" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#1a1c1e]"></div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#FF8C1A]/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] bg-[#FFC83D]/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full mb-8 shadow-2xl">
                        <div className="w-2 h-2 bg-[#FF8C1A] rounded-full animate-pulse"></div>
                        <span className="text-white text-xs font-black uppercase tracking-[0.2em]">Campus Food Delivery</span>
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none drop-shadow-2xl">
                        Order Food From Your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C1A] to-[#FFC83D]">Campus Canteens</span>
                    </motion.h1>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                        Fresh, affordable meals from verified campus canteens — <span className="text-[#FF8C1A] font-black underline decoration-white/20 underline-offset-8">no waiting in lines.</span>
                    </motion.p>

                    {/* Integrated Search Bar UX */}
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="max-w-3xl mx-auto">
                        <div className="bg-white p-2.5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col md:flex-row items-center group transition-all relative">
                            <div className="flex items-center flex-grow w-full px-4">
                                <div className="pr-3">
                                    <MapPin className="w-6 h-6 text-[#FF8C1A]" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search university, campus, or city"
                                    className="flex-grow py-4 bg-transparent outline-none text-slate-900 font-bold text-lg placeholder:text-slate-400 placeholder:font-medium"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="w-full md:w-auto bg-[#FF8C1A] hover:bg-[#e67e17] text-white px-10 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 mt-2 md:mt-0">
                                Find Food
                            </button>
                        </div>
                        <button className="mt-6 flex items-center space-x-2 text-slate-400 hover:text-[#FFC83D] transition-colors mx-auto font-bold text-sm tracking-wide group">
                            <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform text-[#FFC83D]" />
                            <span>Use my current location</span>
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* --- Content Section --- */}
            <div id="partner-institutions" className="max-w-7xl mx-auto px-4 pt-24 relative z-20">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-16 gap-8">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center space-x-3">
                            <span>Partner <span className="text-[#FF8C1A]">Institutions</span></span>
                        </h2>
                        <p className="text-slate-500 font-medium text-lg mt-2">Discover curated dining hubs within your reach</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 flex-grow max-w-4xl justify-end">

                        {/* State Filter Dropdown */}
                        <div className="relative min-w-[200px] w-full sm:w-auto">
                            <select
                                value={selectedState}
                                onChange={handleStateChange}
                                className="w-full appearance-none bg-white border-2 border-slate-100 px-6 py-4 rounded-[1.5rem] text-slate-900 font-bold focus:border-[#FF8C1A]/30 focus:ring-4 focus:ring-orange-50 outline-none transition-all shadow-sm cursor-pointer hover:border-slate-200"
                            >
                                {uniqueStates.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                <MapPin className="w-4 h-4 text-slate-400" />
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative flex-grow w-full group max-w-xs">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#FF8C1A] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search colleges..."
                                className="w-full bg-white border-2 border-slate-100 pl-14 pr-6 py-4 rounded-[1.5rem] text-slate-900 font-bold placeholder:text-slate-300 focus:border-[#FF8C1A]/30 focus:ring-8 focus:ring-orange-50 outline-none transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="hidden xl:flex text-[#FF8C1A] text-[10px] font-black bg-orange-50 px-6 py-4 rounded-[1.5rem] uppercase tracking-[0.15em] ring-1 ring-orange-100/50 shadow-sm whitespace-nowrap">
                            {filteredColleges.length} Hubs
                        </div>
                    </div>
                </div>

                {/* Enhanced College Cards Grid */}
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 border-4 border-[#FF8C1A] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-500 font-bold animate-pulse">Loading Campuses...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {filteredColleges.length > 0 ? (
                            filteredColleges.map((college, index) => (
                                <motion.div
                                    key={college.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index % 3 * 0.1 }}
                                    className="group bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.12)] hover:-translate-y-4 transition-all duration-700 flex flex-col h-full ring-1 ring-slate-200/50"
                                >
                                    {/* Improved Card Image Area */}
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={college.image}
                                            alt={college.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                                        {/* Badges & Stats */}
                                        <div className="absolute top-6 left-6 flex flex-col space-y-2">
                                            <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-xl text-white text-[10px] font-black uppercase tracking-widest border border-white/20 flex items-center space-x-2">
                                                <School className="w-3 h-3" />
                                                <span>{college.location}</span>
                                            </div>
                                            {index === 0 && (
                                                <div className="bg-[#FF8C1A] text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center space-x-2 w-fit">
                                                    <Star className="w-3 h-3 fill-white" />
                                                    <span>Top Rated Hub</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="absolute bottom-6 left-8 right-8 flex justify-between items-center text-white">
                                            <div className="flex items-center space-x-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-xl text-xs font-black">
                                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                                <span>4.8</span>
                                            </div>
                                            <div className="flex items-center space-x-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-xl text-xs font-black">
                                                <ArrowRight className="w-3.5 h-3.5 text-[#FFC83D]" />
                                                <span>15-20 MIN</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Refined Card Content */}
                                    <div className="p-10 flex flex-col flex-grow">
                                        <h3 className="text-3xl font-black text-slate-800 leading-[1.1] mb-4 group-hover:text-[#FF8C1A] transition-colors">
                                            {college.name}
                                        </h3>
                                        <p className="text-slate-500 text-base font-medium leading-relaxed mb-10 line-clamp-2">
                                            {college.description}
                                        </p>

                                        <div className="mt-auto">
                                            <Link
                                                to={`/college/${college.id}`}
                                                className="w-full bg-slate-900 group-hover:bg-[#FF8C1A] text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-4 transition-all duration-300 shadow-xl shadow-slate-200 group-hover:shadow-[#FF8C1A]/30"
                                            >
                                                <span>Explore Canteens</span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-24 text-center">
                                <h3 className="text-3xl font-black text-slate-300">No campuses found nearby.</h3>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* Mobile Sticky CTA */}
            <div className="fixed bottom-6 left-6 right-6 md:hidden z-50">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="w-full bg-[#FF8C1A] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_10px_30px_rgba(255,140,26,0.4)] flex items-center justify-center space-x-3 active:scale-95 transition-transform"
                >
                    <Search className="w-5 h-5" />
                    <span>Find Your Campus Hub</span>
                </button>
            </div>
        </div>
    );
};

export default Colleges;
