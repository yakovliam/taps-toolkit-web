import { useListIdentities } from "@/gen";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import IdentityTable from "./IdentityTable";
import { Skeleton } from "@/components/ui/skeleton";

const IdentityListPage = () => {
  const config = useAuthenticatedClientConfig();
  const { data, isPending } = useListIdentities(config);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">
          <div className="text-lg font-semibold">Identities</div>
          <p className="text-sm text-muted-foreground">
            View and manage identities.
          </p>
        </div>
        {isPending && <Skeleton className="w-full h-40" />}
        {data && <IdentityTable data={data.data} />}
      </div>
    </div>
  );
};

export default IdentityListPage;
