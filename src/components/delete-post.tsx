"use client";

import { MenuItem, useToast } from "@chakra-ui/react";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface DeletePostProps {
  postId: string;
  onDeletionComplete: () => void;
}

export default function DeletePost({
  postId,
  onDeletionComplete,
}: DeletePostProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  async function handleDeletePost() {
    setIsDeleting(true);
    toast({
      title: "Deleting post...",
      description: "Please wait while the post is being deleted.",
      status: "info",
      duration: null,
      isClosable: true,
    });

    try {
      const res = await fetch(`/api/post/${postId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Error deleting post");
      }

      onDeletionComplete();
      toast({
        title: "Post deleted",
        description: "The post has been successfully deleted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast({
        title: "Error",
        description: "There was an error deleting the post.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <MenuItem
      color={"red"}
      icon={<Trash2 className="w-4 h-4" />}
      onClick={handleDeletePost}
      isDisabled={isDeleting}
    >
      {isDeleting ? "Deleting..." : "Delete Post"}
    </MenuItem>
  );
}
