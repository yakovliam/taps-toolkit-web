import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import { Device, useListDevices, useStartImportSession } from "@/gen";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  phone: z.string().min(10).max(14),
  deviceUid: z.string(),
});

const IdentityImportPage = () => {
  const navigate = useNavigate();
  const config = useAuthenticatedClientConfig();
  const { mutate: startImportSession } = useStartImportSession({ ...config });
  const { data, isLoading } = useListDevices({ ...config });
  const [devices, setDevices] = useState<Device[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      deviceUid: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const phoneNumber = values.phone;
    const deviceUid = values.deviceUid;

    startImportSession(
      { data: { phone: phoneNumber, deviceUid: deviceUid } },
      {
        onSuccess: () => {
          navigate("/identity/import/otp");
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
          });
        },
      }
    );
  }

  useEffect(() => {
    if (data?.data) {
      setDevices(data.data);
    }
  }, [data]);

  useEffect(() => {
    console.log(devices);
  }, [devices]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">
          <div className="text-lg font-semibold">Import Identity</div>
          <p className="text-sm text-muted-foreground">
            Import an identity via phone number.
          </p>
        </div>

        <div className="flex flex-col items-start justify-center">
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="deviceUid"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Device</FormLabel>
                      {isLoading ? (
                        <Spinner />
                      ) : (
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? devices.find(
                                      (device) =>
                                        device.deviceUid === field.value
                                    )?.deviceUid
                                  : "Select device"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search devices..." />
                              <CommandList>
                                <CommandEmpty>No devices found.</CommandEmpty>
                                <CommandGroup>
                                  {devices.map((device) => (
                                    <CommandItem
                                      value={device.deviceUid}
                                      key={device.deviceUid}
                                      onSelect={() => {
                                        form.setValue(
                                          "deviceUid",
                                          device.deviceUid
                                        );
                                      }}
                                    >
                                      {device.deviceUid}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          device.deviceUid === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Import</Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityImportPage;
