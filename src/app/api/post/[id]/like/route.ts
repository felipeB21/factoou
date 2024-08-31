import { NextResponse } from "next/server";
import { prisma } from "../../../../../../prisma";
import { auth } from "../../../../../../auth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  try {
    const postId = params.id;
    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    });

    let isLiked: boolean;
    if (existingLike) {
      await prisma.postLike.delete({
        where: {
          userId_postId: {
            userId: userId,
            postId: postId,
          },
        },
      });
      isLiked = false;
    } else {
      await prisma.postLike.create({
        data: {
          userId: userId,
          postId: postId,
        },
      });
      isLiked = true;
    }

    const likeCount = await prisma.postLike.count({
      where: { postId: postId },
    });

    return NextResponse.json(
      {
        message: isLiked
          ? "Post liked successfully"
          : "Post unliked successfully",
        isLiked: isLiked,
        likeCount: likeCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing like:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
