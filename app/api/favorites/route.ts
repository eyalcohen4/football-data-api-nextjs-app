import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession()
  console.log(session)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { type, itemId } = await req.json()

  try {
    const favorite = await prisma.favorite.create({
      data: {
        user: {
          connect: {
            email: session.user.email,
          },
        },
        type,
        itemId: itemId.toString(),
      },
    })

    return NextResponse.json(favorite)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "An error occurred while adding the favorite." }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { type, itemId } = await req.json()

  try {
    const item = await prisma.favorite.findFirst({
      where: {
        user: {
          email: session.user.email,
        },
        type,
        itemId: itemId.toString(),
      },
    })
    
    if (!item) {
      return NextResponse.json({ error: "Favorite not found" }, { status: 404 })
    }

    console.log(item)
    await prisma.favorite.delete({
      where: {
        id: item.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "An error occurred while removing the favorite." }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await getServerSession()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        user: {
          email: session.user.email,
        }
      },
    })

    return NextResponse.json(favorites)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "An error occurred while fetching favorites." }, { status: 500 })
  }
}

