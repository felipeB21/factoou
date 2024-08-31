"use server";
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
    title: "Profile - Factoou",
    description: "User not found",
  };
}

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const session = await auth();
  const userRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/profile/${params.username}`
  );
  const initialUser = userRes && userRes.ok ? await userRes.json() : null;

  const postsRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/user/${params.username}`
  );

  const userPosts = postsRes && postsRes.ok ? await postsRes.json() : [];

  const isHisProfile = session?.user.id === initialUser?.id;

  if (!initialUser)
    return (
      <div className="flex flex-col items-center justify-center h-[50dvh]">
        <h4 className="text-2xl font-medium">This account doesn’t exist</h4>
        <p>Try searching for another.</p>
      </div>
    );

  return (
    <ProfileComponent
      initialUser={initialUser}
      isHisProfile={isHisProfile}
      userPosts={userPosts}
    />
  );
}
