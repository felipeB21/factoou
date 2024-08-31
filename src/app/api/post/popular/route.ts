import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma";

export async function GET(req: NextRequest) {
  try {
    // Encuentra el post con el mayor número de likes recalculando los likes actuales
    const post = await prisma.post.findFirst({
      where: {
        likes: {
          some: {}, // Solo posts que tienen al menos un like
        },
      },
      orderBy: {
        likes: {
          _count: "desc", // Ordena los posts por la cantidad de likes recalculados
        },
      },
      include: {
        likes: true, // Asegúrate de incluir los likes
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
        { message: "No posts found with likes" },
        { status: 404 }
      );
    }

    const recalculatedLikes = post.likes.length;
    console.log(post);

    return NextResponse.json({
      ...post,
      _count: {
        likes: recalculatedLikes,
      },
    });
  } catch (error) {
    console.error("Error fetching post with most likes:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
