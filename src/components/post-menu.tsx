"use client";

import { useEffect, useState } from "react";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Ellipsis, AlertCircle } from "lucide-react";
import DeletePost from "./delete-post";

async function fetchSession() {
  const res = await fetch("/api/auth/session");
  if (!res.ok) throw new Error("Failed to fetch session");
  return res.json();
}

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

export default function PostMenu({ post }: { post: Post }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);

  useEffect(() => {
    async function getSession() {
      try {
        const session = await fetchSession();
        setSessionUserId(session.user?.id || null);
      } catch (error) {
        console.error("Failed to fetch session:", error);
      }
    }
    getSession();
  }, []);

  const handleMenuOpen = () => setIsMenuOpen(true);
  const handleMenuClose = () => setIsMenuOpen(false);

  return (
    <Menu isOpen={isMenuOpen} onOpen={handleMenuOpen} onClose={handleMenuClose}>
      <MenuButton
        as={IconButton}
        icon={<Ellipsis className="w-4 h-4" />}
        variant="outline"
        border="none"
        size="sm"
        rounded={"100%"}
      />
      <MenuList className="text-sm">
        {sessionUserId === post.user.id ? (
          <>
            <DeletePost
              postId={post.id}
              onDeletionComplete={() => {
                handleMenuClose();
                window.location.reload();
              }}
            />
            <MenuItem icon={<AlertCircle className="w-4 h-4" />}>
              Report Post
            </MenuItem>
          </>
        ) : (
          <MenuItem icon={<AlertCircle className="w-4 h-4" />}>
            Report Post
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}
