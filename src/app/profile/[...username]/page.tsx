import ProfileComponent from "@/components/profile";
import { Metadata } from "next";
import { auth } from "../../../../auth";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/profile/${params.username}`
  );

  if (res && res.ok) {
    const data = await res.json();
    return {
      title: `${data.username} - Factoou`,
      description: `Profile page for ${data.username}`,
    };
  }

  return {
    title: "User not found - Factoou",
    description: "User not found",
  };
}

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const session = await auth();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/profile/${params.username}`
  );
  const initialUser = res && res.ok ? await res.json() : null;

  const isHisProfile = session?.user.id === initialUser?.id;

  return (
    <ProfileComponent initialUser={initialUser} isHisProfile={isHisProfile} />
  );
}
