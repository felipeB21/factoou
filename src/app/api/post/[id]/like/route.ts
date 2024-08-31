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

    if (!userId) return NextResponse.redirect("/login");
    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    });

    if (existingLike) {
      await prisma.postLike.delete({
        where: {
          userId_postId: {
            userId: userId,
            postId: postId,
          },
        },
      });

      return NextResponse.json(
        { message: "Post unliked successfully" },
        { status: 200 }
      );
    } else {
      await prisma.postLike.create({
        data: {
          userId: userId,
          postId: postId,
        },
      });

      return NextResponse.json(
        { message: "Post liked successfully" },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error processing like:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
