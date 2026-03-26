import React from 'react';
import { useSelector } from 'react-redux';
import PendingApprovalCard from '../../components/approval/PendingApprovalCard';
import { useLogout } from '../../hooks/useLogout';

export default function PendingApprovalPage() {
  const user = useSelector((state) => state.auth.user);
  const handleLogout = useLogout();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
        <div className="w-full text-right">
          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700"
          >
            Logout
          </button>
        </div>
        <PendingApprovalCard status={user?.status} />
      </div>
    </div>
  );
}
