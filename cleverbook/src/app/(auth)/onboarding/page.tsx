import { SignupWizard } from "@/components/onboarding/SignupWizard";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome to CleverBook
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Tell us about your educational background to personalize your dashboard.
          </p>
        </div>
        <SignupWizard />
      </div>
    </main>
  );
}
