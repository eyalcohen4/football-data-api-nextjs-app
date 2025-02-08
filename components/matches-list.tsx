"use client"

import { format } from "date-fns"
import type { Match, MatchDay } from "@/types/football"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useEffect } from "react"

function MatchCard({ match }: { match: Match }) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">{format(new Date(match.utcDate), "PPP p")}</div>
        <div className="mt-2 grid grid-cols-[1fr,auto,1fr] items-center gap-4">
          <div className="flex items-center justify-end gap-2">
            <img
              src={match.homeTeam.crest || "/placeholder.svg"}
              alt={`${match.homeTeam.name} crest`}
              className="h-6 w-6"
            />
          </div>
          <div className="text-center font-mono">
            {match.status === "FINISHED" ? (
              <span className="font-bold">
                {match.score.fullTime.home} - {match.score.fullTime.away}
              </span>
            ) : (
              <span className="text-muted-foreground">vs</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <img
              src={match.awayTeam.crest || "/placeholder.svg"}
              alt={`${match.awayTeam.crest} crest`}
              className="h-8 w-8"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MatchesList({ matches }: { matches: Match[] }) {
  const matchesByDay = matches.reduce((acc: { matchday: number; matches: Match[] }[], match) => {
    const matchday = acc.find((md) => md.matchday === match.matchday)
    if (matchday) {
      matchday.matches.push(match)
    } else {
      acc.push({ matchday: match.matchday, matches: [match] })
    }
    return acc
  }, [])

  const currentMatchDay =
    matchesByDay.find((md) => md.matches.some((m) => m.status === "TIMED" || m.status === "IN_PLAY")) ||
    matchesByDay[matchesByDay.length - 1]

  useEffect(() => {
    // scroll to the current match day
    const currentMatchDayElement = document.getElementById(`matchday-${currentMatchDay?.matchday}`)
    if (currentMatchDayElement) {
      currentMatchDayElement.scrollIntoView({ behavior: "smooth" })
    }
  }, [matchesByDay])
  return (
    <Accordion
      type="single"
      className="space-y-4"
      defaultValue={`matchday-${currentMatchDay?.matchday}`}
    >
      {matchesByDay
        .sort((a, b) => a.matchday - b.matchday)
        .map((matchDay) => (
          <AccordionItem
            key={matchDay.matchday}
            value={`matchday-${matchDay.matchday}`}
            id={`matchday-${matchDay.matchday}`}
          >
            <AccordionTrigger>
              <div className="flex flex-col gap-2 items-start text-sm">
                Matchday {matchDay.matchday} {matchDay.matchday === currentMatchDay.matchday && " (Current)"}
                {matchDay.matches.slice(0, 1).map((match) => (
                  <div key={match.id} className="text-xs text-muted-foreground texfont-normal">
                    {format(new Date(match.utcDate), "PPP")}
                  </div>
                ))}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {matchDay.matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
}

