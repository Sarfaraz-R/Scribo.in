import React from 'react';
import { Github, Linkedin, Twitter, Heart, Instagram } from 'lucide-react';

const Footer = () => {
  const sections = [
    {
      title: 'Product',
      links: ['Features', 'How It Works', 'Pricing', 'Changelog', 'Roadmap'],
    },
    {
      title: 'Company',
      links: ['About', 'Blog', 'Careers', 'Press', 'Contact'],
    },
    {
      title: 'Legal',
      links: [
        'Privacy Policy',
        'Terms of Service',
        'Cookie Policy',
        'Licenses',
      ],
    },
    {
      title: 'Support',
      links: ['Documentation', 'FAQ', 'Community', 'Report a Bug', 'Status'],
    },
  ];

  return (
    <footer className="relative w-full bg-[#020202] border-t  pt-20 pb-8 px-6 md:px-20 overflow-hidden dot-grid">
      {/* Subtle Background Glow to match Hero */}
      <div className="glow-main absolute bottom-0 left-0 w-[500px] h-[300px] z-0 pointer-events-none opacity-10 translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 flex flex-col gap-6">
            <div>
              <h2 className="text-white text-2xl font-bold tracking-tighter font-['Syne']">
                Scribo
              </h2>
              <p className="text-gray-500 text-xs font-bold tracking-[0.2em] mt-1 uppercase">
                Every Line counts.
              </p>
            </div>

            <p className="text-[#8899aa] text-sm leading-relaxed max-w-xs font-['DM_Sans']">
              The smartest coding assessment platform built for colleges.
              Empowering faculty and rewarding logic.
            </p>

            <div className="flex gap-3">
              {[
                {
                  icon: <Github size={18} />,
                  href: 'https://github.com/Sarfaraz-R',
                },
                {
                  icon: <Linkedin size={18} />,
                  href: 'https://www.linkedin.com/in/sarfaraz-r',
                },
                {
                  icon: <Instagram size={18} />,
                  href: 'https://www.instagram.com/sarfrazz.__',
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#0d1117] border border-[#1e2d3d] flex items-center justify-center text-gray-400 transition-all hover:text-white hover:border-[#f97316] hover:shadow-[0_0_15px_rgba(249,115,22,0.2)]"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {sections.map((section, idx) => (
            <div key={idx} className="col-span-1 md:col-span-2">
              <h4 className="text-[#f97316] text-[10px] font-black uppercase tracking-[0.3em] mb-6 font-mono">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={`#${link.toLowerCase().replace(/ /g, '-')}`}
                      className="text-gray-400 text-sm font-medium transition-colors hover:text-white font-['DM_Sans']"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#1e2d3d] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-[10px] md:text-xs font-['DM_Sans'] tracking-wide">
            © 2026 Scribo. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-gray-600 text-[10px] md:text-xs font-['DM_Sans'] tracking-wide">
            <span>Made for students, by developers</span>
            <Heart size={12} className="text-[#f97316] fill-[#f97316]/20" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
