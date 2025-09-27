import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import JobPreview from '../components/JobPreview'
import Stats from '../components/Stats'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <JobPreview/>
      <Features/>
      <HowItWorks/>
      <Stats/>
      <Testimonials/>
      <Footer/>
    </div>
  )
}

export default Home