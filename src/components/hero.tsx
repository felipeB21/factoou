import Image from "next/image";
import Link from "next/link";

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
  _count: {
    likes: number;
    comments: number;
  };
  likedByCurrentUser: boolean;
}

async function fetchPost(): Promise<Post | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/popular`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
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

export default async function Hero() {
  const post = await fetchPost();

  return (
    <div className="bg-white bg-[radial-gradient(circle_at_center,rgba(255,255,153,0.3)_0%,rgba(255,255,255,0)_100%)]">
      <h1 className="text-5xl font-bold uppercase">
        <span className="p-1 bg-yellow-400/50">Factoou</span> of the day
      </h1>
      {post ? (
        <div className="mt-10">
          <div>
            <div className="flex gap-3 items-center">
              <Link href={`/profile/${post.user.username}`}>
                <Image
                  className="rounded-full w-20 h-20 object-cover"
                  src={post.user.image}
                  alt="avatar"
                  width={100}
                  height={100}
                />
              </Link>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Link href={`/profile/${post.user.username}`}>
                    <h2 className="text-xl font-bold">@{post.user.username}</h2>
                  </Link>
                  <p className="text-sm text-stone-300">|</p>
                  <p className="text-sm">{formatDate(post.createdAt)}</p>
                </div>

                <p>{post.body}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h5 className="mt-5 text-2xl font-medium">
          We don`t have a Factoou of the day, make a factoou to be here.
        </h5>
      )}
    </div>
  );
}
