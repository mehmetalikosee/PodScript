import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileView } from "@/components/profile-view";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, phone, tokens_remaining, tokens_limit, plan, trial_ends_at")
    .eq("id", user.id)
    .single();

  return (
    <ProfileView
      userId={user.id}
      email={user.email ?? ""}
      fullName={profile?.full_name ?? ""}
      phone={profile?.phone ?? ""}
      avatarUrl={profile?.avatar_url ?? null}
      tokensRemaining={profile?.tokens_remaining ?? 0}
      tokensLimit={profile?.tokens_limit ?? 10}
      plan={profile?.plan ?? "trial"}
      trialEndsAt={profile?.trial_ends_at ?? null}
    />
  );
}
