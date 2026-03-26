import { useEffect, useState } from 'react';
import {
  BookOpen,
  ChartColumnBig,
  ClipboardList,
  LogOut,
  Medal,
  Plus,
  ReceiptText,
} from 'lucide-react';
import {
  createFacultyProblem,
  createFacultyTest,
  getFacultyLeaderboard,
  getFacultyPerformance,
  getFacultySubmissions,
  getFacultySubjects,
  getFacultyTests,
} from '../../api/faculty.api';
import { useLogout } from '../../hooks/useLogout';

const tabs = [
  { id: 'subjects', label: 'Subjects', icon: BookOpen },
  { id: 'problems', label: 'Problem Bank', icon: Plus },
  { id: 'tests', label: 'Tests', icon: ClipboardList },
  { id: 'submissions', label: 'Submissions', icon: ReceiptText },
  { id: 'performance', label: 'Performance', icon: ChartColumnBig },
  { id: 'leaderboard', label: 'Leaderboard', icon: Medal },
];

const panel = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm';

export default function Home() {
  const handleLogout = useLogout();
  const [activeTab, setActiveTab] = useState('subjects');
  const [subjects, setSubjects] = useState([]);
  const [tests, setTests] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');

  const [problemForm, setProblemForm] = useState({
    title: '',
    slug: '',
    description: '',
    difficulty: 'EASY',
    inputFormat: 'Standard input',
    outputFormat: 'Standard output',
    testCases: [{ input: '1\n', output: '1\n', isSample: true }],
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

  const load = async () => {
    setError('');
    try {
      const [subjectsRes, testsRes, submissionsRes, performanceRes, leaderboardRes] =
        await Promise.all([
          getFacultySubjects(),
          getFacultyTests(),
          getFacultySubmissions(),
          getFacultyPerformance(),
          getFacultyLeaderboard(),
        ]);

      setSubjects(subjectsRes.data || []);
      setTests(testsRes.data || []);
      setSubmissions(submissionsRes.data || []);
      setPerformance(performanceRes.data || []);
      setLeaderboard(leaderboardRes.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load faculty dashboard');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreateProblem = async (e) => {
    e.preventDefault();
    await createFacultyProblem(problemForm);
    setProblemForm({
      title: '',
      slug: '',
      description: '',
      difficulty: 'EASY',
      inputFormat: 'Standard input',
      outputFormat: 'Standard output',
      testCases: [{ input: '1\n', output: '1\n', isSample: true }],
    });
    await load();
  };

  const onCreateTest = async (e) => {
    e.preventDefault();
    await createFacultyTest({
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
    await load();
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 lg:px-8">
      <div className="mx-auto flex max-w-[1320px] gap-6">
        <aside className="sticky top-4 h-fit w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Faculty Panel
          </p>
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    active
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </aside>

        <main className="flex-1 space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {activeTab === 'subjects' && (
            <section className={panel}>
              <h2 className="mb-3 text-base font-bold">Assigned Subjects</h2>
              <div className="space-y-2">
                {subjects.map((subject) => (
                  <div
                    key={subject._id}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    {subject.name} ({subject.code})
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'problems' && (
            <section className={panel}>
              <h2 className="mb-3 text-base font-bold">Create Coding Problem</h2>
              <form className="grid grid-cols-1 gap-2 md:grid-cols-2" onSubmit={onCreateProblem}>
                <input
                  value={problemForm.title}
                  onChange={(e) =>
                    setProblemForm((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="Problem title"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  value={problemForm.slug}
                  onChange={(e) =>
                    setProblemForm((p) => ({ ...p, slug: e.target.value }))
                  }
                  placeholder="Slug"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <select
                  value={problemForm.difficulty}
                  onChange={(e) =>
                    setProblemForm((p) => ({ ...p, difficulty: e.target.value }))
                  }
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
                <input
                  value={problemForm.inputFormat}
                  onChange={(e) =>
                    setProblemForm((p) => ({ ...p, inputFormat: e.target.value }))
                  }
                  placeholder="Input format"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <textarea
                  value={problemForm.description}
                  onChange={(e) =>
                    setProblemForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Problem statement"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2"
                  rows={5}
                />
                <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white md:col-span-2">
                  Create Problem
                </button>
              </form>
            </section>
          )}

          {activeTab === 'tests' && (
            <section className={panel}>
              <h2 className="mb-3 text-base font-bold">Create and Manage Tests</h2>
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
                  <option value="">Select subject</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <input
                  value={testForm.branchId}
                  onChange={(e) =>
                    setTestForm((p) => ({ ...p, branchId: e.target.value }))
                  }
                  placeholder="Branch ID"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  value={testForm.batchId}
                  onChange={(e) =>
                    setTestForm((p) => ({ ...p, batchId: e.target.value }))
                  }
                  placeholder="Batch ID"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  value={testForm.sectionIds}
                  onChange={(e) =>
                    setTestForm((p) => ({ ...p, sectionIds: e.target.value }))
                  }
                  placeholder="Section IDs comma separated"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  value={testForm.problemIds}
                  onChange={(e) =>
                    setTestForm((p) => ({ ...p, problemIds: e.target.value }))
                  }
                  placeholder="Problem IDs comma separated"
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
                <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white md:col-span-2">
                  Create Test
                </button>
              </form>

              <div className="mt-4 space-y-2">
                {tests.map((test) => (
                  <div
                    key={test._id}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    {test.title}
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'submissions' && (
            <section className={panel}>
              <h2 className="mb-3 text-base font-bold">Recent Submissions</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2">Student</th>
                      <th>Problem</th>
                      <th>Status</th>
                      <th>Language</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((row) => (
                      <tr key={row._id} className="border-b border-slate-100">
                        <td className="py-2">{row.studentId?.name || 'N/A'}</td>
                        <td>{row.problemId?.title || 'N/A'}</td>
                        <td>{row.status}</td>
                        <td>{row.language}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'performance' && (
            <section className={panel}>
              <h2 className="mb-3 text-base font-bold">Student Performance</h2>
              <div className="space-y-2">
                {performance.map((row) => (
                  <div
                    key={row.student._id}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    {row.student.name} • Avg Score: {row.avgTestScore} • Success:{' '}
                    {row.successRate}%
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'leaderboard' && (
            <section className={panel}>
              <h2 className="mb-3 text-base font-bold">Leaderboard</h2>
              <div className="space-y-2">
                {leaderboard.map((row, idx) => (
                  <div
                    key={row.studentId}
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    <span>
                      #{idx + 1} {row.name}
                    </span>
                    <span className="font-semibold">{row.totalScore}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
