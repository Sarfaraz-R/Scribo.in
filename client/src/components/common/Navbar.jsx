import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LogIn, Menu, X } from 'lucide-react';
import RollingText from '../common/RollingText';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: 'Features', path: '/#features' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'For Students', path: '/#how-it-works' },
    { name: 'For Faculty', path: '/#how-it-works' },
    { name: 'Pricing', path: '/#pricing' },
  ];

  return (
    <>
      {/* Ensure the Google Font Import is present */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;700;800&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      <motion.nav
        initial={{ y: -15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ fontFamily: "'DM Sans', sans-serif" }} // Base font for the nav
        className="fixed top-3 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-transparent"
      >
        {/* LEFT: Logo Section */}
        <div className="flex-1 flex justify-start items-center gap-3 text-white">
          <Link to="/" className="flex items-center gap-2">
            <span
              style={{ fontFamily: "'Syne', sans-serif" }}
              className="text-xl font-bold tracking-tighter"
            >
              Scribo
            </span>
            <span className="text-[11px] text-gray-500 mt-1 hidden lg:block italic font-light">
              Every line counts.
            </span>
          </Link>
        </div>

        {/* CENTER: Floating Menu */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8 px-8 py-2.5 rounded-xl bg-[#ffffff17] backdrop-blur-md border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)] text-sm font-medium">
          {menuItems.map((item) =>
            item.path.includes('#') ? (
              <a
                key={item.name}
                href={item.path}
                className="text-white transition whitespace-nowrap hover:text-white/70"
              >
                <RollingText>{item.name}</RollingText>
              </a>
            ) : (
              <Link
                key={item.name}
                to={item.path}
                className="text-white transition whitespace-nowrap hover:text-white/70"
              >
                <RollingText>{item.name}</RollingText>
              </Link>
            )
          )}
        </div>

        {/* RIGHT: Sign In */}
        <div className="flex-1 flex justify-end items-center gap-6">
          <div className="hidden md:flex">
            <Link
              to="auth/signin"
              className="flex items-center gap-1.5 text-white text-sm font-semibold transition"
            >
              <LogIn size={16} />
              <RollingText>Sign In</RollingText>
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="fixed top-[75px] left-4 right-4 z-40 bg-black/80 backdrop-blur-xl rounded-2xl flex flex-col items-center gap-6 py-10 md:hidden shadow-[0_0_30px_rgba(0,0,0,0.6)] border border-white/10"
          >
            {menuItems.map((item) =>
              item.path.includes('#') ? (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={() => setOpen(false)}
                  className="text-white text-xl font-bold tracking-tight hover:opacity-60 transition"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className="text-white text-xl font-bold tracking-tight hover:opacity-60 transition"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {item.name}
                </Link>
              )
            )}

            <Link
              to="/auth/signin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-white font-bold mt-4 bg-white/10 px-8 py-3 rounded-full hover:bg-white/20 transition"
            >
              <LogIn size={18} />
              Sign In
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
