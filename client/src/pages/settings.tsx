import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

const settingsSchema = z.object({
  allowAvatars: z.boolean(),
  allowGuestIds: z.boolean(),
  banLevel: z.coerce.number().min(1).max(100),
});

type Settings = z.infer<typeof settingsSchema>;

interface SettingsResponse {
  success: boolean;
  data: Settings & {
    createdAt?: string;
    updatedAt?: string;
  };
}

export default function Settings() {
  const { toast } = useToast();

  const { data, isLoading, isError } = useQuery<SettingsResponse>({
    queryKey: ["/api/settings"],
  });

  const form = useForm<Settings>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      allowAvatars: data?.data.allowAvatars ?? true,
      allowGuestIds: data?.data.allowGuestIds ?? false,
      banLevel: data?.data.banLevel ?? 10,
    },
    values: data?.data ? {
      allowAvatars: data.data.allowAvatars,
      allowGuestIds: data.data.allowGuestIds,
      banLevel: data.data.banLevel,
    } : undefined,
  });

  const saveMutation = useMutation({
    mutationFn: async (values: Settings) => {
      return await apiRequest("PUT", "/api/settings", values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: Settings) => {
    saveMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-settings">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure club and moderation settings</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading settings...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-settings">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure club and moderation settings</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-destructive">Failed to load settings. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-settings">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure club and moderation settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Club Settings</CardTitle>
          <CardDescription>Manage club permissions and restrictions</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="allowAvatars"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-allow-avatars"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Allow Avatars</FormLabel>
                      <FormDescription>
                        Enable or disable avatar display for members
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allowGuestIds"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-allow-guest-ids"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Allow Guest IDs</FormLabel>
                      <FormDescription>
                        Permit guest accounts to join the club
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="banLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auto-Ban Level Threshold</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        data-testid="input-ban-level"
                      />
                    </FormControl>
                    <FormDescription>
                      Members below this level will be auto-banned
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={saveMutation.isPending}
                data-testid="button-save-settings"
              >
                <Save className="mr-2 h-4 w-4" />
                {saveMutation.isPending ? "Saving..." : "Save Settings"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
