import { Identity, JobCreateRequest, useListIdentities } from "@/gen";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  friendlyName: z.string().nonempty(),
  description: z.string().nonempty(),
  targetFinalScore: z.coerce.number().int(),
  gameConfigId: z.string().nonempty(),
  identityId: z.string().nonempty(),
});

const JobCreatePage = () => {
  const config = useAuthenticatedClientConfig();
  const { data: identitiesData, isPending: identitiesIsPending } =
    useListIdentities({ ...config });

  const [identities, setIdentities] = useState<Identity[]>([]);

  useEffect(() => {
    if (identitiesData) {
      setIdentities(identitiesData.data);
    }
  }, [identitiesData]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      friendlyName: "",
      description: "",
      targetFinalScore: 0,
      gameConfigId: "",
      identityId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    alert(JSON.stringify(values, null, 2));
    const request: JobCreateRequest = {
      friendlyName: values.friendlyName,
      description: values.description,
      targetFinalScore: values.targetFinalScore,
      gameConfigId: values.gameConfigId,
      identityId: values.identityId,
    };

    console.log(request);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">
          <div className="text-lg font-semibold">Jobs</div>
          <p className="text-sm text-muted-foreground">Create a new job.</p>
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
                  name="identityId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Identity</FormLabel>
                      {identitiesIsPending ? (
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
                                  ? identities.find(
                                      (identity) => identity.id === field.value
                                    )?.uid
                                  : "Select identity"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search devices..." />
                              <CommandList>
                                <CommandEmpty>No devices found.</CommandEmpty>
                                <CommandGroup>
                                  {identities.map((identity) => (
                                    <CommandItem
                                      value={identity.uid}
                                      key={identity.uid}
                                      onSelect={() => {
                                        form.setValue(
                                          "identityId",
                                          identity.id
                                        );
                                      }}
                                    >
                                      {identity.uid}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          identity.uid === field.value
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
                  name="friendlyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Friendly Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="input"
                          placeholder="Enter a friendly name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="input"
                          placeholder="Enter a description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetFinalScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Final Score</FormLabel>
                      <FormControl>
                        <Input {...field} className="input" type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Create Job</Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCreatePage;
