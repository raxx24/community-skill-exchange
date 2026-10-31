import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  GraduationCap,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ArrowRightLeft,
  Target,
  ShieldCheck,
  Building,
  KeyRound,
  X,
} from 'lucide-react';
import { SkillCategory } from '../types';

const CATEGORIES: SkillCategory[] = [
  'Programming',
  'Design',
  'Communication',
  'Writing',
  'Media',
  'Business',
  'Other',
];

export const LoginView: React.FC = () => {
  const { login, register, resetPassword } = useApp();

  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sign In states
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('Computer Science Student');
  const [regHeadline, setRegHeadline] = useState('');
  const [regTeachSkill, setRegTeachSkill] = useState('');
  const [regTeachCategory, setRegTeachCategory] = useState<SkillCategory>('Programming');
  const [regLearnSkill, setRegLearnSkill] = useState('');
  const [regLearnCategory, setRegLearnCategory] = useState<SkillCategory>('Design');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot Password modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [forgotFeedback, setForgotFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!signInEmail.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = login(signInEmail, signInPassword);
      setIsLoading(false);
      if (!result.success && result.message) {
        setErrorMessage(result.message);
      }
    }, 400);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage('Please fill in your full name, email, and password.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please agree to the Community Code of Conduct.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = register({
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
        headline: regHeadline || `${regRole} enthusiastic about learning & skill sharing`,
        initialTeachingSkill: regTeachSkill,
        initialTeachingCategory: regTeachCategory,
        initialLearningSkill: regLearnSkill,
        initialLearningCategory: regLearnCategory,
      });
      setIsLoading(false);
      if (!result.success && result.message) {
        setErrorMessage(result.message);
      }
    }, 450);
  };

  const handleQuickFillStudent = () => {
    setSignInEmail('alex.morgan@campus.edu');
    setSignInPassword('password123');
    setErrorMessage('');
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !newPasswordInput.trim()) {
      setForgotFeedback({ type: 'error', msg: 'Please provide both email and a new password.' });
      return;
    }

    const result = resetPassword(forgotEmail, newPasswordInput);
    if (result.success) {
      setForgotFeedback({
        type: 'success',
        msg: 'Password updated successfully! You can now sign in with your new password.',
      });
      setTimeout(() => {
        setSignInEmail(forgotEmail);
        setSignInPassword(newPasswordInput);
        setIsForgotModalOpen(false);
        setForgotFeedback(null);
      }, 1500);
    } else {
      setForgotFeedback({ type: 'error', msg: result.message || 'Error resetting password.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Dynamic Background Mesh Gradients */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column: Brand Hero & Value Proposition */}
        <div className="lg:col-span-6 text-white space-y-8 py-4 sm:py-8 lg:pr-8">
          {/* Logo & Tagline */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-indigo-200 text-xs font-semibold backdrop-blur-md">
              <span className="text-base">🤝</span>
              <span>Collaborative Learning & Peer Mentorship Platform</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Share what you know. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">
                Learn what you need.
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              SkillBridge connects students, alumni, and professionals for structured peer-to-peer knowledge swaps, 1-on-1 mentoring, and milestone-tracked learning roadmaps.
            </p>
          </div>

          {/* Core Feature Value Props */}
          <div className="space-y-4">
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex-shrink-0 mt-0.5">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Smart Mutual Exchange Algorithm</h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Automatically pairs members where skills offered align with learning desires in a reciprocal 2-way partnership.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300 flex-shrink-0 mt-0.5">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Goal & Milestone Roadmap</h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Break ambitious skills down into verifiable checkpoints with dynamic progress tracking and target deadlines.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Verified Activity Audit & CSV Export</h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Log peer sessions with takeaways, track teaching vs learning balance, and download verified progress reports.
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900/40 to-slate-800/40 border border-indigo-500/20 text-xs text-indigo-200/90 leading-relaxed italic">
            "SkillBridge transformed how our campus peers exchange technical skills. I traded React code pairing for UI design systems mentorship and completed my capstone on time."
            <div className="mt-2 text-white font-bold not-italic flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              Alex Morgan • Computer Science Senior
            </div>
          </div>
        </div>

        {/* Right Column: Professional Authentication Card */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            {/* Header / Tabs */}
            <div className="p-6 sm:p-8 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
                    <span className="text-xl">🤝</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      SkillBridge Portal
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      {activeTab === 'signin' ? 'Sign in to your account' : 'Join the peer learning network'}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Network Active
                </span>
              </div>

              {/* Segmented Tab Switcher */}
              <div className="flex p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signin');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'signin'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'register'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 sm:p-8 pt-4">
              {errorMessage && (
                <div className="mb-4 p-3.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 animate-fade-in">
                  <span className="font-bold">⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* SIGN IN FORM */}
              {activeTab === 'signin' && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="you@institution.edu or email@domain.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsForgotModalOpen(true)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                      />
                      <span>Keep me signed in</span>
                    </label>

                    {/* Convenient Quick Fill Credentials */}
                    <button
                      type="button"
                      onClick={handleQuickFillStudent}
                      className="text-indigo-600 hover:text-indigo-800 font-bold underline"
                    >
                      Quick-fill test account
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Authenticating...
                      </span>
                    ) : (
                      <>
                        <span>Sign In to Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* CREATE ACCOUNT FORM */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-3.5 max-h-[65vh] overflow-y-auto pr-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Maya Lin"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Primary Role / Major / Discipline *
                    </label>
                    <input
                      type="text"
                      required
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                      placeholder="e.g. Computer Science Student, Product Designer, etc."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Initial Skill You Can Teach */}
                  <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
                    <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-indigo-600" />
                      A Skill You Can Teach (Optional initial)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={regTeachSkill}
                        onChange={(e) => setRegTeachSkill(e.target.value)}
                        placeholder="e.g. React, Python, Video Editing"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                      <select
                        value={regTeachCategory}
                        onChange={(e) => setRegTeachCategory(e.target.value as SkillCategory)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Initial Skill You Want to Learn */}
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-2">
                    <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      A Skill You Want to Learn (Optional initial)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={regLearnSkill}
                        onChange={(e) => setRegLearnSkill(e.target.value)}
                        placeholder="e.g. Figma, Public Speaking, D3"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                      <select
                        value={regLearnCategory}
                        onChange={(e) => setRegLearnCategory(e.target.value as SkillCategory)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none pt-1">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <span>
                      I agree to the Community Code of Conduct and commit to respectful, collaborative peer exchanges.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Account...
                      </span>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
                <KeyRound className="w-5 h-5" />
                Reset Account Password
              </div>
              <button
                onClick={() => {
                  setIsForgotModalOpen(false);
                  setForgotFeedback(null);
                }}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your registered email address and define your new password below.
            </p>

            {forgotFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold ${
                  forgotFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {forgotFeedback.msg}
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Registered Email
                </label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="e.g. alex.morgan@campus.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotModalOpen(false);
                    setForgotFeedback(null);
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
