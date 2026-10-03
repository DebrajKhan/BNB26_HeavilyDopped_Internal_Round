"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProfileType } from "@/types/models";

const springConfig = { type: "spring" as const, stiffness: 400, damping: 30 };
const heightSpringConfig = { type: "spring" as const, stiffness: 100, damping: 15, mass: 1 };

export function OnboardingForm() {
  const [profileType, setProfileType] = useState<ProfileType>("college");
  const [yearSem, setYearSem] = useState("1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Proceed to dashboard mock logic
    window.location.href = "/dashboard";
  };

  return (
    <motion.form 
      layout 
      transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }}
      onSubmit={handleSubmit} 
      className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col gap-6 relative"
    >
      
      {/* Toggle */}
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
                layoutId="active-pill"
                className="absolute inset-y-1 bg-white shadow-sm rounded-lg -z-10"
                style={{ width: "calc(50% - 4px)", left: type === "college" ? "4px" : "calc(50%)" }}
                transition={springConfig}
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
                  <input required type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm" placeholder="e.g. MIT, IIT Bombay" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stream</label>
                  <input required type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm" placeholder="e.g. B.Tech CSE" />
                </div>
                <div className="flex gap-4">
                  <div className="space-y-1 flex-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Year/Sem</label>
                    <select 
                      required 
                      value={yearSem}
                      onChange={(e) => setYearSem(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm"
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="relative h-4 mb-1">
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
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm" 
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
                  <input required type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm" placeholder="e.g. Delhi Public School" />
                </div>
                <div className="flex gap-4">
                  <div className="space-y-1 flex-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Standard</label>
                    <select required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm">
                      <option value="9th">9th</option>
                      <option value="10th">10th</option>
                      <option value="11th">11th</option>
                      <option value="12th">12th</option>
                    </select>
                  </div>
                  <div className="space-y-1 flex-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stream</label>
                    <select required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm">
                      <option value="science">Science</option>
                      <option value="commerce">Commerce</option>
                      <option value="arts">Arts</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Past Percentage</label>
                  <input required type="number" max="100" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm" placeholder="e.g. 92" />
                </div>
            </motion.div>
          )}
        </AnimatePresence>

      <motion.button
        layout
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-slate-900 text-white font-semibold rounded-lg shadow-sm hover:shadow-lg transition-shadow mt-4"
      >
        Complete Profile
      </motion.button>
    </motion.form>
  );
}
