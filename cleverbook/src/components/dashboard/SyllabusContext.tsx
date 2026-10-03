"use client";

import { createContext, useContext, useState, useMemo } from "react";
import { SyllabusNode } from "@/types/models";

interface SyllabusContextType {
  completedSubtopics: Record<string, boolean>;
  toggleSubtopic: (id: string) => void;
  coveragePercentage: number;
  activeTitle: string;
  activePercentage: number;
}

export const SyllabusContext = createContext<SyllabusContextType | undefined>(undefined);

export function SyllabusProvider({ children, syllabus }: { children: React.ReactNode, syllabus: SyllabusNode[] }) {
  const [completedSubtopics, setCompletedSubtopics] = useState<Record<string, boolean>>({});

  const totalSubtopics = useMemo(() => {
    let count = 0;
    const countNodes = (nodes: SyllabusNode[]) => {
      for (const node of nodes) {
        if (node.type === "subtopic") count++;
        if (node.children) countNodes(node.children);
      }
    };
    countNodes(syllabus);
    return count;
  }, [syllabus]);

  const completedCount = Object.values(completedSubtopics).filter(Boolean).length;
  const coveragePercentage = totalSubtopics === 0 ? 0 : Math.round((completedCount / totalSubtopics) * 100);

  const activeTopicInfo = useMemo(() => {
    let activeTitle = "All Caught Up";
    let activePercentage = 100;

    const findActive = (nodes: SyllabusNode[]) => {
      for (const node of nodes) {
        if (node.type === "topic") {
          let total = 0;
          let completed = 0;
          const checkSubtopics = (children: SyllabusNode[]) => {
             for (const child of children) {
               if (child.type === "subtopic") {
                 total++;
                 if (completedSubtopics[child.id]) completed++;
               }
               if (child.children) checkSubtopics(child.children);
             }
          };
          if (node.children) checkSubtopics(node.children);
          
          if (total > 0 && completed < total) {
             activeTitle = node.title;
             activePercentage = Math.round((completed / total) * 100);
             return true;
          }
        } else if (node.children) {
          if (findActive(node.children)) return true;
        }
      }
      return false;
    };

    findActive(syllabus);

    return { activeTitle, activePercentage };
  }, [syllabus, completedSubtopics]);

  const toggleSubtopic = (id: string) => {
    setCompletedSubtopics(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <SyllabusContext.Provider value={{ 
      completedSubtopics, 
      toggleSubtopic, 
      coveragePercentage,
      activeTitle: activeTopicInfo.activeTitle,
      activePercentage: activeTopicInfo.activePercentage
    }}>
      {children}
    </SyllabusContext.Provider>
  );
}

export function useSyllabus() {
  const context = useContext(SyllabusContext);
  if (!context) throw new Error("useSyllabus must be used within a SyllabusProvider");
  return context;
}
