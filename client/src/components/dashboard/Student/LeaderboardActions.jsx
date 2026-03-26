import { motion } from 'framer-motion';

const students = [
  {
    rank: 1,
    name: 'Priya S.',
    initials: 'PS',
    score: 94,
    bg: 'from-pink-900 to-black',
  },
  {
    rank: 2,
    name: 'Rahul M.',
    initials: 'RM',
    score: 89,
    bg: 'from-blue-900 to-black',
  },
  {
    rank: 3,
    name: 'Sneha K.',
    initials: 'SK',
    score: 85,
    bg: 'from-purple-900 to-black',
  },
  {
    rank: 4,
    name: 'Arjun S.',
    initials: 'AS',
    score: 74,
    bg: 'from-orange-900 to-black',
    isYou: true,
  },
  {
    rank: 5,
    name: 'Dev R.',
    initials: 'DR',
    score: 71,
    bg: 'from-green-900 to-black',
  },
];

const rankColor = (rank) => {
  if (rank === 1) return 'text-amber-400';
  if (rank === 2) return 'text-gray-400';
  if (rank === 3) return 'text-orange-600';
  return 'text-[#3a4a5a]';
};

const scoreChip = (rank, isYou) => {
  if (isYou) return 'bg-[#f97316]/10 text-[#f97316]';
  if (rank === 1) return 'bg-amber-500/10 text-amber-400';
  if (rank === 2) return 'bg-gray-500/10 text-gray-400';
  if (rank === 3) return 'bg-orange-600/10 text-orange-600';
  return 'bg-[#1e2d3d] text-[#3a4a5a]';
};

const LeaderboardActions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 font-['DM_Sans']"
    >
      {/* LEADERBOARD — col-span-2 */}
      <div className="md:col-span-2 bg-[#0b0f16] border border-[#1e2d3d] rounded-2xl p-5">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-white font-bold font-['Syne'] text-sm uppercase tracking-widest">
            Class Leaderboard
          </h3>
          <button className="text-[#f97316] text-xs font-bold hover:underline">
            Full Board →
          </button>
        </div>

        {/* Rows */}
        <div className="mt-4 space-y-1">
          {students.map((s) => (
            <div
              key={s.rank}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                ${
                  s.isYou
                    ? 'bg-[#f97316]/[0.06] border border-[#f97316]/20'
                    : 'hover:bg-[#111820] border border-transparent'
                }`}
            >
              {/* Rank */}
              <span
                className={`w-5 text-[11px] font-black shrink-0 ${rankColor(s.rank)}`}
              >
                #{s.rank}
              </span>

              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-full bg-gradient-to-br ${s.bg} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}
              >
                {s.initials}
              </div>

              {/* Name */}
              <span className="text-sm text-white font-medium flex-1">
                {s.name}{' '}
                {s.isYou && (
                  <span className="text-[#f97316] text-[10px] font-black ml-1">
                    (you)
                  </span>
                )}
                {s.rank === 1 && <span className="ml-1">🏆</span>}
              </span>

              {/* Score */}
              <span
                className={`text-xs font-black px-2 py-0.5 rounded-lg ${scoreChip(s.rank, s.isYou)}`}
              >
                {s.score}/100
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-[#1e2d3d]">
          <p className="text-[#3a4a5a] text-[10px] text-center font-bold uppercase tracking-widest">
            You're #4 out of 62 students
          </p>
        </div>
      </div>

      {/* QUICK ACTIONS — col-span-1 */}
      <div className="md:col-span-1 bg-[#0b0f16] border border-[#1e2d3d] rounded-2xl p-5 flex flex-col">
        {/* Header */}
        <h3 className="text-white font-bold font-['Syne'] text-sm uppercase tracking-widest">
          Quick Actions
        </h3>

        {/* Buttons */}
        <div className="mt-4 flex flex-col gap-3 flex-1">
          <button className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-[#f97316] text-white shadow-[0_0_20px_rgba(249,115,22,0.15)] hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:scale-[1.02] transition-all duration-200">
            ⚡ Join a Test
          </button>
          <button className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-teal-500/30 text-teal-400 hover:bg-teal-500/10 transition-all duration-200">
            {'{ }'} Start Practice
          </button>
          <button className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-[#1e2d3d] text-[#3a4a5a] hover:border-[#2a3a4a] hover:text-white transition-all duration-200">
            📊 View Analytics
          </button>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-[#1e2d3d]">
          <p className="text-[#3a4a5a] text-[10px] text-center font-bold uppercase tracking-widest">
            Last active: 2 hours ago
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LeaderboardActions;
