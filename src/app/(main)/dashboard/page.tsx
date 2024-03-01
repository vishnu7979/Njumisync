import DashboardSetup from '@/components/dashboard-setup/dashboard-setup';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import React from 'react'
import { cookies } from 'next/headers';
import { getUserSubscriptionStatus } from '@/lib/superbase/queries';
import db from '@/lib/superbase/db';
 

const DashboardPage = async () => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const workspace = await db.query.workspaces.findFirst({
    where: (workspace, { eq }) => eq(workspace.workspaceOwner, user.id),
  });

  const { data: subscription, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);

  if (subscriptionError) return;

  if (!workspace)
   return (
    <div
    className="bg-background
    h-screen
    w-screen
    flex
    justify-center
    items-center
"
  >
    <DashboardSetup
      user={user}
      subscription={subscription}
    />
  </div>
);

redirect(`/dashboard/${workspace.id}`);
};
 
 export default DashboardPage;