import { NextResponse } from "next/server";
import { auth } from "../../../../../../../auth";
import { prisma } from "../../../../../../../prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const userId = session?.user?.id;

  try {
    const postId = params.id;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        likes: {
          where: {
            userId: userId || undefined,
          },
        },
        _count: {
          select: { likes: true },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      isLiked: post.likes.length > 0,
      likeCount: post._count.likes,
    });
  } catch (error) {
    console.error("Error fetching like status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
