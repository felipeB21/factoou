import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma";
import { auth } from "../../../../auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        {
          msg: "No session, Sign in to post a factoou",
        },
        { status: 401 }
      );
    }

    const { body } = await req.json();

    if (typeof body !== "string") {
      return NextResponse.json(
        {
          msg: "Body must be a string",
        },
        { status: 400 }
      );
    }

    if (body.trim().length === 0) {
      return NextResponse.json(
        {
          msg: "Body can't be empty",
        },
        { status: 400 }
      );
    }

    if (body.length < 1 || body.length > 320) {
      return NextResponse.json(
        {
          msg: "Body must be between 1 and 320 characters",
        },
        { status: 400 }
      );
    }

    const newPost = await prisma.post.create({
      data: {
        body,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return NextResponse.json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      {
        msg: "An error occurred while creating the post.",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        body: true,
        createdAt: true,
        userId: true,
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!posts) return NextResponse.json({ msg: "No posts founded" });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error finding posts:", error);
    return NextResponse.json(
      {
        msg: "An error occurred while fetching the post.",
      },
      { status: 500 }
    );
  }
}
