import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const toneOptions = [
  { value: "upbeat", label: "Upbeat" },
  { value: "sarcastic", label: "Sarcastic" },
  { value: "wise", label: "Wise" },
  { value: "energetic", label: "Energetic" },
  { value: "chill", label: "Chill" },
  { value: "phuppo", label: "Phuppo" },
  { value: "gangster", label: "Gangster" },
  { value: "party", label: "Party" },
];

export default function Configuration() {
  const [botName, setBotName] = useState("Loki");
  const [botTone, setBotTone] = useState("upbeat");
  const [welcomeMessage, setWelcomeMessage] = useState("✨️˚.⭒Wᴇʟᴄᴏᴍᴇ {name}˚✨️");
  const { toast } = useToast();

  const handleSave = () => {
    console.log("Save config:", { botName, botTone, welcomeMessage });
    toast({ title: "Configuration Saved", description: "Bot configuration has been updated" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-configuration">Bot Configuration</h1>
        <p className="text-muted-foreground mt-1">Customize your bot's personality and behavior</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bot Settings</CardTitle>
            <CardDescription>Configure bot name and personality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bot-name">Bot Name</Label>
              <Input
                id="bot-name"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="Enter bot name"
                data-testid="input-bot-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bot-tone">Bot Tone</Label>
              <Select value={botTone} onValueChange={setBotTone}>
                <SelectTrigger id="bot-tone" data-testid="select-bot-tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((tone) => (
                    <SelectItem key={tone.value} value={tone.value}>
                      {tone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="welcome-message">Welcome Message</Label>
              <Input
                id="welcome-message"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                placeholder="Use {name} for user's name"
                data-testid="input-welcome-message"
              />
              <p className="text-xs text-muted-foreground">Use {"{name}"} to insert the user's name</p>
            </div>
            <Button onClick={handleSave} className="w-full" data-testid="button-save-config">
              Save Configuration
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>See how your settings will look</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Bot Name</p>
              <p className="text-lg font-semibold" data-testid="preview-bot-name">{botName || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Bot Tone</p>
              <p className="text-lg font-semibold capitalize" data-testid="preview-bot-tone">{botTone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Welcome Message Example</p>
              <p className="text-base font-medium" data-testid="preview-welcome-message">
                {welcomeMessage.replace("{name}", "John Doe")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
