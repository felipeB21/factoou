import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma";

export async function GET(req: NextRequest) {
  try {
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1); // Include entire day

    const post = await prisma.post.findFirst({
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      orderBy: {
        likes: {
          _count: "desc",
        },
      },
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
        user: {
          select: {
            id: true,
            image: true,
            username: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { message: "No posts found today" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post with most likes today:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
