import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Priya S.',
      role: 'CSE Student',
      quote:
        "Finally got marks for my logic even when my syntax had a small bug. That's genuinely fair.",
      initials: 'PS',
      color: 'from-orange-500 to-orange-400',
    },
    {
      name: 'Dr. Ramesh K.',
      role: 'Professor',
      quote:
        'Scribo cut my grading time from 3 hours to under 5 minutes. The accuracy is better than manual too.',
      initials: 'RK',
      color: 'from-teal-500 to-teal-400',
    },
    {
      name: 'Prof. Anita M.',
      role: 'HOD',
      quote:
        "The analytics dashboard shows exactly which students are struggling. I can act before it's too late.",
      initials: 'AM',
      color: 'from-blue-500 to-blue-400',
    },
    {
      name: 'Arjun T.',
      role: 'CS Student',
      quote:
        'The code editor feels professional. Practicing here actually prepared me for my placement tests.',
      initials: 'AT',
      color: 'from-purple-500 to-purple-400',
    },
    {
      name: 'Sneha R.',
      role: 'Lab Instructor',
      quote:
        'Running a lab exam used to be chaotic. Now I assign, monitor, and get grades — all in one place.',
      initials: 'SR',
      color: 'from-indigo-500 to-indigo-400',
    },
    {
      name: 'Rahul V.',
      role: 'Final Year Student',
      quote:
        'The feedback report told me exactly what went wrong. No other platform does that.',
      initials: 'RV',
      color: 'from-pink-500 to-pink-400',
    },
  ];

  // Duplicating for seamless infinite scroll
  const firstRow = [...testimonials, ...testimonials];
  const secondRow = [...testimonials, ...testimonials].reverse();

  const maskStyles = {
    WebkitMaskImage:
      'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
    maskImage:
      'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
  };

  return (
    <section className="relative w-full bg-[#020202] py-24 overflow-hidden dot-grid">
      <style>{`
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right 30s linear infinite;
        }
      `}</style>

      {/* Brand Background Glow */}
      <div className="glow-main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] z-0 pointer-events-none opacity-20" />

      <div className="relative z-10">
        <div className="text-center mb-16 px-6">
          <h2
            className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            What They're Saying
          </h2>
          <p
            className="text-gray-500 text-sm md:text-base font-medium"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Loved by students and faculty across campuses
          </p>
        </div>

        {/* --- Top Row: Scroll Left --- */}
        <div className="overflow-hidden mb-8" style={maskStyles}>
          <div className="flex gap-6 animate-scroll-left w-max">
            {firstRow.map((t, i) => (
              <TestimonialCard key={i} data={t} />
            ))}
          </div>
        </div>

        {/* --- Bottom Row: Scroll Right --- */}
        <div className="overflow-hidden" style={maskStyles}>
          <div className="flex gap-6 animate-scroll-right w-max">
            {secondRow.map((t, i) => (
              <TestimonialCard key={i} data={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ data }) => (
  <div className="w-[320px] bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-6 flex flex-col justify-between shrink-0">
    <div className="flex items-center gap-4 mb-4">
      <div
        className={`w-10 h-10 rounded-full bg-gradient-to-br ${data.color} flex items-center justify-center text-white font-black text-sm`}
      >
        {data.initials}
      </div>
      <div className="flex flex-col">
        <span
          className="text-white font-bold text-sm"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {data.name}
        </span>
        <span
          className="text-gray-500 text-[11px] font-medium"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {data.role}
        </span>
      </div>
    </div>

    <div className="text-amber-500 text-sm mb-4">★★★★★</div>

    <p
      className="text-gray-400 text-sm leading-relaxed"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      "{data.quote}"
    </p>
  </div>
);

export default Testimonials;
