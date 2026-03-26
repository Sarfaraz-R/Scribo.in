import React from 'react';
import Sidebar from '../../../components/common/Sidebar';
import Header from '../../../components/dashboard/Student/Header';
import UpcomingTests from '../../../components/dashboard/Student/UpcomingTests';
import PerformanceSection from '../../../components/dashboard/Student/PerformanceSection';
import NextChallenge from '../../../components/dashboard/Student/NextChallenge';
import LeaderboardActions from '../../../components/dashboard/Student/LeaderboardActions';
import Footer from '../../../components/Landing/Footer';
import api from '../../../api/api';
import InsertProblem from '../../../components/dashboard/Student/InsertProblem';
const Home = () => {
  return (
    <div className="flex min-h-screen bg-[#020202] relative font-['DM_Sans']">
      <style>{`
        .dot-grid {
          background-image: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .glow-main {
          background: radial-gradient(ellipse, rgba(249,115,22,0.15) 0%, transparent 70%);
        }
      `}</style>

      {/* Dot grid fixed behind everything */}
      <div className="dot-grid fixed inset-0 z-0 pointer-events-none" />

      {/* Sidebar */}
      <div
        className="z-20"
        style={{ boxShadow: '2px 0 60px rgba(249,115,22,0.08)' }}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-[240px] relative z-10 min-h-screen overflow-y-auto">
        <div className="p-6 space-y-6">
          <Header />
          
          //build insert a problem page where user pages json object of problem and hits sumit then probelms go to /api/problems/insert 
          <UpcomingTests />
          <PerformanceSection />
          <NextChallenge />
          <LeaderboardActions />
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default Home;
