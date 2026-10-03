"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SyllabusNode } from "@/types/models";
import { cn } from "@/lib/utils";
import { ChevronDown, PlayCircle } from "lucide-react"; 
import { useSyllabus } from "@/components/dashboard/SyllabusContext"; 

const accordionSpring = { type: "spring" as const, stiffness: 100, damping: 15, mass: 1 };

function SyllabusItem({ node, level = 0 }: { node: SyllabusNode; level?: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const syllabusContext = useSyllabus();
  const isCompleted = syllabusContext.completedSubtopics[node.id] || false;
  const hasChildren = node.children && node.children.length > 0;
  
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center py-4 text-left transition-colors hover:bg-slate-50",
          level === 0 ? "px-6 font-bold text-slate-900" : level === 1 ? "px-10 font-semibold text-slate-800" : "px-14 font-medium text-slate-700"
        )}
      >
        {node.type === "subtopic" ? (
          <div className="flex items-center w-full gap-3">
            <div 
              className="relative flex items-center justify-center cursor-pointer shrink-0"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={(e) => {
                e.stopPropagation();
                syllabusContext.toggleSubtopic(node.id);
              }}
            >
              <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center bg-white z-10 relative">
                {isCompleted && (
                  <svg className="w-3.5 h-3.5 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      d="M20 6L9 17l-5-5"
                    />
                  </svg>
                )}
              </div>
              <AnimatePresence>
                {isHovered && !isCompleted && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="absolute left-full ml-2 px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded-full whitespace-nowrap pointer-events-none"
                  >
                    Sure?
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <span className={cn("transition-colors", isCompleted ? "text-slate-400" : "")}>{node.title}</span>
            <PlayCircle className="w-4 h-4 text-slate-900 ml-auto shrink-0" />
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span>{node.title}</span>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={accordionSpring}>
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </motion.div>
          </div>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={accordionSpring}
            className="overflow-hidden bg-slate-50/50"
          >
            {hasChildren && (
              <div className="flex flex-col">
                {node.children!.map((child) => (
                  <SyllabusItem key={child.id} node={child} level={level + 1} />
                ))}
              </div>
            )}
            
            {node.type === "subtopic" && node.videoId && (
              <div className="p-6 pl-14">
                <div className="aspect-video w-full max-w-2xl bg-slate-900 rounded-xl overflow-hidden shadow-inner relative">
                  <iframe 
                    src={`https://www.youtube.com/embed/${node.videoId}`} 
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SyllabusAccordion({ nodes }: { nodes: SyllabusNode[] }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
        <h2 className="text-lg font-bold text-slate-900">Course Syllabus</h2>
      </div>
      <div className="flex flex-col">
        {nodes.map((node) => (
          <SyllabusItem key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}
