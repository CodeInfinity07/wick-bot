import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

const botConfigSchema = z.object({
  botName: z.string().min(1, "Bot name is required").max(50, "Bot name too long"),
  botTone: z.enum(["upbeat", "sarcastic", "wise", "energetic", "chill", "phuppo", "gangster", "party"]),
  welcomeMessage: z.string().min(1, "Welcome message is required").max(200, "Welcome message too long"),
});

type BotConfig = z.infer<typeof botConfigSchema>;

interface BotConfigResponse {
  success: boolean;
  data: BotConfig & {
    createdAt?: string;
    updatedAt?: string;
  };
}

export default function Configuration() {
  const { toast } = useToast();

  const { data, isLoading, isError } = useQuery<BotConfigResponse>({
    queryKey: ["/api/config/bot"],
  });

  const form = useForm<BotConfig>({
    resolver: zodResolver(botConfigSchema),
    defaultValues: {
      botName: data?.data.botName || "",
      botTone: data?.data.botTone || "upbeat",
      welcomeMessage: data?.data.welcomeMessage || "",
    },
    values: data?.data ? {
      botName: data.data.botName,
      botTone: data.data.botTone,
      welcomeMessage: data.data.welcomeMessage,
    } : undefined,
  });

  const saveMutation = useMutation({
    mutationFn: async (values: BotConfig) => {
      return await apiRequest("PUT", "/api/config/bot", values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/config/bot"] });
      toast({
        title: "Success",
        description: "Bot configuration saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: BotConfig) => {
    saveMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-configuration">Configuration</h1>
          <p className="text-muted-foreground mt-1">Configure bot settings and behavior</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading configuration...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-configuration">Configuration</h1>
          <p className="text-muted-foreground mt-1">Configure bot settings and behavior</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-destructive">Failed to load configuration. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-configuration">Configuration</h1>
        <p className="text-muted-foreground mt-1">Configure bot settings and behavior</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bot Settings</CardTitle>
          <CardDescription>Configure bot name and personality</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="botName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bot Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="RexBot"
                        {...field}
                        data-testid="input-bot-name"
                      />
                    </FormControl>
                    <FormDescription>
                      The name of your bot
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="botTone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bot Tone</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-bot-tone">
                          <SelectValue placeholder="Select a tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="upbeat">Upbeat</SelectItem>
                        <SelectItem value="sarcastic">Sarcastic</SelectItem>
                        <SelectItem value="wise">Wise</SelectItem>
                        <SelectItem value="energetic">Energetic</SelectItem>
                        <SelectItem value="chill">Chill</SelectItem>
                        <SelectItem value="phuppo">Phuppo</SelectItem>
                        <SelectItem value="gangster">Gangster</SelectItem>
                        <SelectItem value="party">Party</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The personality style of your bot
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="welcomeMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Welcome Message</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="✨️˚.⭒Wᴇʟᴄᴏᴍᴇ {name}˚✨️"
                        {...field}
                        data-testid="input-welcome-message"
                      />
                    </FormControl>
                    <FormDescription>
                      Use {"{name}"} to insert the user's name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={saveMutation.isPending}
                data-testid="button-save-config"
              >
                <Save className="mr-2 h-4 w-4" />
                {saveMutation.isPending ? "Saving..." : "Save Configuration"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
