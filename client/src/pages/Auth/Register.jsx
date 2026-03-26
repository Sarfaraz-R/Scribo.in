// client/src/pages/Auth/Register.jsx
import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Check,
  User,
  Mail,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  BookOpen,
  Building2,
  ChevronDown,
  Phone,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedInstitution } from '../../store/slice/institution.slice';
import { showError, showSuccess } from '../../utils/toastUtils';
import { registerUser, verifyUser } from '../../api/auth.api';
import { setUser } from '../../store/slice/auth.slice';
import { roleDashboard } from '../../components/auth/RouteGuards';

/* ── Shared Input ─────────────────────────────────────────────────── */
const Input = ({ icon, ...props }) => (
  <div className="relative group">
    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#f97316] transition-colors pointer-events-none">
      {icon}
    </div>
    <input
      {...props}
      className="w-full h-9 bg-[#0d1117] border border-white/10 rounded-lg pl-10 pr-4 text-white text-[13px] outline-none focus:border-[#f97316] transition-all duration-200 placeholder:text-gray-600"
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
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#f97316] transition-colors">
          <ShieldCheck size={14} />
        </div>
        <input
          type="text"
          maxLength={6}
          placeholder="0 0 0 0 0 0"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          className="w-full h-11 bg-[#0d1117] border border-white/10 rounded-lg pl-10 text-center text-xl tracking-[0.5em] font-mono text-[#f97316] outline-none focus:border-[#f97316] transition-all placeholder:text-gray-800"
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
          className="flex-1 h-10 flex items-center justify-center bg-[#0d1117] border border-white/10 rounded-lg text-gray-400 text-sm font-bold hover:border-white/25 transition-all"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => onVerify(otp)}
          disabled={otp.length !== 6 || loading}
          className={`flex-[2] h-10 flex items-center justify-center gap-2 text-white text-sm font-bold rounded-lg transition-all ${
            otp.length === 6 && !loading
              ? 'bg-[#f97316] hover:brightness-110 active:scale-[0.98]'
              : 'bg-[#f97316]/30 cursor-not-allowed'
          }`}
        >
          {loading ? 'Verifying...' : 'Verify & Continue'}{' '}
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

const Register = () => {
  const [role, setRole] = useState('STUDENT'); // ✅ uppercase to match backend
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allInstitutions = useSelector(
    (state) => state.institution.institutions
  );
  const [selectedInst, setSelectedInst] = useState(null);

  const getStrength = (val) => {
    if (val.length === 0) return { width: '0%', color: 'bg-transparent' };
    if (val.length < 6) return { width: '33%', color: 'bg-red-500' };
    if (val.length < 10) return { width: '66%', color: 'bg-amber-500' };
    return { width: '100%', color: 'bg-emerald-500' };
  };
  const strength = getStrength(password);

  const filteredList = (allInstitutions || []).filter((inst) =>
    inst.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      name,
      email,
      password,
      phone,
      role, // ✅ already uppercase
      institutionId: selectedInst?._id,
      rollNumber: role === 'STUDENT' ? rollNumber : undefined,
      employeeId: role === 'FACULTY' ? employeeId : undefined,
    };
    try {
      await registerUser(data);
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
      showSuccess('Account created! Welcome to Scribo :)');

      const accountStatus = String(user?.status || '').toLowerCase();
      if (accountStatus === 'pending' || accountStatus === 'rejected') {
        navigate('/pending-approval', { replace: true });
      } else {
        navigate(roleDashboard(user.role), { replace: true });
      }
    } catch (error) {
      showError(error);
      // Keep OTP screen open for retry — don't reset isVerifying
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled =
    loading ||
    !name ||
    !email ||
    phone.length !== 10 ||
    !selectedInst ||
    (role === 'STUDENT' && !rollNumber) ||
    (role === 'FACULTY' && !employeeId) ||
    !password ||
    password !== confirmPassword;

  return (
    <div className="h-screen w-screen bg-[#020202] flex overflow-hidden font-['DM_Sans']">
      <Toaster position="top-right" />

      {/* LEFT PANEL */}
      <div className="hidden md:flex md:w-[42%] bg-[#0d1117] relative flex-col items-center justify-center p-8 border-r border-white/5">
        <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
          <div className="mb-6">
            <h1 className="text-white text-[36px] font-bold tracking-tighter font-['Syne'] leading-tight">
              Scribo
            </h1>
            <p className="text-[#f97316] text-[10px] font-black uppercase tracking-[0.4em] mt-1">
              Every Line counts.
            </p>
          </div>
          <div className="space-y-3 mb-10 text-left w-full">
            {[
              'Partial marking that rewards effort',
              'Real-time collaboration & monitoring',
              'Instant automated evaluation',
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-gray-400 text-[13px]"
              >
                <div className="w-4 h-4 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-500 shrink-0">
                  <Check size={10} strokeWidth={3} />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-6 z-10 bg-[#020202] overflow-y-auto">
        <div className="relative z-10 w-full max-w-[400px] space-y-3 my-9">
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
                <h2 className="text-white text-[24px] font-bold tracking-tight font-['Syne']">
                  Create your account
                </h2>
                <p className="text-gray-500 text-[12px]">
                  Start coding smarter today.
                </p>
              </div>

              {/* Role Selector */}
              <div className="flex p-1 bg-[#0d1117]/60 backdrop-blur-sm border border-white/10 rounded-lg">
                {[
                  {
                    id: 'STUDENT',
                    label: 'Student',
                    icon: <GraduationCap size={16} />,
                  },
                  {
                    id: 'FACULTY',
                    label: 'Faculty',
                    icon: <BookOpen size={16} />,
                  },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`flex-1 h-9 flex items-center justify-center gap-2 rounded-md text-sm font-bold transition-all ${
                      role === r.id
                        ? 'bg-[#f97316] text-white shadow-lg'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {r.icon}
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>

              <form className="space-y-2.5" onSubmit={handleSubmit}>
                <Input
                  icon={<User size={14} />}
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  icon={<Mail size={14} />}
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {/* Phone */}
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#f97316] transition-colors pointer-events-none z-10">
                    <Phone size={14} />
                  </div>
                  <span className="absolute left-9 top-1/2 -translate-y-1/2 text-gray-500 text-[13px] pointer-events-none select-none z-10 leading-none">
                    +91
                  </span>
                  <span className="absolute left-[3.25rem] top-1/2 -translate-y-1/2 h-3.5 w-px bg-white/10 pointer-events-none z-10" />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    maxLength={10}
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, ''))
                    }
                    className="w-full h-9 bg-[#0d1117] border border-white/10 rounded-lg pl-[3.8rem] pr-4 text-white text-[13px] outline-none focus:border-[#f97316] transition-all duration-200 placeholder:text-gray-600"
                  />
                </div>

                {/* Institution Selector */}
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
                      {selectedInst ? selectedInst.name : 'Select Institution'}
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

                <Input
                  icon={<User size={14} />}
                  type="text"
                  placeholder={role === 'STUDENT' ? 'Roll Number' : 'Employee ID'}
                  value={role === 'STUDENT' ? rollNumber : employeeId}
                  onChange={(e) =>
                    role === 'STUDENT'
                      ? setRollNumber(e.target.value)
                      : setEmployeeId(e.target.value)
                  }
                />

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="relative">
                    <Input
                      icon={<ShieldCheck size={14} />}
                      type={showPass ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                    >
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                </div>

                <Input
                  icon={<ShieldCheck size={14} />}
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[11px] text-red-500 pl-1">
                    Passwords do not match.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className="w-full h-10 bg-[#f97316] text-white text-sm font-bold rounded-lg shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating account...' : 'Create Account'}{' '}
                  <ArrowRight size={16} />
                </button>
              </form>

              <p className="text-center text-[13px] text-gray-500">
                Already have an account?{' '}
                <Link
                  to="/auth/signin"
                  className="text-[#f97316] font-bold cursor-pointer hover:underline"
                >
                  Sign In
                </Link>
              </p>

              <p className="text-center text-[12px] text-gray-600">
                Registering an institution?{' '}
                <Link
                  to="/auth/register-institution"
                  className="text-[#f97316] font-bold hover:underline"
                >
                  Register Institution →
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
