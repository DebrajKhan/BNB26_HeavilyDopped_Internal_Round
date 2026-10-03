"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileType } from "@/types/models";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction > 0 ? -50 : 50,
    opacity: 0,
  }),
};

const transition = { type: "spring", stiffness: 300, damping: 30 };

export function SignupWizard() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Form states
  const [profileType, setProfileType] = useState<ProfileType>("college");
  const [yearSem, setYearSem] = useState("1");

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      nextStep();
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <motion.form 
      layout
      transition={transition}
      onSubmit={handleSubmit} 
      className="bg-white p-8 border border-slate-200 shadow-sm rounded-3xl flex flex-col relative overflow-hidden min-h-[300px]"
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
          className="flex flex-col gap-6 w-full"
        >
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Create your account</h2>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input required type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm" placeholder="you@example.com" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                <input required type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm" placeholder="Create new password" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-slate-900 mb-2">What's your first name?</h2>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">First Name</label>
                <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm" placeholder="e.g. Debraj" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-slate-900 mb-2">And your last name?</h2>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Name</label>
                <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm" placeholder="e.g. Khan" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Educational Background</h2>
              
              <div className="flex bg-slate-100 p-1 rounded-xl relative isolate">
                {(["college", "school"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setProfileType(type)}
                    className={cn(
                      "flex-1 py-2 text-sm font-semibold capitalize rounded-lg transition-colors z-10",
                      profileType === type ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {type}
                    {profileType === type && (
                      <motion.div
                        layoutId="active-pill-wizard"
                        className="absolute inset-y-1 bg-white shadow-sm rounded-lg -z-10"
                        style={{ width: "calc(50% - 4px)", left: type === "college" ? "4px" : "calc(50%)" }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {profileType === "college" ? (
                  <motion.div
                    key="college-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="flex flex-col gap-4"
                  >
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Institution Name</label>
                      <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm" placeholder="e.g. University of Engineering & Management (UEM), Kolkata" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stream</label>
                      <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm" placeholder="e.g. B.Tech CSE" />
                    </div>
                    <div className="flex gap-4">
                      <div className="space-y-1 flex-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Year/Sem</label>
                        <select 
                          required 
                          value={yearSem}
                          onChange={(e) => setYearSem(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm"
                        >
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                        </select>
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="relative h-[18px] mb-1">
                          <AnimatePresence mode="wait">
                            <motion.label 
                              key={yearSem === "1" ? "percentage" : "cgpa"}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.15 }}
                              className="absolute inset-0 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap block"
                            >
                              {yearSem === "1" ? "12TH STANDARD PERCENTAGE" : "PAST CGPA"}
                            </motion.label>
                          </AnimatePresence>
                        </div>
                        <input 
                          required 
                          type="number" 
                          step="0.01" 
                          max={yearSem === "1" ? "100" : "10"} 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm" 
                          placeholder={yearSem === "1" ? "e.g. 88%" : "e.g. 8.5"} 
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="school-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="flex flex-col gap-4"
                  >
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">School Name</label>
                      <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm" placeholder="e.g. Delhi Public School" />
                    </div>
                    <div className="flex gap-4">
                      <div className="space-y-1 flex-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Standard</label>
                        <select required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm">
                          <option value="9th">9th</option>
                          <option value="10th">10th</option>
                          <option value="11th">11th</option>
                          <option value="12th">12th</option>
                        </select>
                      </div>
                      <div className="space-y-1 flex-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stream</label>
                        <select required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm">
                          <option value="science">Science</option>
                          <option value="commerce">Commerce</option>
                          <option value="arts">Arts</option>
                          <option value="general">General</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Past Percentage</label>
                      <input required type="number" max="100" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm" placeholder="e.g. 92" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className={cn("mt-8 flex", step < 4 ? "justify-end" : "justify-center")}>
        {step < 4 ? (
          <motion.button
            layout
            key="next-btn"
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
          >
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        ) : (
          <motion.button
            layout
            key="complete-btn"
            type="submit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl shadow-sm hover:shadow-lg transition-shadow"
          >
            Complete Profile
          </motion.button>
        )}
      </div>
    </motion.form>
  );
}
