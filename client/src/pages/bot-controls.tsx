import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Power } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function BotControls() {
  const [isRunning, setIsRunning] = useState(true);
  const { toast } = useToast();

  const handleStart = () => {
    console.log("Start bot triggered");
    setIsRunning(true);
    toast({ title: "Bot Started", description: "The bot is now running" });
  };

  const handleStop = () => {
    console.log("Stop bot triggered");
    setIsRunning(false);
    toast({ title: "Bot Stopped", description: "The bot has been stopped" });
  };

  const handleRestart = () => {
    console.log("Restart bot triggered");
    toast({ title: "Bot Restarting", description: "The bot is restarting..." });
  };

  const handleDisconnect = () => {
    console.log("Disconnect bot triggered");
    toast({ title: "Bot Disconnected", description: "The bot has been disconnected" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-bot-controls">Bot Controls</h1>
        <p className="text-muted-foreground mt-1">Manage bot operations and connections</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bot Status</CardTitle>
            <CardDescription>Current operational status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-6">
              <div className={`h-3 w-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-lg font-semibold" data-testid="text-bot-status">
                {isRunning ? "Running" : "Stopped"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleStart}
                disabled={isRunning}
                variant="default"
                className="w-full"
                data-testid="button-start-bot"
              >
                <Play className="mr-2 h-4 w-4" />
                Start
              </Button>
              <Button
                onClick={handleStop}
                disabled={!isRunning}
                variant="destructive"
                className="w-full"
                data-testid="button-stop-bot"
              >
                <Pause className="mr-2 h-4 w-4" />
                Stop
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bot Actions</CardTitle>
            <CardDescription>Quick control actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handleRestart}
              variant="outline"
              className="w-full"
              data-testid="button-restart-bot"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Restart Bot
            </Button>
            <Button
              onClick={handleDisconnect}
              variant="outline"
              className="w-full"
              data-testid="button-disconnect-bot"
            >
              <Power className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
