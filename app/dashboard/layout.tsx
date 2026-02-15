import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { Footer } from "@/components/footer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader userEmail={user.email} />
      <main className="container mx-auto px-4 py-8 max-w-5xl flex-1">{children}</main>
      <Footer />
    </div>
  );
}
