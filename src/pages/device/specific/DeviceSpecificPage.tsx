import { Skeleton } from "@/components/ui/skeleton";
import { useGetDevice } from "@/gen";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import { toast } from "@/hooks/use-toast";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Map, Marker } from "@vis.gl/react-maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const formSchema = z.object({
  uid: z.string().min(1),
  deviceToken: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

const DeviceSpecificPage = () => {
  const { id } = useParams<{ id: string }>();
  const config = useAuthenticatedClientConfig();
  const { data, isPending, isError, error } = useGetDevice(id || "", {
    ...config,
  });

  useEffect(() => {
    if (isError) {
      toast({
        variant: "destructive",
        description: `Error fetching device ${id}: ${error.message}`,
      });
    }
  }, [isError, error, id]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uid: "",
      deviceToken: "",
      latitude: 0,
      longitude: 0,
    },
  });

  useEffect(() => {
    if (data) {
      form.setValue("uid", data.data.uid);
      form.setValue("deviceToken", data.data.deviceToken);
      form.setValue("latitude", data.data.latitude);
      form.setValue("longitude", data.data.longitude);
    }
  }, [data, form]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = (_values: z.infer<typeof formSchema>) => {
    // TODO: allow editing
    toast({
      variant: "destructive",
      description: `Editing devices is not yet supported`,
    });
  };

  const popup = useMemo(() => {
    return new maplibregl.Popup().setText("This Device");
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">
          <div className="text-lg font-semibold">Device</div>
          <p className="text-sm text-muted-foreground">
            View and manage the device with Device ID {id}
          </p>
        </div>
        {isPending && <Skeleton className="w-full h-40" />}
        {data && !isPending && (
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="uid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UID</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deviceToken"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Device Token</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col gap-4">
                    <Map
                      initialViewState={{
                        longitude: data.data.longitude,
                        latitude: data.data.latitude,
                        zoom: 8,
                      }}
                      style={{ width: 600, height: 400 }}
                      mapStyle="https://tiles.openfreemap.org/styles/liberty"
                    >
                      <Marker
                        longitude={data.data.longitude}
                        latitude={data.data.latitude}
                        anchor="bottom"
                        color="red"
                        popup={popup}
                      />
                    </Map>
                  </div>

                  <Button type="submit" disabled>
                    Save
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceSpecificPage;
