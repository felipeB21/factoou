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
  initialLikes,
  initialLikedByUser,
}: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialLikedByUser);
  const [isLoading, setIsLoading] = useState(false);
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
        setIsLiked(data.isLiked);
        setLikes(data.likeCount);
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchLikeStatus();
  }, [postId]);

  async function handleLike() {
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
            title: "Log in required.",
            description: "You need to log in to like posts.",
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
        } else {
          throw new Error("Failed to like/unlike post");
        }
        return;
      }

      const data = await res.json();

      // Update state only if we received valid data
      if (
        typeof data.isLiked === "boolean" &&
        typeof data.likeCount === "number"
      ) {
        setIsLiked(data.isLiked);
        setLikes(data.likeCount);
      } else {
        throw new Error("Invalid data received from server");
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleLike}
      className={`text-sm flex items-center gap-1 ${
        isLiked ? "text-yellow-500" : "text-stone-700"
      } hover:text-yellow-500 transition-colors duration-200`}
      aria-label={`${
        isLiked ? "Unlike" : "Like"
      } post. Current likes: ${likes}`}
      disabled={isLoading}
    >
      {isLoading ? (
        <Spinner size="xs" />
      ) : (
        <>
          <Heart
            className={`h-4 w-4 ${
              isLiked ? "fill-yellow-500" : "fill-none"
            } stroke-current`}
          />
          <span>{likes}</span>
        </>
      )}
    </button>
  );
}
