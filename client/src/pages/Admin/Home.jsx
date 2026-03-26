import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Building2,
  LogOut,
  GraduationCap,
  Layers,
  Library,
  ScrollText,
  Users,
  UserSquare2,
  BookOpen,
  ClipboardCheck,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  createBatch,
  createBranch,
  createFaculty,
  createSection,
  createSubject,
  createTest,
  getAdminAnalytics,
  getBatches,
  getBranches,
  getFaculty,
  getSections,
  getStudents,
  getSubjects,
  getTests,
} from '../../api/admin.api';
import { useLogout } from '../../hooks/useLogout';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'branches', label: 'Branches', icon: Building2 },
  { id: 'batches', label: 'Batches', icon: Layers },
  { id: 'sections', label: 'Sections', icon: Library },
  { id: 'students', label: 'Students', icon: GraduationCap },
  { id: 'faculty', label: 'Faculty', icon: UserSquare2 },
  { id: 'subjects', label: 'Subjects', icon: BookOpen },
  { id: 'tests', label: 'Tests', icon: ClipboardCheck },
  { id: 'analytics', label: 'Analytics', icon: ScrollText },
];

const PANEL = 'rounded-2xl border border-slate-200 bg-white shadow-sm';

export default function Home() {
  const handleLogout = useLogout();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [branches, setBranches] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [tests, setTests] = useState([]);
  const [error, setError] = useState('');

  const [branchForm, setBranchForm] = useState({ name: '' });
  const [batchForm, setBatchForm] = useState({
    branchId: '',
    startYear: '',
    endYear: '',
  });
  const [sectionForm, setSectionForm] = useState({ name: '', batchId: '' });
  const [facultyForm, setFacultyForm] = useState({ name: '', email: '' });
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    branchId: '',
    batchId: '',
    facultyId: '',
  });
  const [testForm, setTestForm] = useState({
    title: '',
    subjectId: '',
    branchId: '',
    batchId: '',
    sectionIds: '',
    problemIds: '',
    startTime: '',
    endTime: '',
    duration: 60,
  });

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [
        analyticsRes,
        branchesRes,
        batchesRes,
        sectionsRes,
        studentsRes,
        facultyRes,
        subjectsRes,
        testsRes,
      ] = await Promise.all([
        getAdminAnalytics(),
        getBranches(),
        getBatches(),
        getSections(),
        getStudents(),
        getFaculty(),
        getSubjects(),
        getTests(),
      ]);

      setAnalytics(analyticsRes.data);
      setBranches(branchesRes.data || []);
      setBatches(batchesRes.data || []);
      setSections(sectionsRes.data || []);
      setStudents(studentsRes.data || []);
      setFaculty(facultyRes.data || []);
      setSubjects(subjectsRes.data || []);
      setTests(testsRes.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Unable to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const overview = analytics?.overview;

  const quickStats = useMemo(() => {
    if (!overview) return [];
    return [
      { label: 'Students', value: overview.students, icon: Users },
      { label: 'Faculty', value: overview.faculty, icon: UserSquare2 },
      { label: 'Problems', value: overview.problems, icon: BookOpen },
      { label: 'Tests', value: overview.tests, icon: ClipboardCheck },
    ];
  }, [overview]);

  const onCreateBranch = async (e) => {
    e.preventDefault();
    await createBranch(branchForm);
    setBranchForm({ name: '' });
    await loadData();
  };

  const onCreateBatch = async (e) => {
    e.preventDefault();
    await createBatch({
      ...batchForm,
      startYear: Number(batchForm.startYear),
      endYear: Number(batchForm.endYear),
    });
    setBatchForm({ branchId: '', startYear: '', endYear: '' });
    await loadData();
  };

  const onCreateSection = async (e) => {
    e.preventDefault();
    await createSection(sectionForm);
    setSectionForm({ name: '', batchId: '' });
    await loadData();
  };

  const onCreateFaculty = async (e) => {
    e.preventDefault();
    await createFaculty(facultyForm);
    setFacultyForm({ name: '', email: '' });
    await loadData();
  };

  const onCreateSubject = async (e) => {
    e.preventDefault();
    await createSubject({
      ...subjectForm,
      facultyId: subjectForm.facultyId || null,
    });
    setSubjectForm({
      name: '',
      code: '',
      branchId: '',
      batchId: '',
      facultyId: '',
    });
    await loadData();
  };

  const onCreateTest = async (e) => {
    e.preventDefault();
    await createTest({
      ...testForm,
      sectionIds: testForm.sectionIds
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
      problemIds: testForm.problemIds
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
      duration: Number(testForm.duration),
    });
    setTestForm({
      title: '',
      subjectId: '',
      branchId: '',
      batchId: '',
      sectionIds: '',
      problemIds: '',
      startTime: '',
      endTime: '',
      duration: 60,
    });
    await loadData();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-[1400px] gap-6 px-4 py-6 lg:px-8">
        <aside className="sticky top-4 h-fit w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="mb-3 px-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Admin Console
            </p>
            <h1 className="text-lg font-black text-slate-900">Scribo</h1>
          </div>
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    active
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={15} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </aside>

        <main className="flex-1 space-y-4">
          <div className="flex justify-end gap-2">
            <Link
              to="/admin/pending-users"
              className="inline-flex items-center gap-2 rounded-xl border border-orange-300 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
            >
              Pending Requests
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className={`${PANEL} p-6 text-sm text-slate-500`}>
              Loading admin modules...
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="space-y-4">
                  <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {quickStats.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className={`${PANEL} p-4`}>
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                              {item.label}
                            </p>
                            <Icon size={16} className="text-orange-500" />
                          </div>
                          <p className="text-3xl font-black text-slate-900">
                            {item.value || 0}
                          </p>
                        </div>
                      );
                    })}
                  </section>
                  <section className={`${PANEL} p-5`}>
                    <h2 className="text-base font-bold">Platform Health</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Problem success rate: {overview?.problemSuccessRate || 0}%
                    </p>
                  </section>
                </div>
              )}

              {activeTab === 'branches' && (
                <section className={`${PANEL} p-5`}>
                  <h2 className="mb-4 text-base font-bold">Create Branch</h2>
                  <form className="mb-4 flex gap-2" onSubmit={onCreateBranch}>
                    <input
                      value={branchForm.name}
                      onChange={(e) =>
                        setBranchForm({ name: e.target.value.toUpperCase() })
                      }
                      placeholder="Branch name (CSE)"
                      className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
                      <Plus size={14} className="inline" /> Create
                    </button>
                  </form>
                  <div className="space-y-2">
                    {branches.map((b) => (
                      <div
                        key={b._id}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      >
                        {b.name}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeTab === 'batches' && (
                <section className={`${PANEL} p-5`}>
                  <h2 className="mb-4 text-base font-bold">Create Batch</h2>
                  <form className="grid grid-cols-1 gap-2 md:grid-cols-4" onSubmit={onCreateBatch}>
                    <select
                      value={batchForm.branchId}
                      onChange={(e) =>
                        setBatchForm((p) => ({ ...p, branchId: e.target.value }))
                      }
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    >
                      <option value="">Select Branch</option>
                      {branches.map((b) => (
                        <option key={b._id} value={b._id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={batchForm.startYear}
                      onChange={(e) =>
                        setBatchForm((p) => ({ ...p, startYear: e.target.value }))
                      }
                      placeholder="Start Year"
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <input
                      type="number"
                      value={batchForm.endYear}
                      onChange={(e) =>
                        setBatchForm((p) => ({ ...p, endYear: e.target.value }))
                      }
                      placeholder="End Year"
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
                      Create
                    </button>
                  </form>
                  <div className="mt-4 space-y-2 text-sm">
                    {batches.map((b) => (
                      <div key={b._id} className="rounded-lg border border-slate-200 px-3 py-2">
                        {b.startYear}-{b.endYear}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeTab === 'sections' && (
                <section className={`${PANEL} p-5`}>
                  <h2 className="mb-4 text-base font-bold">Create Section</h2>
                  <form className="grid grid-cols-1 gap-2 md:grid-cols-3" onSubmit={onCreateSection}>
                    <input
                      value={sectionForm.name}
                      onChange={(e) =>
                        setSectionForm((p) => ({ ...p, name: e.target.value.toUpperCase() }))
                      }
                      placeholder="Section (A)"
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <select
                      value={sectionForm.batchId}
                      onChange={(e) =>
                        setSectionForm((p) => ({ ...p, batchId: e.target.value }))
                      }
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    >
                      <option value="">Select Batch</option>
                      {batches.map((b) => (
                        <option key={b._id} value={b._id}>
                          {b.startYear}-{b.endYear}
                        </option>
                      ))}
                    </select>
                    <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
                      Create
                    </button>
                  </form>
                  <div className="mt-4 space-y-2 text-sm">
                    {sections.map((s) => (
                      <div key={s._id} className="rounded-lg border border-slate-200 px-3 py-2">
                        {s.name}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeTab === 'students' && (
                <section className={`${PANEL} p-5`}>
                  <h2 className="mb-4 text-base font-bold">Students</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
                          <th className="py-2">Name</th>
                          <th>Email</th>
                          <th>Roll Number</th>
                          <th>Streak</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((s) => (
                          <tr key={s._id} className="border-b border-slate-100">
                            <td className="py-2">{s.name}</td>
                            <td>{s.email}</td>
                            <td>{s.rollNumber}</td>
                            <td>{s.streak || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {activeTab === 'faculty' && (
                <section className={`${PANEL} p-5`}>
                  <h2 className="mb-4 text-base font-bold">Faculty</h2>
                  <form className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-3" onSubmit={onCreateFaculty}>
                    <input
                      value={facultyForm.name}
                      onChange={(e) =>
                        setFacultyForm((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="Faculty name"
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <input
                      value={facultyForm.email}
                      onChange={(e) =>
                        setFacultyForm((p) => ({ ...p, email: e.target.value }))
                      }
                      placeholder="Faculty email"
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
                      Add Faculty
                    </button>
                  </form>
                  <div className="space-y-2 text-sm">
                    {faculty.map((f) => (
                      <div key={f._id} className="rounded-lg border border-slate-200 px-3 py-2">
                        {f.name} • {f.email}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeTab === 'subjects' && (
                <section className={`${PANEL} p-5`}>
                  <h2 className="mb-4 text-base font-bold">Subjects</h2>
                  <form className="grid grid-cols-1 gap-2 md:grid-cols-3" onSubmit={onCreateSubject}>
                    <input
                      value={subjectForm.name}
                      onChange={(e) =>
                        setSubjectForm((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="Subject name"
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <input
                      value={subjectForm.code}
                      onChange={(e) =>
                        setSubjectForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))
                      }
                      placeholder="Code"
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <select
                      value={subjectForm.branchId}
                      onChange={(e) =>
                        setSubjectForm((p) => ({ ...p, branchId: e.target.value }))
                      }
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    >
                      <option value="">Select Branch</option>
                      {branches.map((b) => (
                        <option key={b._id} value={b._id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={subjectForm.batchId}
                      onChange={(e) =>
                        setSubjectForm((p) => ({ ...p, batchId: e.target.value }))
                      }
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    >
                      <option value="">Select Batch</option>
                      {batches.map((b) => (
                        <option key={b._id} value={b._id}>
                          {b.startYear}-{b.endYear}
                        </option>
                      ))}
                    </select>
                    <select
                      value={subjectForm.facultyId}
                      onChange={(e) =>
                        setSubjectForm((p) => ({ ...p, facultyId: e.target.value }))
                      }
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    >
                      <option value="">Assign Faculty</option>
                      {faculty.map((f) => (
                        <option key={f._id} value={f._id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                    <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white md:col-span-3">
                      Create Subject
                    </button>
                  </form>
                  <div className="mt-4 space-y-2 text-sm">
                    {subjects.map((s) => (
                      <div key={s._id} className="rounded-lg border border-slate-200 px-3 py-2">
                        {s.name} ({s.code})
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeTab === 'tests' && (
                <section className={`${PANEL} p-5`}>
                  <h2 className="mb-4 text-base font-bold">Create Test</h2>
                  <form className="grid grid-cols-1 gap-2 md:grid-cols-2" onSubmit={onCreateTest}>
                    <input
                      value={testForm.title}
                      onChange={(e) =>
                        setTestForm((p) => ({ ...p, title: e.target.value }))
                      }
                      placeholder="Test title"
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <select
                      value={testForm.subjectId}
                      onChange={(e) =>
                        setTestForm((p) => ({ ...p, subjectId: e.target.value }))
                      }
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={testForm.branchId}
                      onChange={(e) =>
                        setTestForm((p) => ({ ...p, branchId: e.target.value }))
                      }
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    >
                      <option value="">Select Branch</option>
                      {branches.map((b) => (
                        <option key={b._id} value={b._id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={testForm.batchId}
                      onChange={(e) =>
                        setTestForm((p) => ({ ...p, batchId: e.target.value }))
                      }
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    >
                      <option value="">Select Batch</option>
                      {batches.map((b) => (
                        <option key={b._id} value={b._id}>
                          {b.startYear}-{b.endYear}
                        </option>
                      ))}
                    </select>
                    <input
                      value={testForm.sectionIds}
                      onChange={(e) =>
                        setTestForm((p) => ({ ...p, sectionIds: e.target.value }))
                      }
                      placeholder="Section IDs (comma separated)"
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <input
                      value={testForm.problemIds}
                      onChange={(e) =>
                        setTestForm((p) => ({ ...p, problemIds: e.target.value }))
                      }
                      placeholder="Problem IDs (comma separated)"
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <input
                      type="datetime-local"
                      value={testForm.startTime}
                      onChange={(e) =>
                        setTestForm((p) => ({ ...p, startTime: e.target.value }))
                      }
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <input
                      type="datetime-local"
                      value={testForm.endTime}
                      onChange={(e) =>
                        setTestForm((p) => ({ ...p, endTime: e.target.value }))
                      }
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <input
                      type="number"
                      value={testForm.duration}
                      onChange={(e) =>
                        setTestForm((p) => ({ ...p, duration: e.target.value }))
                      }
                      placeholder="Duration (min)"
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
                      Create Test
                    </button>
                  </form>
                  <div className="mt-4 space-y-2 text-sm">
                    {tests.map((t) => (
                      <div key={t._id} className="rounded-lg border border-slate-200 px-3 py-2">
                        {t.title}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeTab === 'analytics' && (
                <section className={`${PANEL} p-5`}>
                  <h2 className="mb-4 text-base font-bold">Difficulty Analytics</h2>
                  <div className="space-y-2 text-sm">
                    {(analytics?.performanceByDifficulty || []).map((row) => (
                      <div
                        key={row.difficulty}
                        className="rounded-lg border border-slate-200 px-3 py-2"
                      >
                        {row.difficulty}: {row.successRate}% success ({row.accepted}/
                        {row.total})
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
