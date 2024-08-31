import Image from "next/image";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import UsernameModal from "./username-modal";

interface ProfileProps {
  initialUser: {
    id: string;
    username: string;
    image?: string;
    createdAt: string;
  };
  isHisProfile: boolean;
  userPosts: Array<{
    id: string;
    body: string;
    createdAt: string;
  }>;
}

export default function ProfileComponent({
  initialUser,
  isHisProfile,
  userPosts,
}: ProfileProps) {
  const avatar = initialUser.image || "/default-avatar.png";
  const formattedUserCreatedAt = format(
    new Date(initialUser.createdAt),
    "MMMM d, yyyy"
  );

  return (
    <div className="flex justify-between">
      <div className="flex gap-3 sticky">
        <Image
          src={avatar}
          alt="avatar"
          width={100}
          height={100}
          className="rounded-full w-auto h-auto"
        />
        <div>
          <div className="flex items-center">
            <h3 className="text-xl font-bold">@{initialUser.username}</h3>
            {isHisProfile ? <UsernameModal /> : ""}
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <CalendarDays className="w-4 h-4" />
            Joined on {formattedUserCreatedAt}
          </p>
        </div>
      </div>
      <div>
        {userPosts.length > 0 ? (
          userPosts.map((post) => {
            const formattedPostCreatedAt = format(
              new Date(post.createdAt),
              "MMMM d, yyyy h:mm a"
            );
            return (
              <div key={post.id}>
                <p>{post.body}</p>
                <p className="text-sm text-gray-500">
                  Posted on {formattedPostCreatedAt}
                </p>
              </div>
            );
          })
        ) : (
          <p>No posts found</p>
        )}
      </div>
    </div>
  );
}
