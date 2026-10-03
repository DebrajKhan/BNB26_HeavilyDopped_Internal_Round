import { MOCK_METRICS, MOCK_SYLLABUS } from "@/lib/mockData";
import { HeroMetrics } from "@/components/dashboard/HeroMetrics";
import { SyllabusAccordion } from "@/components/syllabus/SyllabusAccordion";
import { SyllabusProvider } from "@/components/dashboard/SyllabusContext";

export default function DashboardPage() {
  return (
    <main className="max-w-6xl mx-auto p-6 md:p-12">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back. Here is your progress at a glance.</p>
      </header>
      
      <SyllabusProvider syllabus={MOCK_SYLLABUS}>
        <HeroMetrics metrics={MOCK_METRICS} />
        <SyllabusAccordion nodes={MOCK_SYLLABUS} />
      </SyllabusProvider>
    </main>
  );
}
