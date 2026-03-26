// client/src/pages/Auth/Signin.jsx
import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Mail,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  BookOpen,
  LogIn,
  Shield,
  Building2,
  ChevronDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { signIn, verifyUser } from '../../api/auth.api';
import { setSelectedInstitution } from '../../store/slice/institution.slice';
import { setUser } from '../../store/slice/auth.slice';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../../utils/toastUtils';
import { roleDashboard } from '../../components/auth/RouteGuards';

const Input = ({ icon, ...props }) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#f97316] transition-colors pointer-events-none">
      {icon}
    </div>
    <input
      {...props}
      className="w-full h-11 bg-[#0d1117] border border-white/10 rounded-lg pl-12 pr-4 text-white text-[14px] outline-none focus:border-[#f97316] transition-all duration-200 placeholder:text-gray-600"
    />
  </div>
);


function OtpScreen({ email, onVerify, onBack, loading }) {
  const [otp, setOtp] = useState('');

  const handleResend = () => {
    toast.success('New OTP sent!', {
      icon: '📬',
      style: {
        background: '#0d1117',
        color: '#fff',
        border: '1px solid rgba(249,115,22,0.4)',
      },
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in zoom-in duration-300">
      <div className="flex flex-col items-center text-center space-y-2 mb-2">
        <div className="w-12 h-12 bg-[#f97316]/10 rounded-full flex items-center justify-center text-[#f97316] mb-1">
          <Mail size={24} />
        </div>
        <h3 className="text-white font-bold text-lg font-['Syne']">
          Verify your email
        </h3>
        <p className="text-[12px] text-gray-500 max-w-[280px]">
          We sent a 6-digit code to{' '}
          <span className="text-white font-medium">{email}</span>
        </p>
      </div>

      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#f97316] transition-colors">
          <ShieldCheck size={16} />
        </div>
        <input
          type="text"
          maxLength={6}
          placeholder="0 0 0 0 0 0"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          className="w-full h-11 bg-[#0d1117] border border-white/10 rounded-lg pl-12 text-center text-xl tracking-[0.5em] font-mono text-[#f97316] outline-none focus:border-[#f97316] transition-all placeholder:text-gray-800"
        />
      </div>

      <p className="text-center text-[11px] text-gray-600">
        Didn't receive it?{' '}
        <button
          onClick={handleResend}
          className="text-[#f97316] font-bold hover:underline"
        >
          Resend Code
        </button>
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 h-11 flex items-center justify-center bg-[#0d1117] border border-white/10 rounded-lg text-gray-400 text-sm font-bold hover:border-white/25 transition-all"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => onVerify(otp)}
          disabled={otp.length !== 6 || loading}
          className={`flex-[2] h-11 flex items-center justify-center gap-2 text-white text-sm font-bold rounded-lg transition-all ${
            otp.length === 6 && !loading
              ? 'bg-[#f97316] hover:brightness-110 active:scale-[0.98]'
              : 'bg-[#f97316]/30 cursor-not-allowed'
          }`}
        >
          {loading ? 'Verifying...' : 'Verify & Sign In'}{' '}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [institution, setInstitution] = useState('');
  const [selectedInst, setSelectedInst] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState('STUDENT'); // ✅ uppercase to match backend
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(false);

  const allInstitutions = useSelector(
    (state) => state.institution.institutions
  );

  const filteredList = (allInstitutions || []).filter((inst) =>
    inst.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roles = [
    { id: 'STUDENT', label: 'Student', icon: <GraduationCap size={15} /> },
    { id: 'FACULTY', label: 'Faculty', icon: <BookOpen size={15} /> },
    { id: 'ADMIN', label: 'Admin', icon: <Shield size={15} /> },
  ];

  const isAdminRole = role === 'ADMIN';
  const isSubmitDisabled =
    !email || !password || (!isAdminRole && !institution);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = { email, password, role };
    if (!isAdminRole) data.institution = institution;

    try {
      await signIn(data);
      showSuccess('OTP sent! Check your inbox.');
      setIsVerifying(true);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (otp) => {
    setLoading(true);
    try {
      const res = await verifyUser({ email, otp });
      const { user, accessToken } = res.data;

      dispatch(setUser({ user, token: accessToken, role: user.role }));
      showSuccess('Welcome to Scribo :)');

      const accountStatus = String(user?.status || '').toLowerCase();
      if (accountStatus === 'pending' || accountStatus === 'rejected') {
        navigate('/pending-approval', { replace: true });
      } else {
        navigate(roleDashboard(user.role), { replace: true });
      }
    } catch (error) {
      showError(error);
      // Keep OTP screen open for retry
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#020202] flex overflow-hidden font-['DM_Sans']">
      <Toaster position="top-right" />

      {/* LEFT PANEL */}
      <div className="hidden md:flex md:w-[42%] bg-[#0d1117] relative flex-col items-center justify-center p-8 border-r border-white/5">
        <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
          <div className="mb-8">
            <h1 className="text-white text-[36px] font-bold tracking-tighter font-['Syne'] leading-tight">
              Scribo
            </h1>
            <p className="text-[#f97316] text-[10px] font-black uppercase tracking-[0.4em] mt-1 text-center">
              Welcome Back
            </p>
          </div>
          <div className="relative bg-[#020202] border border-white/10 rounded-xl p-6 w-64 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#f97316]/20 flex items-center justify-center text-[#f97316]">
                <LogIn size={18} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="h-1.5 w-20 bg-white/10 rounded-full" />
                <div className="h-1.5 w-12 bg-white/5 rounded-full" />
              </div>
            </div>
            <div className="h-px w-full bg-white/5" />
            <div className="space-y-2">
              <div className="h-1 w-full bg-white/5 rounded-full" />
              <div className="h-1 w-full bg-white/5 rounded-full" />
              <div className="h-1 w-2/3 bg-white/5 rounded-full" />
            </div>
          </div>
          <p className="mt-12 text-gray-500 text-[11px] leading-relaxed max-w-[240px]">
            Continue your journey in mastering data structures and algorithms
            with our <span className="text-white">Partial Marking Engine</span>.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-6 z-10 bg-[#020202]">
        <div className="relative z-10 w-full max-w-[400px] space-y-4">
          {isVerifying ? (
            <OtpScreen
              email={email}
              onVerify={handleVerify}
              onBack={() => setIsVerifying(false)}
              loading={loading}
            />
          ) : (
            <>
              <div className="text-center md:text-left">
                <h2 className="text-white text-[28px] font-bold tracking-tight font-['Syne']">
                  Sign In
                </h2>
                <p className="text-gray-500 text-[13px]">
                  Enter your credentials to access your dashboard.
                </p>
              </div>

              {/* Role Selector */}
              <div className="flex p-1 bg-[#0d1117]/60 backdrop-blur-sm border border-white/10 rounded-lg">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`flex-1 h-10 flex items-center justify-center gap-1.5 rounded-md text-[13px] font-bold transition-all ${
                      role === r.id
                        ? r.id === 'ADMIN'
                          ? 'bg-violet-600 text-white shadow-lg'
                          : 'bg-[#f97316] text-white shadow-lg'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {r.icon}
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>

              {isAdminRole && (
                <div className="flex items-center gap-2 px-3 py-2 bg-violet-600/10 border border-violet-500/20 rounded-lg">
                  <Shield size={13} className="text-violet-400 shrink-0" />
                  <p className="text-[11px] text-violet-400">
                    Admin access grants full platform control.
                  </p>
                </div>
              )}

              <form className="space-y-3" onSubmit={handleSubmit}>
                <Input
                  icon={<Mail size={16} />}
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {!isAdminRole && (
                  <div className="relative group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none z-10">
                      <Building2 size={14} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full h-9 bg-[#0d1117] border border-white/10 rounded-lg pl-10 pr-8 text-[13px] text-left outline-none focus:border-[#f97316] transition-all duration-200 cursor-pointer flex items-center"
                      style={{ color: selectedInst ? '#fff' : '#4b5563' }}
                    >
                      <span className="truncate">
                        {selectedInst
                          ? selectedInst.name
                          : 'Select Institution'}
                      </span>
                    </button>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </div>
                    {isOpen && (
                      <div className="absolute top-10 left-0 w-full bg-[#0d1117] border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col">
                        <div className="p-2 border-b border-white/5">
                          <input
                            autoFocus
                            type="text"
                            placeholder="Type to search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-8 bg-[#020202] border border-white/5 rounded px-3 text-[12px] text-white outline-none focus:border-[#f97316]/50 transition-all placeholder:text-gray-700"
                          />
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {filteredList.length === 0 ? (
                            <div className="px-4 py-3 text-[12px] text-gray-600 italic">
                              No institutions found
                            </div>
                          ) : (
                            filteredList.map((inst) => (
                              <button
                                key={inst._id}
                                type="button"
                                onClick={() => {
                                  setInstitution(inst.name);
                                  setSelectedInst(inst);
                                  dispatch(setSelectedInstitution(inst));
                                  setIsOpen(false);
                                  setSearchTerm('');
                                }}
                                className="w-full text-left px-4 py-2 text-[13px] text-gray-400 hover:bg-[#f97316]/10 hover:text-[#f97316] transition-colors flex items-center justify-between"
                              >
                                <span>{inst.name}</span>
                                {selectedInst?._id === inst._id && (
                                  <div className="w-1 h-1 rounded-full bg-[#f97316]" />
                                )}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      icon={<ShieldCheck size={16} />}
                      type={showPass ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-[11px] text-[#f97316] hover:underline font-bold"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitDisabled || loading}
                  className={`w-full h-11 text-white text-sm font-bold rounded-lg shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                    isAdminRole
                      ? 'bg-violet-600 shadow-violet-600/20'
                      : 'bg-[#f97316] shadow-[#f97316]/20'
                  }`}
                >
                  {loading ? 'Signing in...' : 'Sign In'}{' '}
                  <ArrowRight size={18} />
                </button>
              </form>

              {!isAdminRole && (
                <p className="text-center text-[14px] text-gray-500">
                  Don't have an account?{' '}
                  <Link
                    to="/auth/register"
                    className="text-[#f97316] font-bold cursor-pointer hover:underline"
                  >
                    Register Now
                  </Link>
                </p>
              )}

              <div className="flex items-center gap-2 px-3 py-2.5 bg-[#0d1117] border border-white/10 rounded-lg hover:border-[#f97316]/40 transition-all group">
                <Building2
                  size={14}
                  className="text-gray-600 group-hover:text-[#f97316] transition-colors shrink-0"
                />
                <p className="text-[12px] text-gray-500 flex-1">
                  Representing an institution?
                </p>
                <Link
                  to="/auth/register-institution"
                  className="text-[12px] text-[#f97316] font-bold hover:underline whitespace-nowrap"
                >
                  Register Institution →
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
