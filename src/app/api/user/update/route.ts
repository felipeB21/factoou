import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma";
import { auth } from "../../../../../auth";

export async function PUT(req: NextRequest) {
  const session = await auth();
  const { username } = await req.json();
  try {
    if (!session) {
      return NextResponse.json(
        {
          msg: "No session, Sign in first",
        },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user)
      return NextResponse.json({ msg: "User not found" }, { status: 404 });

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { msg: "Username already taken" },
        { status: 409 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { username },
    });

    return NextResponse.json(
      { msg: "Username updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { msg: "An error occurred", error: (error as Error).message },
      { status: 500 }
    );
  }
}
