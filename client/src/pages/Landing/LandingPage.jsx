import React from 'react';
import Navbar from '../../components/common/Navbar';
import Hero from '../../components/Landing/Hero';
import ProblemSolution from '../../components/Landing/ProblemSolution';
import Features from '../../components/Landing/Features';
import HowItWorks from '../../components/Landing/HowItWorks';

import DualPersona from '../../components/Landing/DualPersona';

import StatsSection from '../../components/Landing/StatsSection';
import Testimonials from '../../components/Landing/Testimonials';
import TechStack from '../../components/Landing/TeckStack';
import Pricing from '../../components/Landing/Pricing';
import FAQ from '../../components/Landing/FAQ';
import FinalCTA from '../../components/Landing/FinalCTA';
import Footer from '../../components/Landing/Footer';
import Spotlight from '../../components/Landing/Spotlight';


const LandingPage = () => {
  return (
    <>
      <Navbar/>
      <Hero />
      <ProblemSolution />
      <Features />
      <HowItWorks />
      <Spotlight/>
      <DualPersona />
      <StatsSection/>
      <Testimonials/>
      <TechStack/>
      <Pricing/>
      <FAQ/>
      <FinalCTA/>
      <Footer/>
    </>
  );
};

export default LandingPage;
