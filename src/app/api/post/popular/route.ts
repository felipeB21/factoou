import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma";

export async function GET(req: NextRequest) {
  try {
    // Get today's date
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    // Fetch the post with most likes for today
    const post = await prisma.post.findFirst({
      where: {
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      orderBy: [
        {
          likes: {
            _count: "desc",
          },
        },
        {
          createdAt: "asc",
        },
      ],
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
