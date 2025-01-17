import { useListDevices } from "@/gen";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import DeviceTable from "./DeviceTable";
import { Skeleton } from "@/components/ui/skeleton";

const DeviceListPage = () => {
  const config = useAuthenticatedClientConfig();
  const { data, isPending } = useListDevices(config);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">
          <div className="text-lg font-semibold">Devices</div>
          <p className="text-sm text-muted-foreground">
            View and manage devices.
          </p>
        </div>
        {isPending && <Skeleton className="w-full h-40" />}
        {data && <DeviceTable data={data.data} />}
      </div>
    </div>
  );
};

export default DeviceListPage;
