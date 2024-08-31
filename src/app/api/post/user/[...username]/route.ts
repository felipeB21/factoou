import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string[] } }
) {
  try {
    if (!params.username || params.username.length === 0) {
      return NextResponse.json(
        { error: "Username not provided" },
        { status: 400 }
      );
    }

    const username = params.username[0];

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const posts = await prisma.post.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        body: true,
        createdAt: true,
        userId: true,
        _count: true,
        likes: true,
        comments: true,
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    });

    if (!posts || posts.length === 0)
      return NextResponse.json({ msg: "This user has to posts" });

    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
