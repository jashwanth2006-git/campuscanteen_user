import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);
        if (result.success) {
            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        const result = await googleLogin();
        if (result.success) {
            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-white overflow-hidden font-sans">
            {/* LEFT SECTION (Branding Panel) - 50% */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-orange-500 to-red-600 relative flex-col items-center justify-center text-white p-12 overflow-hidden">
                {/* Soft floating geometric shapes */}
                <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-2xl rotate-12" />
                <div className="absolute bottom-32 right-32 w-80 h-80 border border-white/10 rounded-full" />
                <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-white/5 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Logo Placeholder */}
                    {/* Logo Image */}
                    <div className="mb-10 relative">
                        <img
                            src={logo}
                            alt="Canteen Logo"
                            className="w-48 h-48 object-cover rounded-full shadow-2xl border-4 border-white/20"
                        />
                    </div>

                    <h1 className="text-5xl font-bold mb-6 tracking-tight">Hungry?</h1>
                    <p className="text-orange-50 text-xl font-normal max-w-lg leading-relaxed">
                        Order fresh food from your campus canteens in minutes. Skip the line, enjoy the time.
                    </p>
                </div>
            </div>

            {/* RIGHT SECTION (Login Form Panel) - 50% */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
                <div className="max-w-[480px] w-full">

                    <div className="flex flex-col items-center mb-6">
                        {/* Top Icon: Rounded square icon with lock symbol */}
                        <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm text-orange-600">
                            <Lock className="w-7 h-7" strokeWidth={2.5} />
                        </div>
                        {/* Heading Section */}
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
                        <p className="text-slate-400 font-medium">Login to grab a bite</p>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full h-14 flex items-center justify-center bg-white border-2 border-slate-200 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-all duration-200 mb-6 gap-3 shadow-sm hover:border-orange-200"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                        Continue with Google
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

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            {/* Email Address */}
                            <div>
                                <input
                                    type="email"
                                    required
                                    className="w-full h-14 px-5 rounded-2xl border-2 border-slate-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-slate-700 placeholder:text-slate-400 font-medium bg-white"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full h-14 px-5 pr-12 rounded-2xl border-2 border-slate-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-slate-700 placeholder:text-slate-400 font-medium bg-white"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Options Row */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center cursor-pointer group">
                                <div className="relative inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                </div>
                                <span className="ml-3 text-sm font-medium text-slate-500 group-hover:text-slate-600 transition-colors">Remember me</span>
                            </label>

                            <button type="button" className="text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors">
                                Forgot password?
                            </button>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-orange-200 transition-all duration-200 transform hover:-translate-y-0.5 text-lg mt-2"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <div className="flex items-center">
                                    Sign In <span className="ml-2 font-bold">→</span>
                                </div>
                            )}
                        </button>
                    </form>

                    {/* Bottom Text */}
                    <div className="text-center mt-6">
                        <p className="text-slate-500 font-medium">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-orange-600 font-bold hover:text-orange-700 hover:underline transition-all">
                                Create one now →
                            </Link>
                        </p>
                    </div>

                    {/* Footer Security Note */}
                    <div className="mt-8 flex items-center justify-center text-xs font-medium text-slate-400 gap-2 opacity-80 hover:opacity-100 transition-opacity">
                        <div className="bg-slate-200 text-slate-500 rounded-full p-1">
                            <ShieldCheck className="w-3 h-3" fill="currentColor" />
                        </div>
                        Secured with enterprise-grade encryption
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
