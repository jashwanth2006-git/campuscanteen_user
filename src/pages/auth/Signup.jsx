import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);

        const result = await signup({
            name: formData.name,
            email: formData.email,
            password: formData.password
        });

        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const handleGoogleSignup = async () => {
        setError('');
        setLoading(true);
        const result = await googleLogin();
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-white overflow-hidden font-sans">
            {/* Left Side - Signup Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
                <div className="max-w-md w-full">
                    <div className="text-center lg:text-center mb-6">
                        <div className="lg:hidden mx-auto w-24 h-24 mb-6 relative">
                            <img src={logo} alt="Logo" className="w-full h-full object-cover rounded-full shadow-lg border-2 border-orange-100" />
                        </div>
                        <div className="mx-auto w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 text-orange-600 shadow-sm">
                            <User className="w-7 h-7" strokeWidth={2.5} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">Join the Club</h2>
                        <p className="text-slate-500 mt-2 font-medium">Start your delicious journey today</p>
                    </div>

                    <button
                        onClick={handleGoogleSignup}
                        disabled={loading}
                        className="w-full h-14 flex items-center justify-center bg-white border-2 border-slate-200 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-all duration-200 mb-6 gap-3 hover:border-orange-200"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                        Sign up with Google
                    </button>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-slate-400 font-medium">OR</span>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center rounded-r">
                            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    className="w-full h-14 px-5 rounded-2xl border-2 border-slate-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-slate-700 placeholder:text-slate-400 font-medium bg-white"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    className="w-full h-14 px-5 rounded-2xl border-2 border-slate-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-slate-700 placeholder:text-slate-400 font-medium bg-white"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={6}
                                    className="w-full h-14 px-5 pr-12 rounded-2xl border-2 border-slate-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-slate-700 placeholder:text-slate-400 font-medium bg-white"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    className="w-full h-14 px-5 pr-12 rounded-2xl border-2 border-slate-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-slate-700 placeholder:text-slate-400 font-medium bg-white"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-orange-200 transition-all duration-200 transform hover:-translate-y-0.5 mt-6 text-lg"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <div className="flex items-center">
                                    Sign Up <span className="ml-2">→</span>
                                </div>
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-slate-500 font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-orange-600 font-bold hover:text-orange-700 hover:underline transition-all">
                                Sign in →
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 flex items-center justify-center text-xs font-medium text-slate-400 gap-2 opacity-80 hover:opacity-100 transition-opacity">
                        <div className="bg-slate-200 text-slate-500 rounded-full p-1">
                            <ShieldCheck className="w-3 h-3" fill="currentColor" />
                        </div>
                        Secured with enterprise-grade encryption
                    </div>
                </div>
            </div>

            {/* Right Side - Orange Gradient Section */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-orange-500 to-red-600 relative flex-col items-center justify-center text-white p-12 overflow-hidden">
                {/* Background Shapes */}
                <div className="absolute top-12 right-12 w-24 h-24 border border-white/20 rounded-xl -rotate-12" />
                <div className="absolute bottom-24 left-24 w-64 h-64 border border-white/10 rounded-full" />
                <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-48 h-48 mb-10 relative">
                        <img
                            src={logo}
                            alt="Canteen Logo"
                            className="w-48 h-48 object-cover rounded-full shadow-2xl border-4 border-white/20"
                        />
                    </div>

                    <h1 className="text-4xl font-bold mb-6 tracking-tight">Food Awaits!</h1>
                    <p className="text-orange-50 text-xl max-w-lg leading-relaxed font-normal">
                        Join your friends and order from the best canteens on campus.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
