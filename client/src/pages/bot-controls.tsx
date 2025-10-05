import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Square, RotateCw, Trash2, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

interface BotStatus {
  isRunning: boolean;
  lastStarted: string | null;
  lastStopped: string | null;
  cacheCleared: string | null;
  uptime: number;
}

interface BotStatusResponse {
  success: boolean;
  data: BotStatus;
}

export default function BotControls() {
  const { toast } = useToast();

  const { data, isLoading, isError } = useQuery<BotStatusResponse>({
    queryKey: ["/api/jack/status"],
    refetchInterval: 5000,
  });

  const startMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/jack/restart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jack/status"] });
      toast({
        title: "Bot Started",
        description: "The bot has been started successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to start bot",
        variant: "destructive",
      });
    },
  });

  const stopMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/jack/restart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jack/status"] });
      toast({
        title: "Bot Stopped",
        description: "The bot has been stopped successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to stop bot",
        variant: "destructive",
      });
    },
  });

  const restartMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/jack/restart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jack/status"] });
      toast({
        title: "Bot Restarted",
        description: "The bot has been restarted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to restart bot",
        variant: "destructive",
      });
    },
  });

  const clearCacheMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/jack/clear-cache");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jack/status"] });
      toast({
        title: "Cache Cleared",
        description: "Bot cache has been cleared successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to clear cache",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-bot-controls">Bot Controls</h1>
          <p className="text-muted-foreground mt-1">Manage bot operations</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading bot status...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-bot-controls">Bot Controls</h1>
          <p className="text-muted-foreground mt-1">Manage bot operations</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-destructive">Failed to load bot status. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const botStatus = data?.data;
  const isRunning = botStatus?.isRunning;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-bot-controls">Bot Controls</h1>
        <p className="text-muted-foreground mt-1">Manage bot operations</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                <CardTitle>Bot Status</CardTitle>
              </div>
              <Badge
                variant={isRunning ? "default" : "secondary"}
                data-testid="badge-bot-status"
              >
                {isRunning ? "Running" : "Stopped"}
              </Badge>
            </div>
            <CardDescription>Current operational status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {botStatus?.lastStarted && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Started:</span>
                  <span data-testid="text-last-started">
                    {formatDistanceToNow(new Date(botStatus.lastStarted), { addSuffix: true })}
                  </span>
                </div>
              )}
              {botStatus?.lastStopped && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Stopped:</span>
                  <span data-testid="text-last-stopped">
                    {formatDistanceToNow(new Date(botStatus.lastStopped), { addSuffix: true })}
                  </span>
                </div>
              )}
              {botStatus?.cacheCleared && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cache Cleared:</span>
                  <span data-testid="text-cache-cleared">
                    {formatDistanceToNow(new Date(botStatus.cacheCleared), { addSuffix: true })}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Control Panel</CardTitle>
            <CardDescription>Start, stop, or manage the bot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => startMutation.mutate()}
                disabled={isRunning || startMutation.isPending}
                className="w-full"
                data-testid="button-start-bot"
              >
                <Play className="mr-2 h-4 w-4" />
                Start
              </Button>
              <Button
                onClick={() => stopMutation.mutate()}
                disabled={!isRunning || stopMutation.isPending}
                variant="destructive"
                className="w-full"
                data-testid="button-stop-bot"
              >
                <Square className="mr-2 h-4 w-4" />
                Stop
              </Button>
              <Button
                onClick={() => restartMutation.mutate()}
                disabled={restartMutation.isPending}
                variant="secondary"
                className="w-full"
                data-testid="button-restart-bot"
              >
                <RotateCw className="mr-2 h-4 w-4" />
                Restart
              </Button>
              <Button
                onClick={() => clearCacheMutation.mutate()}
                disabled={clearCacheMutation.isPending}
                variant="outline"
                className="w-full"
                data-testid="button-clear-cache"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Cache
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About Bot Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Start:</strong> Activates the bot and begins monitoring chat activity.
          </p>
          <p>
            <strong>Stop:</strong> Deactivates the bot temporarily. All settings are preserved.
          </p>
          <p>
            <strong>Restart:</strong> Stops and immediately restarts the bot. Useful for applying configuration changes.
          </p>
          <p>
            <strong>Clear Cache:</strong> Clears temporary data and cache. The bot will rebuild its cache automatically.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
