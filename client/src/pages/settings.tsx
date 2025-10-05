import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [allowAvatars, setAllowAvatars] = useState(true);
  const [allowGuestIds, setAllowGuestIds] = useState(false);
  const [banLevel, setBanLevel] = useState(10);
  const { toast } = useToast();

  const handleSave = () => {
    console.log("Save settings:", { allowAvatars, allowGuestIds, banLevel });
    toast({ title: "Settings Saved", description: "Your settings have been updated" });
  };

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
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-avatars">Allow Avatars</Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable avatar display for members
              </p>
            </div>
            <Switch
              id="allow-avatars"
              checked={allowAvatars}
              onCheckedChange={setAllowAvatars}
              data-testid="switch-allow-avatars"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-guest-ids">Allow Guest IDs</Label>
              <p className="text-sm text-muted-foreground">
                Permit guest accounts to join the club
              </p>
            </div>
            <Switch
              id="allow-guest-ids"
              checked={allowGuestIds}
              onCheckedChange={setAllowGuestIds}
              data-testid="switch-allow-guest-ids"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ban-level">Auto-Ban Level Threshold</Label>
            <div className="flex items-center gap-4">
              <Input
                id="ban-level"
                type="number"
                value={banLevel}
                onChange={(e) => setBanLevel(parseInt(e.target.value) || 0)}
                min={1}
                max={100}
                className="w-32"
                data-testid="input-ban-level"
              />
              <p className="text-sm text-muted-foreground">
                Members below level {banLevel} will be auto-banned
              </p>
            </div>
          </div>

          <Button onClick={handleSave} data-testid="button-save-settings">
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
