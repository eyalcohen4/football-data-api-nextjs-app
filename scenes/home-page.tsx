import Competitions from "@/app/competitions/page";
import CompetitionDetails from "@/components/competition-details";
import { useSearchParams } from "next/navigation";

export default function HomePage() {
  const searchParams = useSearchParams();
  const selectedCompetitionId = searchParams.get("id") || "2019";

  return (
    <div className="flex-col h-full w-full flex items-start justify-start gap-4 min-h-full flex-1">
      <Competitions selectedCompetitionId={selectedCompetitionId} />
      <div className="flex-1 min-h-full h-full">
        {selectedCompetitionId && (
          <CompetitionDetails id={selectedCompetitionId} />
        )}
      </div>
    </div>
  );
}
