import { createClient } from "@/lib/supabase/server";
import { DashboardView } from "@/components/dashboard-view";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: podcasts } = await supabase
    .from("podcasts")
    .select("id, title, status, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  return <DashboardView podcasts={podcasts ?? []} />;
}
