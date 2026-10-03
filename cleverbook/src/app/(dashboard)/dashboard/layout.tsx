export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation placeholder */}
      <nav className="bg-white border-b border-slate-100 px-6 py-4 shadow-sm flex items-center justify-between">
        <div className="font-extrabold text-xl tracking-tight text-slate-900">CleverBook</div>
        <div className="w-8 h-8 rounded-full bg-slate-200" />
      </nav>
      {children}
    </div>
  );
}
