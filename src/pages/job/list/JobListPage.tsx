import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import JobTable from "./JobTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useListJobs } from "@/gen";

const JobListPage = () => {
  const config = useAuthenticatedClientConfig();
  const { data, isPending } = useListJobs(config);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">
          <div className="text-lg font-semibold">Jobs</div>
          <p className="text-sm text-muted-foreground">View and manage jobs.</p>
        </div>
        {isPending && <Skeleton className="w-full h-40" />}
        {data && <JobTable data={data.data} />}
      </div>
    </div>
  );
};

export default JobListPage;
