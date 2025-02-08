"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StandingsTable } from "@/components/standings-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { MatchesList } from "@/components/matches-list"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function CompetitionDetails({ id }: { id: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["competition", id],
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache is k
    queryFn: async () => {
      const response = await fetch(`/api/competitions?id=${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch competition data");
      }
      return response.json();
    },
  });

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="max-h-full w-full">
      <div className="flex flex-col gap-4 max-h-full md:flex-row">
        <Card className="w-full flex-1 p-0">
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-200px)] p-0">
              <StandingsTable standings={data?.standings?.standings[0].table} />
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-200px)] w-full p-0">
              <MatchesList matches={data?.fixtures?.matches || []} />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
