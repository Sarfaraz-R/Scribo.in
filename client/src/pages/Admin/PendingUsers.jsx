import React, { useEffect, useMemo, useState } from 'react';
import {
  getPendingUsers,
  approveStudent,
  approveFaculty,
  rejectUser,
  getBranches,
  getBatches,
  getSections,
  getSubjects,
} from '../../api/admin.api';
import AdminUserApprovalTable from '../../components/approval/AdminUserApprovalTable';
import ApproveUserModal from '../../components/approval/ApproveUserModal';

export default function PendingUsersPage() {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [pendingRes, branchRes, batchRes, sectionRes, subjectRes] =
        await Promise.all([
          getPendingUsers(),
          getBranches(),
          getBatches(),
          getSections(),
          getSubjects(),
        ]);

      setUsers(pendingRes.data || []);
      setBranches(branchRes.data || []);
      setBatches(batchRes.data || []);
      setSections(sectionRes.data || []);
      setSubjects(subjectRes.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingCount = useMemo(() => users.length, [users]);

  const handleApprove = async (payload) => {
    if (!selectedUser) return;
    if (selectedUser.role === 'STUDENT') {
      await approveStudent(payload);
    } else {
      await approveFaculty(payload);
    }
    await loadData();
  };

  const handleReject = async (user) => {
    await rejectUser({ userId: user._id });
    await loadData();
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Admin Dashboard / Users
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Pending Requests</h1>
          <p className="mt-1 text-sm text-slate-600">{pendingCount} users waiting for approval</p>
        </div>

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-8 text-sm text-slate-500">
            Loading pending requests...
          </div>
        ) : (
          <AdminUserApprovalTable
            users={users}
            onApprove={(user) => setSelectedUser(user)}
            onReject={handleReject}
          />
        )}

        <ApproveUserModal
          open={Boolean(selectedUser)}
          user={selectedUser}
          branches={branches}
          batches={batches}
          sections={sections}
          subjects={subjects}
          onClose={() => setSelectedUser(null)}
          onApprove={handleApprove}
        />
      </div>
    </div>
  );
}
