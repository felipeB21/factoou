import { Heart } from "lucide-react";

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
  async function handleLike() {
    try {
      const res = await fetch(`/api/post/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) return;

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }

    return (
      <button onClick={handleLike}>
        <Heart className="h-4 w-4" />
      </button>
    );
  }
}
