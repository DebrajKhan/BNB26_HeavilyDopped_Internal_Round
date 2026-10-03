"use client";

import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { DashboardMetrics } from "@/types/models";
import { AmbientParticles } from "./AmbientParticles";
import { cn } from "@/lib/utils";
import { useContext, useEffect } from "react";
import { SyllabusContext } from "./SyllabusContext";

function AnimatedCounter({ value }: { value: number }) {
  const spring = useSpring(value, { mass: 1, stiffness: 100, damping: 15 });
  const display = useTransform(spring, (current) => `${Math.round(current)}%`);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span className="text-4xl font-extrabold text-slate-900">{display}</motion.span>;
}

const cardHover = {
  hover: { y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }, 
  rest: { y: 0, boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" } 
};
const springTransition = { type: "spring" as const, stiffness: 400, damping: 30 };

export function AntigravityCard({ children, className, ambient = false }: { children: React.ReactNode, className?: string, ambient?: boolean }) {
  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      transition={springTransition}
      className={cn("bg-white border border-slate-100 rounded-2xl p-6 relative overflow-hidden", className)}
    >
      {ambient && <AmbientParticles />}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

export function HeroMetrics({ metrics, userRole = 'college' }: { metrics: DashboardMetrics, userRole?: 'college' | 'school' }) {
  const context = useContext(SyllabusContext);
  const coveragePercentage = context ? context.coveragePercentage : metrics.syllabusCoverage;
  const activeTitle = context ? context.activeTitle : metrics.activeSubject;
  const activePercentage = context ? context.activePercentage : metrics.retentionScore;

  const collegeAssessments = [
    { id: 'c1', title: 'Mock Interview', date: 'Today', statusOrScore: 'Cleared' },
    { id: 'c2', title: 'Aptitude Test', date: 'Yesterday', statusOrScore: 'Failed' },
    { id: 'c3', title: 'Coding Round', date: 'Oct 1', statusOrScore: 'Cleared' }
  ];

  const schoolAssessments = [
    { id: 's1', title: 'Mathematics', date: 'Today', statusOrScore: '27/30' },
    { id: 's2', title: 'Physics', date: 'Yesterday', statusOrScore: '18/30' },
    { id: 's3', title: 'Chemistry', date: 'Oct 1', statusOrScore: '22/30' }
  ];

  const displayAssessments = userRole === 'school' ? schoolAssessments : collegeAssessments;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {/* Component A: Weekly Performance Focus */}
      <AntigravityCard ambient className="md:col-span-1">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Active Focus</h3>
        <div className="relative h-8 mb-1">
          <AnimatePresence mode="wait">
            <motion.p 
              key={activeTitle}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 text-2xl font-bold text-slate-900 truncate"
            >
              {activeTitle}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="flex items-end gap-2 mt-4 relative">
          <AnimatedCounter value={activePercentage} />
          <span className="text-sm font-medium text-slate-500 pb-1">Retention</span>
        </div>
      </AntigravityCard>

      {/* Component B: Syllabus Coverage */}
      <AntigravityCard className="md:col-span-1 flex flex-col justify-center">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Coverage</h3>
        <div className="flex justify-between text-sm font-medium text-slate-900 mb-2">
          <span>Overall Progress</span>
          <span>{coveragePercentage}%</span>
        </div>
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${coveragePercentage}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.8 }}
            className="h-full bg-slate-900 rounded-full"
          />
        </div>
      </AntigravityCard>

      {/* Component C: Assessment Ledger */}
      <AntigravityCard className="md:col-span-1">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Recent Assessments</h3>
        <div className="space-y-4">
          {displayAssessments.map((assessment) => (
            <div key={assessment.id} className="flex justify-between items-center border-b border-slate-50 pb-2 last:border-0 last:pb-0">
              <div>
                <p className="text-sm font-semibold text-slate-900">{assessment.title}</p>
                <p className="text-xs text-slate-500">{assessment.date}</p>
              </div>
              <span className={cn(
                "text-xs font-bold px-2 py-1 rounded-md",
                userRole === 'school'
                  ? "bg-indigo-50 text-indigo-700 font-mono"
                  : (assessment.statusOrScore === "Cleared" || parseInt(assessment.statusOrScore) > 60 
                      ? "bg-green-100 text-green-800" 
                      : "bg-slate-100 text-slate-800")
              )}>
                {assessment.statusOrScore}
              </span>
            </div>
          ))}
        </div>
      </AntigravityCard>
    </div>
  );
}
