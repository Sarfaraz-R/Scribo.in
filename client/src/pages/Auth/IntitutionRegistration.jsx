import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Check,
  Mail,
  ShieldCheck,
  ArrowRight,
  Building2,
  Globe,
  BookOpen,
  GraduationCap,
  ChevronDown,
  User,
  Sparkles,
  ExternalLink,
  ArrowLeft,
  Phone,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { registerInstitution, verifyInstitution } from '../../api/auth.api';
import { showError, showSuccess } from '../../utils/toastUtils';

// ─── Shared Components ────────────────────────────────────────────────────────
const Input = ({ icon, ...props }) => (
  <div className="relative group">
    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#f97316] transition-colors pointer-events-none">
      {icon}
    </div>
    <input
      {...props}
      className="w-full h-9 bg-[#0d1117] border border-white/10 rounded-lg pl-10 pr-4 text-white text-[13px] outline-none focus:border-[#f97316] transition-all duration-200 placeholder:text-gray-600 font-['DM_Sans']"
    />
  </div>
);

const SelectInput = ({ icon, children, ...props }) => (
  <div className="relative group">
    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#f97316] transition-colors pointer-events-none z-10">
      {icon}
    </div>
    <select
      {...props}
      className="w-full h-9 bg-[#0d1117] border border-white/10 rounded-lg pl-10 pr-8 text-[13px] outline-none focus:border-[#f97316] transition-all duration-200 appearance-none cursor-pointer font-['DM_Sans']"
      style={{ color: props.value ? '#fff' : '#4b5563' }}
    >
      {children}
    </select>
    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
      <ChevronDown size={12} />
    </div>
  </div>
);

const FieldLabel = ({ children, optional = false }) => (
  <div className="flex items-center justify-between mb-1">
    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-600 font-['DM_Sans']">
      {children}
    </span>
    {optional && (
      <span className="text-[10px] text-gray-700 font-['DM_Sans']">
        Optional
      </span>
    )}
  </div>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: 'trial',
    label: 'Trial',
    price: 'Free',
    desc: '30 days',
    features: ['100 students', 'Basic analytics'],
  },
  {
    id: 'basic',
    label: 'Basic',
    price: '₹999/mo',
    desc: 'Unlimited',
    features: ['Unlimited students'],
  },
  {
    id: 'pro',
    label: 'Pro',
    price: '₹2,499/mo',
    desc: 'Most popular',
    highlight: true,
    features: ['AI Proctoring', 'Plagiarism check'],
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    price: 'Custom',
    desc: 'SLA support',
    features: ['All Pro features', 'API access'],
  },
];

const STEPS = ['Institution', 'Admin Account', 'Review'];

// ─── Step 1 ───────────────────────────────────────────────────────────────────
function StepInstitution({ data, onChange }) {
  const slug = data.name
    ? data.name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
        .replace(/\s+/g, '-')
    : '';

  return (
    <div className="space-y-2.5">
      <div>
        <FieldLabel>Institution Name</FieldLabel>
        <Input
          icon={<Building2 size={14} />}
          type="text"
          placeholder="e.g. RNS Institute of Technology"
          value={data.name}
          onChange={(e) => onChange('name', e.target.value)}
        />
        {slug && (
          <p className="text-[10px] text-gray-600 mt-1 pl-1 font-['DM_Sans']">
            Your URL: scribo.com/<span className="text-[#f97316]">{slug}</span>
          </p>
        )}
      </div>

      <div>
        <FieldLabel optional>Official Domain</FieldLabel>
        <Input
          icon={<Globe size={14} />}
          type="text"
          placeholder="e.g. rnsit.ac.in"
          value={data.domain}
          onChange={(e) => onChange('domain', e.target.value)}
        />
      </div>

      <div>
        <FieldLabel>Subscription Plan</FieldLabel>
        <div className="grid grid-cols-2 gap-1.5">
          {PLANS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange('plan', p.id)}
              className={`relative text-left p-2.5 rounded-lg border transition-all duration-200 ${
                data.plan === p.id
                  ? 'border-[#f97316] bg-[#f97316]/[0.07]'
                  : 'border-white/10 bg-[#0d1117] hover:border-white/20'
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-2 right-2 text-[8px] font-black uppercase tracking-wider bg-[#f97316]/20 text-[#f97316] px-1.5 py-0.5 rounded-sm border border-[#f97316]/30">
                  Popular
                </span>
              )}
              <div className="flex items-center justify-between mb-0.5">
                <span
                  className={`text-[12px] font-bold font-['Syne'] ${data.plan === p.id ? 'text-[#f97316]' : 'text-white'}`}
                >
                  {p.label}
                </span>
                <span
                  className={`text-[10px] font-bold ${data.plan === p.id ? 'text-[#f97316]' : 'text-gray-500'}`}
                >
                  {p.price}
                </span>
              </div>
              <p className="text-[10px] text-gray-600">{p.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────
function StepAdmin({ data, onChange }) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getStrength = (val) => {
    if (!val) return { width: '0%', color: 'bg-transparent', label: '' };
    if (val.length < 6)
      return { width: '33%', color: 'bg-red-500', label: 'Weak' };
    if (val.length < 10)
      return { width: '66%', color: 'bg-amber-500', label: 'Fair' };
    return { width: '100%', color: 'bg-emerald-500', label: 'Strong' };
  };
  const strength = getStrength(data.password);

  return (
    <div className="space-y-2.5">
      <div className="flex items-start gap-2 p-2.5 bg-[#f97316]/[0.06] border border-[#f97316]/20 rounded-lg">
        <Sparkles size={12} className="text-[#f97316] mt-0.5 shrink-0" />
        <p className="text-[11px] text-gray-500 leading-relaxed font-['DM_Sans']">
          This becomes the{' '}
          <span className="text-[#f97316] font-bold">Super Admin</span> — full
          control over faculty, students, and tests.
        </p>
      </div>

      <div>
        <FieldLabel>Admin Full Name</FieldLabel>
        <Input
          icon={<User size={14} />}
          type="text"
          placeholder="e.g. Dr. Priya Nair"
          value={data.adminName}
          onChange={(e) => onChange('adminName', e.target.value)}
        />
      </div>

      <div>
        <FieldLabel>Phone Number</FieldLabel>
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
            placeholder="10-digit mobile number"
            maxLength={10}
            value={data.phone}
            onChange={(e) =>
              onChange('phone', e.target.value.replace(/\D/g, ''))
            }
            className="w-full h-9 bg-[#0d1117] border border-white/10 rounded-lg pl-[3.8rem] pr-4 text-white text-[13px] outline-none focus:border-[#f97316] transition-all duration-200 placeholder:text-gray-600 font-['DM_Sans']"
          />
        </div>
        {data.phone && data.phone.length > 0 && data.phone.length < 10 && (
          <p className="text-[11px] text-amber-500 mt-1 pl-1 font-['DM_Sans']">
            Enter all 10 digits.
          </p>
        )}
      </div>

      <div>
        <FieldLabel>Admin Email</FieldLabel>
        <Input
          icon={<Mail size={14} />}
          type="email"
          placeholder="admin@rnsit.ac.in"
          value={data.adminEmail}
          onChange={(e) => onChange('adminEmail', e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <FieldLabel>Password</FieldLabel>
        <div className="relative">
          <Input
            icon={<ShieldCheck size={14} />}
            type={showPass ? 'text' : 'password'}
            placeholder="Min 10 characters"
            value={data.password}
            onChange={(e) => onChange('password', e.target.value)}
            style={{ paddingRight: 36 }}
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
          >
            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${strength.color}`}
              style={{ width: strength.width }}
            />
          </div>
          {strength.label && (
            <span
              className={`text-[10px] font-bold min-w-[36px] font-['DM_Sans'] ${
                strength.label === 'Strong'
                  ? 'text-emerald-500'
                  : strength.label === 'Fair'
                    ? 'text-amber-500'
                    : 'text-red-500'
              }`}
            >
              {strength.label}
            </span>
          )}
        </div>
      </div>

      <div>
        <FieldLabel>Confirm Password</FieldLabel>
        <div className="relative">
          <Input
            icon={<ShieldCheck size={14} />}
            type={showConfirm ? 'text' : 'password'}
            placeholder="Re-enter password"
            value={data.confirmPassword}
            onChange={(e) => onChange('confirmPassword', e.target.value)}
            style={{ paddingRight: 36 }}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
          >
            {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        {data.confirmPassword && data.password !== data.confirmPassword && (
          <p className="text-[11px] text-red-500 mt-1 pl-1 font-['DM_Sans']">
            Passwords do not match.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────
function StepReview({ inst, admin }) {
  const slug = inst.name
    ? inst.name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
        .replace(/\s+/g, '-')
    : '—';

  const rows = [
    { label: 'Institution', value: inst.name || '—' },
    {
      label: 'URL',
      value: inst.name ? `scribo.com/${slug}` : '—',
      orange: true,
    },
    { label: 'Domain', value: inst.domain || '—' },
    {
      label: 'Plan',
      value: PLANS.find((p) => p.id === inst.plan)?.label || 'Trial',
    },
    { label: 'Admin Name', value: admin.adminName || '—' },
    { label: 'Admin Phone', value: admin.phone ? `+91 ${admin.phone}` : '—' },
    { label: 'Admin Email', value: admin.adminEmail || '—' },
  ];

  const isPro = inst.plan === 'pro' || inst.plan === 'enterprise';

  return (
    <div className="space-y-2.5">
      <div className="bg-[#0d1117] border border-white/10 rounded-lg overflow-hidden">
        {rows.map((r, i) => (
          <div
            key={r.label}
            className={`flex items-center justify-between px-3 py-2 text-[12px] font-['DM_Sans'] ${
              i < rows.length - 1 ? 'border-b border-white/[0.04]' : ''
            }`}
          >
            <span className="text-gray-600">{r.label}</span>
            <span
              className={`font-medium flex items-center gap-1.5 ${r.orange ? 'text-[#f97316]' : 'text-white'}`}
            >
              {r.value}
              {r.orange && r.value !== '—' && (
                <ExternalLink size={9} className="opacity-50" />
              )}
            </span>
          </div>
        ))}
      </div>

      {isPro && (
        <div className="p-2.5 bg-[#f97316]/[0.05] border border-[#f97316]/20 rounded-lg">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#f97316]/50 mb-2 font-['DM_Sans']">
            Features Included
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[
              'AI Proctoring',
              'Plagiarism Check',
              'Custom Branding',
              'Advanced Analytics',
            ].map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-[#f97316] bg-[#f97316]/10 border border-[#f97316]/20 px-2 py-0.5 rounded font-['DM_Sans']"
              >
                <Check size={8} strokeWidth={3} /> {f}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-start gap-2 py-1">
        <input
          type="checkbox"
          className="mt-0.5 w-3.5 h-3.5 rounded border-white/10 bg-[#0d1117] accent-[#f97316]"
        />
        <p className="text-[11px] text-gray-500 leading-tight font-['DM_Sans']">
          I confirm the details are accurate and agree to Scribo's{' '}
          <span className="text-[#f97316] cursor-pointer">Terms</span> &{' '}
          <span className="text-[#f97316] cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InstitutionRegister() {
  const [step, setStep] = useState(0);
  const [inst, setInst] = useState({
    name: '',
    domain: '',
    plan: 'trial',
  });
  const [admin, setAdmin] = useState({
    adminName: '',
    adminEmail: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const updateInst = (k, v) => setInst((p) => ({ ...p, [k]: v }));
  const updateAdmin = (k, v) => setAdmin((p) => ({ ...p, [k]: v }));

  const canNext = () => {
    if (step === 0) return inst.name.trim().length > 2;
    if (step === 1)
      return (
        admin.adminName.trim().length > 0 &&
        admin.adminEmail.trim().length > 0 &&
        admin.phone.length === 10 &&
        admin.password.length >= 6 &&
        admin.password === admin.confirmPassword
      );
    return true;
  };

  const progressPct = `${(step / (STEPS.length - 1)) * 100}%`;

const handleLaunch = async () => {
  setLoading(true);
  const data = {
    name: inst.name,
    domain: inst.domain,
    plan: inst.plan,
    adminName: admin.adminName,
    adminEmail: admin.adminEmail,
    password: admin.password,
    phone: admin.phone,
  };
  try {
    const response = await registerInstitution(data);
    showSuccess(response.message);
    setTimeout(() => {
      setLoading(false);
      setIsVerifying(true); // ✅ switch to OTP screen on success
    }, 800);
  } catch (error) {
    showError(error);
    setLoading(false); // ✅ always unfreeze UI on failure
  }
};

const handleVerifyOtp = async () => {
  setLoading(true);
  const data = {
    email: admin.adminEmail,
    otp,
  };
  try {
    const response = await verifyInstitution(data); // ✅ await is now inside try
    
    showSuccess(response.message+",Please login...");
    setTimeout(() => {
      setLoading(false);
      navigate('/auth/signin');
    }, 800);
  } catch (error) {
    showError(error);
    setLoading(false); 
  }
};

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
              'Isolated tenant — your data, only yours',
              'Automated judge with partial grading',
              'Live tests with AI proctoring (Pro+)',
              'Leaderboards, analytics & streaks',
              'Full faculty & student management',
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
          <div className="relative bg-[#020202] border border-white/10 rounded-xl p-4 w-52 shadow-2xl">
            <div className="flex justify-between items-end mb-3">
              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">
                Onboarded
              </span>
              <span className="text-xl font-black text-white font-['Syne']">
                12+
              </span>
            </div>
            <div className="space-y-2">
              {[
                ['CSE Dept', 95],
                ['ISE Dept', 80],
                ['ECE Dept', 65],
              ].map(([label, val]) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-[9px] text-gray-600 w-16 shrink-0">
                    {label}
                  </span>
                  <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#f97316]"
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-6 z-10 bg-[#020202] overflow-y-auto">
        <div className="relative z-10 w-full max-w-[400px] space-y-3 my-4">
          <div className="text-center md:text-left">
            <h2 className="text-white text-[24px] font-bold tracking-tight font-['Syne']">
              Register your Institution
            </h2>
            <p className="text-gray-500 text-[12px]">
              Set up your multi-tenant workspace in 3 steps.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              {STEPS.map((s, i) => (
                <span
                  key={s}
                  className="text-[10px] font-['DM_Sans'] transition-colors duration-300"
                  style={{
                    color:
                      i === step
                        ? '#f97316'
                        : i < step
                          ? 'rgba(255,255,255,0.4)'
                          : 'rgba(255,255,255,0.18)',
                    fontWeight: i === step ? 700 : 500,
                  }}
                >
                  {i < step ? '✓ ' : ''}
                  {s}
                </span>
              ))}
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#f97316] to-[#fb923c] rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ width: progressPct }}
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={(e) => e.preventDefault()}>
            {!isVerifying ? (
              <>
                {step === 0 && (
                  <StepInstitution data={inst} onChange={updateInst} />
                )}
                {step === 1 && (
                  <StepAdmin data={admin} onChange={updateAdmin} />
                )}
                {step === 2 && <StepReview inst={inst} admin={admin} />}
              </>
            ) : (
              <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center text-center space-y-2 mb-4">
                  <div className="w-12 h-12 bg-[#f97316]/10 rounded-full flex items-center justify-center text-[#f97316] mb-2">
                    <Mail size={24} />
                  </div>
                  <h3 className="text-white font-bold text-lg font-['Syne']">
                    Check your email
                  </h3>
                  <p className="text-[12px] text-gray-500 max-w-[280px]">
                    We've sent a 6-digit verification code to <br />
                    <span className="text-white font-medium">
                      {admin.adminEmail}
                    </span>
                  </p>
                </div>
                <div className="space-y-1">
                  <FieldLabel>Verification Code</FieldLabel>
                  <div className="relative group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#f97316] transition-colors">
                      <ShieldCheck size={14} />
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="0 0 0 0 0 0"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ''))
                      }
                      className="w-full h-11 bg-[#0d1117] border border-white/10 rounded-lg pl-10 text-center text-xl tracking-[0.5em] font-mono text-[#f97316] outline-none focus:border-[#f97316] transition-all placeholder:text-gray-800"
                    />
                  </div>
                </div>
                <p className="text-center text-[11px] text-gray-600">
                  Didn't receive it?{' '}
                  <button className="text-[#f97316] font-bold hover:underline">
                    Resend Code
                  </button>
                </p>
              </div>
            )}
          </form>

          {/* Controls */}
          <div className="flex gap-2">
            {!isVerifying ? (
              <>
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="flex-1 h-10 flex items-center justify-center gap-2 bg-[#0d1117] border border-white/10 rounded-lg text-gray-400 text-sm font-bold hover:border-white/25 transition-all"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                )}
                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => canNext() && setStep((s) => s + 1)}
                    disabled={!canNext()}
                    className={`flex-[2] h-10 flex items-center justify-center gap-2 text-white text-sm font-bold rounded-lg transition-all ${
                      canNext()
                        ? 'bg-[#f97316]'
                        : 'bg-[#f97316]/30 cursor-not-allowed'
                    }`}
                  >
                    Continue <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleLaunch}
                    disabled={loading}
                    className="flex-[2] h-10 flex items-center justify-center gap-2 bg-[#f97316] text-white text-sm font-bold rounded-lg shadow-[0_0_20px_rgba(249,115,22,0.25)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60"
                  >
                    {loading ? (
                      'Processing...'
                    ) : (
                      <>
                        <Check size={14} strokeWidth={3} /> Launch Institution
                      </>
                    )}
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsVerifying(false)}
                  className="flex-1 h-10 flex items-center justify-center gap-2 bg-[#0d1117] border border-white/10 rounded-lg text-gray-400 text-sm font-bold hover:text-white transition-all"
                >
                  Change Email
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otp.length !== 6 || loading}
                  className={`flex-[2] h-10 flex items-center justify-center gap-2 text-white text-sm font-bold rounded-lg transition-all ${
                    otp.length === 6 && !loading
                      ? 'bg-[#f97316]'
                      : 'bg-[#f97316]/30 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Verifying...' : 'Verify & Setup'}{' '}
                  <ArrowRight size={14} />
                </button>
              </>
            )}
          </div>

          <p className="text-center text-[13px] text-gray-500">
            Already registered?{' '}
            <Link
              to="/auth/signin"
              className="text-[#f97316] font-bold cursor-pointer hover:underline"
            >
              Sign In
            </Link>{' '}
            ·{' '}
            <Link
              to="/auth/register"
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              Student / Faculty
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
