"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, Star } from "lucide-react";
import { AntigravityCard } from "@/components/dashboard/HeroMetrics";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* A. Header (Sticky Nav) */}
      <header className="sticky top-0 bg-white border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative">
              <BookOpen className="w-6 h-6 text-slate-900" />
              <Sparkles className="w-3 h-3 text-indigo-500 absolute -top-1 -right-2" />
            </div>
            <span className="font-bold text-xl tracking-tight">CleverBook</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
            <Link href="/" className="text-slate-500 hover:text-slate-900 transition-colors">Home</Link>
            <Link href="#about-us" className="text-slate-500 hover:text-slate-900 transition-colors">About Us</Link>
            <Link href="#features" className="text-slate-500 hover:text-slate-900 transition-colors">Features</Link>
          </nav>
          
          <div className="flex items-center gap-4 text-sm font-semibold">
            <Link href="/onboarding" className="text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">Sign In</Link>
            <Link href="/onboarding" className="bg-slate-900 text-white px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* B. Hero Section */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-6 py-20 relative">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-3xl"
        >
          <motion.h1 variants={fadeUpVariant} className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
            Welcome to CleverBook
          </motion.h1>
          <motion.p variants={fadeUpVariant} className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Your personalized AI learning environment. We diagnose the root of your cognitive misconceptions and adapt to your unique educational background, ensuring every study session is hyper-focused and ruthlessly effective.
          </motion.p>
          <motion.div variants={fadeUpVariant}>
            <Link href="/onboarding" className="inline-block bg-slate-900 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              Get Started for Free
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* C. About Us Section */}
      <section id="about-us" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
          >
            <div className="space-y-6">
              <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                About Us
              </motion.h2>
              <motion.p variants={fadeUpVariant} className="text-slate-600 text-lg leading-relaxed">
                Education isn't a one-size-fits-all conveyor belt. Traditional platforms just mark your answers wrong and move on. CleverBook is built differently. We believe in identifying the underlying cognitive misconceptions that lead to mistakes.
              </motion.p>
              <motion.p variants={fadeUpVariant} className="text-slate-600 text-lg leading-relaxed">
                Whether you're struggling with Calculus derivatives or perfecting your Mock Interviews, our multimodal intervention system dynamically adjusts. It's like having a world-class tutor sitting right beside you.
              </motion.p>
            </div>
            <motion.div variants={fadeUpVariant} className="relative">
              {/* Abstract Metric Card Stack Placeholder */}
              <div className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-8 shadow-inner">
                 <div className="absolute top-10 left-10 w-48 h-32 bg-white rounded-2xl shadow-sm border border-slate-100 z-10 transform -rotate-6"></div>
                 <div className="absolute bottom-12 right-12 w-56 h-40 bg-white rounded-2xl shadow-md border border-slate-100 z-20 transform rotate-3 flex flex-col p-4 justify-between">
                    <div className="h-4 w-1/2 bg-slate-100 rounded-full"></div>
                    <div className="flex gap-2 items-end">
                      <div className="h-16 w-8 bg-indigo-50 rounded-t-sm"></div>
                      <div className="h-24 w-8 bg-indigo-100 rounded-t-sm"></div>
                      <div className="h-20 w-8 bg-indigo-500 rounded-t-sm"></div>
                    </div>
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-tr from-slate-100/50 to-transparent pointer-events-none"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* D. Features Provided Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Features Provided</h2>
            <p className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto">Everything you need to accelerate your learning and retain information permanently.</p>
          </motion.div>

          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeUpVariant}>
              <AntigravityCard className="h-full">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 text-slate-900" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Multimodal Intervention</h3>
                <p className="text-slate-600 leading-relaxed">Video, text, and interactive assessments adapt to your exact learning style when you hit a roadblock.</p>
              </AntigravityCard>
            </motion.div>
            
            <motion.div variants={fadeUpVariant}>
              <AntigravityCard className="h-full">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
                  <BookOpen className="w-6 h-6 text-slate-900" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Coverage</h3>
                <p className="text-slate-600 leading-relaxed">Watch your syllabus completion automatically tick up as you clear topics. Never lose track of your progress again.</p>
              </AntigravityCard>
            </motion.div>
            
            <motion.div variants={fadeUpVariant}>
              <AntigravityCard className="h-full">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
                  <Star className="w-6 h-6 text-slate-900" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Adaptive Assessments</h3>
                <p className="text-slate-600 leading-relaxed">Questions that scale in difficulty. Master the basics, then get challenged to prove your 100% retention.</p>
              </AntigravityCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* E. People's Review (Testimonials) */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">People's Review</h2>
          </motion.div>

          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                name: "Rohan D.",
                role: "High School Student",
                content: "The 12th Standard percentage tracking is incredibly accurate. It identified exactly where my physics concepts were weak and pushed the right mock tests.",
                rating: 5
              },
              {
                name: "Priya S.",
                role: "College Freshman",
                content: "I was failing Calculus until the multimodal intervention stepped in. The way it breaks down misconceptions instead of just marking 'wrong' changed everything.",
                rating: 5
              },
              {
                name: "Amit K.",
                role: "Final Year B.Tech",
                content: "The mock interview prep feature is top tier. The active focus card literally kept me accountable every single day until I cleared my placement rounds.",
                rating: 5
              }
            ].map((review, i) => (
              <motion.div key={i} variants={fadeUpVariant} className="bg-slate-50 border border-slate-100 rounded-2xl p-8 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-slate-900 text-slate-900" />
                    ))}
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-8">"{review.content}"</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900">{review.name}</p>
                  <p className="text-sm text-slate-500">{review.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* F. Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-300" />
            <span className="font-bold text-slate-200 text-base">CleverBook</span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <div>
            © 2026 CleverBook. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
