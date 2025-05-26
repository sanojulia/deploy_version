import React, { useState, useEffect } from 'react';
import HeroSection from '../../components/HeroSection/HeroSection';
import ServicesSection from '../../components/ServicesSection/ServicesSection';
import NewColletion from '../../components/NewColletion/NewColletion';


const Home = () => {
  return (
    <div>
      <HeroSection />
      <ServicesSection />
      <NewColletion />
    </div>
  )
};

export default Home;