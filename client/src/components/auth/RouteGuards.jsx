// client/src/routes/AuthRoutes.jsx
//
// ✅ THIS IS THE SINGLE SOURCE OF TRUTH for route guards.
// ❌ DELETE: client/src/components/auth/ (duplicated broken versions)
//
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// ─── Loading screen shown while startup refresh resolves ──────────────────────
export function AuthLoadingScreen() {
  return (
    <div className="h-screen w-screen bg-[#020202] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-[#f97316]/10 border border-[#f97316]/20 flex items-center justify-center">
            <span className="text-[#f97316] font-black text-lg font-['Syne']">
              S
            </span>
          </div>
          <div className="absolute inset-0 rounded-xl border-2 border-transparent border-t-[#f97316] animate-spin" />
        </div>
        <p className="text-gray-600 text-[11px] uppercase tracking-[0.3em] font-['DM_Sans']">
          Restoring session…
        </p>
      </div>
    </div>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────
export function roleDashboard(role) {
  switch (role?.toUpperCase()) {
    case 'STUDENT':
      return '/student/dashboard';
    case 'FACULTY':
      return '/faculty/dashboard';
    case 'ADMIN':
      return '/admin/dashboard';
    default:
      return '/auth/signin';
  }
}

const normalizeApprovalStatus = (status) => {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'active') return 'approved';
  if (normalized === 'pending' || normalized === 'approved' || normalized === 'rejected') {
    return normalized;
  }
  return 'approved';
};

// ─── Protected route — blocks unauthenticated users ───────────────────────────
/**
 * @param {string[]} allowedRoles  e.g. ['STUDENT'] or ['ADMIN', 'FACULTY']
 *
 * Shows a loading screen until the startup refresh resolves (isAuthChecked).
 * This prevents the flash-redirect to /signin on page refresh.
 */
export function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, isAuthChecked } = useSelector((s) => s.auth);
  const location = useLocation();

  // ✅ Wait for startup refresh to finish before making any routing decision
  if (!isAuthChecked) {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    // Not logged in → redirect to sign-in, remember where they wanted to go
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  const accountStatus = normalizeApprovalStatus(user?.status);
  const isPendingScreen = location.pathname === '/pending-approval';

  if ((accountStatus === 'pending' || accountStatus === 'rejected') && !isPendingScreen) {
    return <Navigate to="/pending-approval" replace />;
  }

  if (accountStatus === 'approved' && isPendingScreen) {
    return <Navigate to={roleDashboard(role)} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role?.toUpperCase())) {
    // Logged in but wrong role → send to their own dashboard
    return <Navigate to={roleDashboard(role)} replace />;
  }

  return children;
}

// ─── Guest route — blocks already-authenticated users ────────────────────────
/**
 * Wraps /auth/signin, /auth/register, /auth/register-institution.
 *
 * Also waits for isAuthChecked to avoid a flicker where the login page
 * renders for a split second before the user is redirected to their dashboard.
 */
export function GuestRoute({ children }) {
  const { user, role, isAuthChecked } = useSelector((s) => s.auth);

  // ✅ BUG FIX: original GuestRoute didn't check isAuthChecked, causing a
  // flash of the login page before redirect when user is already logged in
  if (!isAuthChecked) {
    return <AuthLoadingScreen />;
  }

  if (user) {
    const accountStatus = normalizeApprovalStatus(user?.status);
    if (accountStatus === 'pending' || accountStatus === 'rejected') {
      return <Navigate to="/pending-approval" replace />;
    }
    return <Navigate to={roleDashboard(role)} replace />;
  }

  return children;
}
