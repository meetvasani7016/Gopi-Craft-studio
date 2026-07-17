import { checkSetupWizardStatus } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";
import SetupWizardForm from "./setup-wizard-form";

export const revalidate = 0; // Dynamic rendering, no caching for security checks

export default async function SetupWizardPage() {
  const { locked } = await checkSetupWizardStatus();

  if (locked) {
    redirect("/admin/login");
  }

  return <SetupWizardForm />;
}
