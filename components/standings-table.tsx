"use client";

import { Star, StarOff } from "lucide-react";
import type { Standing } from "@/types/football";
import { useFavorites } from "./favorites-provider";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function StandingsTable({ standings }: { standings: Standing[] }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">Pos</TableHead>
          <TableHead>Team</TableHead>
          <TableHead className="text-center">MP</TableHead>
          <TableHead className="text-center">W</TableHead>
          <TableHead className="text-center">D</TableHead>
          <TableHead className="text-center">L</TableHead>
          <TableHead className="text-center">GF</TableHead>
          <TableHead className="text-center">GA</TableHead>
          <TableHead className="text-center">GD</TableHead>
          <TableHead className="text-center">Pts</TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {standings?.map((standing) => (
          <TableRow key={standing.team.id}>
            <TableCell>{standing.position}</TableCell>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2 text-nowrap">
                <img
                  src={standing.team.crest || "/placeholder.svg"}
                  alt={`${standing.team.name} crest`}
                  className="h-6 w-6"
                />
                {standing.team.name}
              </div>
            </TableCell>
            <TableCell className="text-center">
              {standing.playedGames}
            </TableCell>
            <TableCell className="text-center">{standing.won}</TableCell>
            <TableCell className="text-center">{standing.draw}</TableCell>
            <TableCell className="text-center">{standing.lost}</TableCell>
            <TableCell className="text-center">{standing.goalsFor}</TableCell>
            <TableCell className="text-center">
              {standing.goalsAgainst}
            </TableCell>
            <TableCell className="text-center">
              {standing.goalDifference}
            </TableCell>
            <TableCell className="text-center font-bold">
              {standing.points}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (isFavorite(standing.team.id.toString())) {
                    removeFavorite(standing.team.id.toString());
                  } else {
                    addFavorite(standing.team.id.toString());
                  }
                }}
              >
                  <Star
                  className={`h-4 w-4 ${
                    isFavorite(standing.team.id.toString()) ? "fill-yellow-400" : ""
                  }`}
                />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
