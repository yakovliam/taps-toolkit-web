import { Skeleton } from "@/components/ui/skeleton";
import { useGetIdentity } from "@/gen";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  uid: z.string().min(1),
  deviceUid: z.string().min(1),
  usdBalance: z.number().min(0),
  gemsBalance: z.number().min(0),
  isBanned: z.boolean(),
  isDeleted: z.boolean(),
});

const IdentitySpecificPage = () => {
  const { id } = useParams<{ id: string }>();
  const config = useAuthenticatedClientConfig();
  const { data, isPending, isError, error } = useGetIdentity(id || "", {
    ...config,
  });

  useEffect(() => {
    if (isError) {
      toast({
        variant: "destructive",
        description: `Error fetching identity ${id}: ${error.message}`,
      });
    }
  }, [isError, error, id]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uid: "",
      deviceUid: "",
      usdBalance: 0,
      gemsBalance: 0,
      isBanned: false,
      isDeleted: false,
    },
  });

  useEffect(() => {
    if (data) {
      form.setValue("uid", data.data.uid);
      form.setValue("deviceUid", data.data.deviceUid);
      form.setValue("usdBalance", data.data.usdBalance);
      form.setValue("gemsBalance", data.data.gemsBalance);
      form.setValue("isBanned", data.data.isBanned);
      form.setValue("isDeleted", data.data.isDeleted);
    }
  }, [data, form]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = (_values: z.infer<typeof formSchema>) => {
    // TODO: allow editing
    toast({
      variant: "destructive",
      description: `Editing identities is not yet supported`,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">
          <div className="text-lg font-semibold">Identity</div>
          <p className="text-sm text-muted-foreground">
            View and manage the identity with ID {id}.
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
                    name="deviceUid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Device UID</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="usdBalance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>USD Balance</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gemsBalance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gems Balance</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isBanned"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Banned</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isDeleted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Deleted</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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

export default IdentitySpecificPage;
