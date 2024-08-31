"use client";

import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  initialLikedByUser: boolean;
}

export default function LikeButton({
  postId,
  initialLikedByUser,
  initialLikes,
}: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialLikedByUser);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const res = await fetch(`/api/post/${postId}/like/status`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch like status");
        }

        const data = await res.json();
        setLikes(data.likeCount);
        setIsLiked(data.isLiked);
      } catch (error) {
        console.error("Error fetching like status:", error);
        toast({
          title: "Error",
          description: "Failed to load like status. Please refresh the page.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsInitializing(false);
      }
    };

    fetchLikeStatus();
  }, [postId, toast]);

  const handleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/post/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          toast({
            title: "Authentication required",
            description: "Please log in to like posts.",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        } else {
          throw new Error("Failed to like/unlike post");
        }
        return;
      }

      const data = await res.json();
      setLikes(data.likeCount);
      setIsLiked(data.isLiked);

      toast({
        title: data.isLiked ? "Post liked" : "Post unliked",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error liking/unliking post:", error);
      toast({
        title: "Error",
        description: "Failed to like/unlike post. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="flex items-center gap-2">
        <Spinner size="sm" />
        <span>{initialLikes}</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-1 text-sm transition-colors duration-200 group ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      aria-label={`${isLiked ? "Unlike" : "Like"} post (${likes} likes)`}
    >
      {isLoading ? (
        <Spinner size="xs" />
      ) : (
        <Heart
          className={`h-4 w-4 ${
            isLiked ? "text-red-500 fill-current" : "text-neutral-600"
          } group-hover:text-red-500 `}
        />
      )}
      <span
        className={`${
          isLiked ? "text-red-500" : "text-neutral-600"
        } group-hover:text-red-500`}
      >
        {likes}
      </span>
    </button>
  );
}
