import Competitions from "@/app/competitions/page";
import CompetitionDetails from "@/components/competition-details";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function TeamPage() {
  const searchParams = useSearchParams();
  const selectedTeam = searchParams.get("id") || "2019";

  const { data: team } = useQuery({
    queryKey: ["team", selectedTeam],
    queryFn: () => fetch(`/api/teams/${selectedTeam}`).then((res) => res.json()),
  });

  console.log(team);
  return (
    <div className="flex-col h-full w-full flex items-start justify-start gap-4 min-h-full flex-1">
      
      
    </div>
  );
}
