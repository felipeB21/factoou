import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "../../../../../prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const postId = params.id;
  const userId = session?.user.id;

  try {
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const findPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!findPost) {
      return NextResponse.json({ msg: "Invalid post" }, { status: 404 });
    }

    if (findPost.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized action" },
        { status: 403 }
      );
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ msg: "Post deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while deleting the post" },
      { status: 500 }
    );
  }
}
