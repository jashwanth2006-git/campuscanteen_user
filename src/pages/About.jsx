import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Shield, Users, ArrowRight, Utensils, Clock, Smartphone } from 'lucide-react';

const About = () => {
    const mainFeatures = [
        {
            icon: <Clock className="w-8 h-8 text-[#FF8C1A]" />,
            title: "Zero Waiting Time",
            description: "No more standing in long queues during short break intervals. Pre-order and pick up when ready."
        },
        {
            icon: <Shield className="w-8 h-8 text-[#FF8C1A]" />,
            title: "Verified Canteens",
            description: "We partner exclusively with authorized campus canteens to ensure hygiene and quality standards."
        },
        {
            icon: <Smartphone className="w-8 h-8 text-[#FF8C1A]" />,
            title: "Digitalized Payments",
            description: "Go cashless! Pay securely through our integrated payment gateways for a seamless experience."
        }
    ];

    const steps = [
        {
            id: "01",
            title: "Select Hub",
            description: "Choose your university campus and browse available canteens."
        },
        {
            id: "02",
            title: "Pick Your Meal",
            description: "Explore diverse menus and select your favorite fresh dishes."
        },
        {
            id: "03",
            title: "Easy Pickup",
            description: "Get notified when your order is ready and skip the line."
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* --- Hero Section --- */}
            <section className="relative pt-32 pb-40 overflow-hidden bg-[#1a1c1e]">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF8C1A]/10 via-transparent to-transparent opacity-50"></div>
                </div>

                {/* Decorative Blobs */}
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#FF8C1A]/5 rounded-full blur-[120px] animate-pulse"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8"
                    >
                        <span className="text-[#FF8C1A] text-xs font-black uppercase tracking-[0.2em]">Our Story</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter"
                    >
                        Digitizing the <span className="text-[#FF8C1A]">Campus</span> <br /> Dining Experience.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium"
                    >
                        Campus Canteen is a purpose-built platform designed to bridge the gap between busy students and quality campus food.
                    </motion.p>
                </div>
            </section>

            {/* --- Aim Section --- */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">
                                Our <span className="text-[#FF8C1A]">Mission</span>
                            </h2>
                            <p className="text-slate-600 text-lg leading-relaxed mb-8 font-medium">
                                We believe that students shouldn't have to choose between a healthy meal and their next lecture. Our mission is to optimize campus logistics so that fresh, piping-hot food is always just a few taps away.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="bg-orange-50 p-2 rounded-xl">
                                        <Target className="w-6 h-6 text-[#FF8C1A]" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 uppercase text-sm tracking-wider mb-1">Accessibility First</h4>
                                        <p className="text-slate-500 text-sm">Making diverse food options available to every student, everywhere on campus.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="bg-orange-50 p-2 rounded-xl">
                                        <Zap className="w-6 h-6 text-[#FF8C1A]" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 uppercase text-sm tracking-wider mb-1">Effortless Efficiency</h4>
                                        <p className="text-slate-500 text-sm">Streamlining order management for canteens to reduce peak-hour chaos.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            <div className="absolute -inset-4 bg-[#FF8C1A]/10 rounded-[4rem] scale-95 opacity-0 group-hover:opacity-100 transition-all duration-700 blur-2xl"></div>
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200"
                                className="w-full h-[500px] object-cover rounded-[3rem] shadow-2xl relative z-10 hover:scale-[1.02] transition-transform duration-700"
                                alt="Students working together"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- Key Features --- */}
            <section className="py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Built for <span className="text-[#FF8C1A]">Students</span></h2>
                        <p className="text-slate-500 font-medium">Why Campus Canteen is the #1 choice for universities.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {mainFeatures.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-12 rounded-[3rem] shadow-sm hover:shadow-xl transition-all duration-500 group border border-slate-100"
                            >
                                <div className="mb-8 bg-slate-50 w-20 h-20 rounded-[2rem] flex items-center justify-center group-hover:bg-[#FF8C1A] transition-colors duration-500">
                                    <div className="group-hover:text-white transition-colors duration-500">
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4">{feature.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- How It Works --- */}
            <section className="py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <div className="lg:w-1/3">
                            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">How It <span className="text-[#FF8C1A]">Works</span></h2>
                            <p className="text-slate-500 font-medium text-lg leading-relaxed mb-8">
                                We've made ordering food as simple as checking your class schedule.
                            </p>
                            <button className="flex items-center space-x-3 text-[#FF8C1A] font-black uppercase text-xs tracking-widest group">
                                <span>Learn More</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>

                        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative flex flex-col p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm"
                                >
                                    <span className="text-5xl font-black text-[#FF8C1A]/10 absolute -top-4 -left-4 select-none">
                                        {step.id}
                                    </span>
                                    <h4 className="text-xl font-black text-slate-900 mb-3 mt-4 relative z-10">
                                        {step.title}
                                    </h4>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed relative z-10">
                                        {step.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Footer CTA --- */}
            <section className="max-w-7xl mx-auto px-4 py-32">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-slate-900 rounded-[4rem] p-20 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF8C1A]/10 rounded-full blur-[100px]"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Ready to Skip the Line?</h2>
                        <div className="flex flex-wrap justify-center gap-6">
                            <button className="bg-[#FF8C1A] text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-[#e67919] transition-all shadow-xl shadow-[#FF8C1A]/20">
                                Start Ordering Now
                            </button>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default About;
