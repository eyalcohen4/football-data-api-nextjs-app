"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import clsx from "clsx"
import { useSearchParams, useRouter } from "next/navigation"
import { useRef } from "react"
import { useEffect } from "react"
import { useFavorites } from "@/components/favorites-provider"


export default function Competitions({
  selectedCompetitionId
}: {
  selectedCompetitionId: string
}) {
  const router = useRouter()
  const { data: session } = useSession()

  const selectedRef = useRef<HTMLDivElement>(null)
  const { data: competitions, isLoading, error } = useQuery({
    queryKey: ["competitions"],
    queryFn: async () => {
      const response = await fetch("/api/competitions")
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      return response.json()
    },
  })

  const { addFavorite, removeFavorite, favorites } = useFavorites()

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedCompetitionId]);

  return (
    <div className="overflow-hidden max-w-full">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {competitions?.map((competition) => (
          <Link
            href={`/?id=${competition.id}`}
            key={competition.id}
          >
            <div
              className={clsx(
                "flex items-center gap-2 bg-background border rounded-full px-3 py-1.5 hover:bg-muted-foreground/10 min-w-max",
                {
                  "bg-purple-800":
                    `${competition.id}` === `${selectedCompetitionId}`,
                }
              )}
            >
              <Image
                src={competition.emblem}
                alt={competition.name}
                className="h-6 w-6"
                width={24}
                height={24}
              />
              <span className="text-sm font-medium">{competition.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0.5 ml-1"
                onClick={(e) => {
                  e.preventDefault();
                  if (!session) {
                    const currentSearchParams = new URLSearchParams(window.location.search)
                    currentSearchParams.set("showSignIn", "true")
                    router.push(`/?${currentSearchParams.toString()}`);
                    return;
                  }
                  
                  favorites.some(i => i.itemId === competition.id.toString())
                    ? removeFavorite(competition.id.toString())
                    : addFavorite(competition.id.toString());
                }}
              >
                <Star
                  className={`h-4 w-4 ${
                    favorites.some(i => i.itemId === competition.id.toString()) ? "fill-yellow-400" : ""
                  }`}
                />
              </Button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


function areaToEmoji(area: string) {
  switch (area) {
    case "England":
      return "🏴󠁧󠁢󠁥󠁮󠁧󠁿󠁩󠁮󠁲󠁱󠁫󠁭󠁓󠁮󠁝󠁮󠁥󠁮󠁲󠁿"
    case "Spain":
      return "🇪🇺"
    case "Germany":
      return "🇩🇪"
    case "France":
      return "🇫🇷"
    case "Italy":
      return "🇮🇹"
    case "Netherlands":
      return "🇳🇱"
    case "Portugal":
      return "🇵🇹" 
    case "Turkey":
      return "🇹🇷"
    case "Greece":
      return "🇬🇷"
    case "Belgium":
      return "🇧🇪"
    case "Sweden":
      return "🇸🇪"
    case "South America":
      return "🌎"
    case "World":
      return "🌏"
    case "Europe":
      return "🌏";
    case "Brazil":
      return "🇧🇷"
    case "Argentina":
      return "🇦🇷"
    case "Chile":
      return "🇨🇱"

      
  }
}