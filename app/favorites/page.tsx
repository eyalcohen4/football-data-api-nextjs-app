"use client"

import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useFavorites, useAddFavorite } from '@/lib/hooks/useQueries'

export default function Favorites() {
  const { data: session } = useSession()
  const { data: favorites, isLoading, error } = useFavorites()
  const addFavoriteMutation = useAddFavorite()

  if (!session) {
    return <div>Please sign in to view your favorites.</div>
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error occurred: {error.message}</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Your Favorites</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((favorite) => (
          <div key={favorite.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{favorite.name}</h2>
            <p>Type: {favorite.type}</p>
            <Button asChild className="mt-2">
              <Link href={`/${favorite.type}s/${favorite.itemId}`}>View Details</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

