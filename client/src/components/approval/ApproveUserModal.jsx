import React, { useMemo, useState } from 'react';

export default function ApproveUserModal({
  open,
  user,
  branches,
  batches,
  sections,
  subjects,
  onClose,
  onApprove,
}) {
  const [branchId, setBranchId] = useState('');
  const [batchId, setBatchId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const isStudent = user?.role === 'STUDENT';

  const branchBatches = useMemo(
    () => batches.filter((b) => String(b.branchId) === String(branchId)),
    [batches, branchId]
  );

  const batchSections = useMemo(
    () => sections.filter((s) => String(s.batchId) === String(batchId)),
    [sections, batchId]
  );

  const branchSubjects = useMemo(
    () => subjects.filter((s) => !branchId || String(s.branchId) === String(branchId)),
    [subjects, branchId]
  );

  if (!open || !user) return null;

  const approve = async () => {
    if (isStudent) {
      await onApprove({ userId: user._id, branchId, batchId, sectionId });
    } else {
      await onApprove({ userId: user._id, branchId, subjects: selectedSubjects });
    }
    onClose();
  };

  const canApprove = isStudent
    ? branchId && batchId && sectionId
    : branchId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Approve {isStudent ? 'Student' : 'Faculty'}</h3>
          <p className="text-sm text-slate-600">{user.name} ({user.email})</p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Branch
            <select
              value={branchId}
              onChange={(e) => {
                setBranchId(e.target.value);
                setBatchId('');
                setSectionId('');
              }}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Select branch</option>
              {branches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>

          {isStudent ? (
            <>
              <label className="block text-sm font-medium text-slate-700">
                Batch
                <select
                  value={batchId}
                  onChange={(e) => {
                    setBatchId(e.target.value);
                    setSectionId('');
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="">Select batch</option>
                  {branchBatches.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.startYear}-{b.endYear}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Section
                <select
                  value={sectionId}
                  onChange={(e) => setSectionId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="">Select section</option>
                  {batchSections.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
            </>
          ) : (
            <label className="block text-sm font-medium text-slate-700">
              Subjects
              <select
                multiple
                value={selectedSubjects}
                onChange={(e) =>
                  setSelectedSubjects(Array.from(e.target.selectedOptions).map((o) => o.value))
                }
                className="mt-1 h-32 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {branchSubjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={approve}
            disabled={!canApprove}
            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
