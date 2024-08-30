import Image from "next/image";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";

interface User {
  id: string;
  username: string;
  image: string;
}

interface Post {
  id: string;
  body: string;
  createdAt: string;
  user: User;
}

async function fetchPosts(): Promise<Post[] | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/post`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function formatDate(dateString: string) {
  const postDate = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - postDate.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
  };

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds > 1 ? "s" : ""}`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""}`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""}`;
  } else {
    return postDate.toLocaleDateString("en-US", options);
  }
}

export default async function GetPosts() {
  const posts = await fetchPosts();

  if (!posts) {
    return <div>Error: Failed to load posts</div>;
  }

  return (
    <div className="max-w-full">
      <ul className="border-t">
        {posts.map((post) => (
          <li
            className="border-x border-b px-5 py-8 flex items-start"
            key={post.id}
          >
            <Link
              href={`/profile/${post.user.username}`}
              className="flex-shrink-0"
            >
              <Image
                src={post.user.image}
                alt="avatar"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            </Link>
            <div className="flex flex-col flex-1 ml-2">
              <div className="flex items-center gap-2">
                <Link
                  href={`/profile/${post.user.username}`}
                  className="font-medium"
                >
                  {post.user.username}
                </Link>
                <p className="text-sm text-stone-300">|</p>
                <p className="text-sm">{formatDate(post.createdAt)}</p>
              </div>
              <div className="overflow-hidden mt-0.5">
                <p className="text-stone-800 break-words w-[40dvw] pr-10">
                  {post.body}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
