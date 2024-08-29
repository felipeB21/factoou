"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { CircularProgress } from "@chakra-ui/react";
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
}

export default function GetPosts() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await res.json();
        setPosts(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
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
  };

  if (loading)
    return (
      <div className="text-center">
        <CircularProgress isIndeterminate color="yellow.500" />
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-full">
      <ul className="border-t">
        {posts?.map((post) => (
          <li className="border-x border-b p-5 flex items-start" key={post.id}>
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
              <div className="overflow-hidden">
                <p className="text-stone-800 break-words max-w-[25dvw] pr-20">
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
