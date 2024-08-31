import { auth } from "../../auth";
import PostCard from "./post-card";

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

async function fetchPosts(): Promise<Post[] | null> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/post`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Id": userId || "",
      },
      cache: "no-store",
    });

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

export default async function GetPosts() {
  const posts = await fetchPosts();

  if (!posts) {
    return <div>Error: Failed to load posts</div>;
  }

  if (posts.length === 0) {
    return <div>No posts available</div>;
  }

  return (
    <div className="w-[40dvw] xl:w-auto">
      <ul className="border-t">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </ul>
    </div>
  );
}
