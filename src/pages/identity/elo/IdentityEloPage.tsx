import { Card, CardContent } from "@/components/ui/card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Skeleton } from "@/components/ui/skeleton";
import { useCalculateElo } from "@/gen";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import { useParams } from "react-router";

const IdentityEloPage = () => {
  const { id } = useParams<{ id: string }>();
  const config = useAuthenticatedClientConfig();
  const { data, isPending } = useCalculateElo(id || "", { ...config });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-8 p-4">
        <div className="flex flex-col gap-1">
          <div className="text-lg font-semibold">ELO Calculator</div>
          <p className="text-sm text-muted-foreground">
            ELO calculator for identity with ID {id}
          </p>
        </div>
        {isPending && <Skeleton className="w-full h-40" />}
        <div className="flex flex-col gap-4 justify-center items-center">
          <Card className="p-8 w-full">
            <CardContent className="p-0 flex flex-col items-center justify-center gap-4">
              <p className="whitespace-pre-wrap text-8xl font-medium tracking-tighter text-black dark:text-white">
                <NumberTicker value={data?.data.elo ?? 0} decimalPlaces={2} />
              </p>
              <p className="text-sm text-muted-foreground">Estimated ELO</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IdentityEloPage;
