import { useState, useEffect } from 'react'; // FIXED: Added useEffect import
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Search,
  Zap,
  CheckCircle2,
  Clock,
  Lock,
} from 'lucide-react';
import Sidebar from '../../../components/common/Sidebar';
import { useNavigate } from 'react-router-dom';
import { getProblems } from '../../../api/problem.api';

const statusConfig = {
  Solved: {
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  Tried: {
    icon: Clock,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  Todo: {
    icon: Lock,
    color: 'text-white/20',
    bg: 'bg-white/5 border-white/10',
  },
};

const difficultyColor = { Easy: '#22c55e', Medium: '#eab308', Hard: '#ef4444' };

export function PracticePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDifficulty, setShowDifficulty] = useState(true);
  const [showTags, setShowTags] = useState(true);
  const [showCompany, setShowCompany] = useState(true);
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({ solved: 0, tried: 0, total: 0 });

  const toggles = [
    { label: 'Difficulty', state: showDifficulty, setter: setShowDifficulty },
    { label: 'Tags', state: showTags, setter: setShowTags },
    { label: 'Company', state: showCompany, setter: setShowCompany },
  ];

  // 1. DEBOUNCE LOGIC
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 2. FETCH FROM BACKEND
  useEffect(() => {
    const fetchFromDB = async () => {
      setLoading(true);
      try {
        const apiRes = await getProblems(debouncedSearch, currentPage);
        // getProblems returns axios.data (ApiResponse object)
        console.log('[PracticePage] raw response', apiRes);

        // safe destructure: data might be undefined if shape changed
        const {
          problems: fetched = [],
          pagination = {},
        } = apiRes.data || {};

        setProblems(fetched);

        // update pagination/total count for the stats row
        setStats((prev) => ({
          ...prev,
          total: pagination.totalMatching || prev.total,
        }));
      } catch (err) {
        // log full error payload for easier debugging
        console.error('Fetch error:', err.response?.data || err.message || err);
      } finally {
        setLoading(false);
      }
    };
    fetchFromDB();
  }, [currentPage, debouncedSearch]);

  return (
    <div className="flex bg-[#020202] min-h-screen">
      <Sidebar />

      <main
        className="flex-1 lg:ml-64 min-h-screen text-white font-['DM_Sans'] pb-24 overflow-x-hidden"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
          .syne { font-family: 'Syne', sans-serif; letter-spacing: -0.04em; }
          .glow-orange { box-shadow: 0 0 40px rgba(249,115,22,0.12); }
          .row-hover:hover { background: rgba(249,115,22,0.03); }
          .row-hover:hover td:nth-child(2) { color: #f97316; }
          ::-webkit-scrollbar { height: 4px; background: transparent; }
          ::-webkit-scrollbar-thumb { background: rgba(249,115,22,0.3); border-radius: 4px; }
        `}</style>

        {/* ─── HERO ─── */}
        <section className="pt-14 lg:pt-16 pb-10 px-6 md:px-10 relative mt-10 md:mt-0">
          <div className="absolute top-0 left-1/4 w-96 h-64 bg-orange-500/5 blur-[100px] pointer-events-none" />

          {/* Stat Pills */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-5"
          >
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {stats.solved} Solved
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {stats.tried} Attempted
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/30 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              {stats.total} Total
            </span>
          </motion.div>

          <motion.h1 className="syne text-4xl md:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.05] mb-3">
            READY TO OUTCODE <br />
            <span className="text-[#f97316]">THE COMPETITION?</span>
          </motion.h1>

          <div className="flex flex-col lg:flex-row gap-3 max-w-4xl mt-8">
            {/* Search */}
            <div className="relative flex-1 group">
              <div className="relative flex items-center gap-3 bg-white/[0.04] border border-white/10 group-focus-within:border-orange-500/40 rounded-xl px-4 py-3 backdrop-blur-md">
                <Search
                  size={15}
                  className="text-white/20 group-focus-within:text-orange-500"
                />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent w-full focus:outline-none text-sm placeholder:text-white/20"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-1.5 bg-black/50 p-1.5 rounded-xl border border-white/8 backdrop-blur-xl overflow-x-auto">
              {toggles.map(({ label, state, setter }) => (
                <button
                  key={label}
                  onClick={() => setter(!state)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                    state
                      ? 'bg-orange-500/15 border border-orange-500/30 text-white'
                      : 'text-white/25 border border-transparent'
                  }`}
                >
                  {state ? (
                    <Eye size={12} className="text-orange-400" />
                  ) : (
                    <EyeOff size={12} className="opacity-40" />
                  )}
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TABLE ─── */}
        <section className="px-6 md:px-10">
          <motion.div className="border border-white/8 rounded-2xl bg-black/40 backdrop-blur-sm overflow-hidden glow-orange">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[580px]">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.02]">
                    <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-white/25 w-14">
                      #
                    </th>
                    <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
                      Problem
                    </th>
                    {showDifficulty && (
                      <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
                        Level
                      </th>
                    )}
                    {showTags && (
                      <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
                        Tags
                      </th>
                    )}
                    {showCompany && (
                      <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
                        Company
                      </th>
                    )}
                    <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-white/25 text-right">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-16 text-center text-orange-500/40 animate-pulse"
                        >
                          Loading challenges...
                        </td>
                      </tr>
                    ) : problems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-16 text-center text-white/20"
                        >
                          No results found.
                        </td>
                      </tr>
                    ) : (
                      problems.map((prob, i) => {
                        const cfg =
                          statusConfig[prob.status] || statusConfig['Todo'];
                        const StatusIcon = cfg.icon;
                        return (
                          <motion.tr
                            key={prob._id || prob.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="border-b border-white/5 row-hover cursor-pointer group"
                            onClick={() =>
                              navigate(
                                `/student/practice/${prob.slug || prob.title}`
                              )
                            }
                          >
                            <td className="px-6 py-4 text-white/15 text-xs font-mono">
                              {String(i + 1 + (currentPage - 1) * 10).padStart(
                                2,
                                '0'
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium group-hover:text-orange-500 transition-colors">
                              {prob.title || prob.name}
                            </td>
                            {showDifficulty && (
                              <td className="px-6 py-4">
                                <span
                                  className="text-[10px] font-bold uppercase px-2 py-1 rounded"
                                  style={{
                                    color: difficultyColor[prob.difficulty],
                                    background:
                                      difficultyColor[prob.difficulty] + '15',
                                  }}
                                >
                                  {prob.difficulty}
                                </span>
                              </td>
                            )}
                            {showTags && (
                              <td className="px-6 py-4">
                                <div className="flex gap-1 flex-wrap">
                                  {prob.tags?.map((t) => (
                                    <span
                                      key={t}
                                      className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-white/30"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            )}
                            {showCompany && (
                              <td className="px-6 py-4 text-xs text-white/30">
                                {prob.company?.length
                                  ? prob.company.join(', ')
                                  : 'N/A'}
                              </td>
                            )}
                            <td className="px-6 py-4 text-right">
                              <span
                                className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase px-2 py-1 rounded-lg ${cfg.bg} ${cfg.color}`}
                              >
                                <StatusIcon size={10} /> {prob.status}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
              <p className="text-[10px] uppercase text-white/20">
                Showing {problems.length} of {stats.total}
              </p>
              <div className="flex gap-4 items-center">
                <button
                  disabled={currentPage === 1 || loading}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="text-[10px] text-white/25 hover:text-orange-400 disabled:opacity-10"
                >
                  ← Prev
                </button>
                <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full">
                  PAGE {currentPage}
                </span>
                <button
                  disabled={problems.length < 10 || loading}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="text-[10px] text-white/25 hover:text-orange-400 disabled:opacity-10"
                >
                  Next →
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
