import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

//todo: remove mock functionality
const initialSpamWords = "spam\nscam\nfake\nphishing\nclick here\nfree money\nwin now";
const initialBannedPatterns = ["http://", "bit.ly", "discord.gg"];
const initialAdmins = ["Admin1", "Admin2", "Admin3"];

export default function Protection() {
  const [spamWords, setSpamWords] = useState(initialSpamWords);
  const [bannedPatterns, setBannedPatterns] = useState(initialBannedPatterns);
  const [admins, setAdmins] = useState(initialAdmins);
  const [newPattern, setNewPattern] = useState("");
  const [newAdmin, setNewAdmin] = useState("");
  const { toast } = useToast();

  const handleSaveSpamWords = () => {
    console.log("Save spam words:", spamWords);
    toast({ title: "Spam Words Saved", description: "Spam word list has been updated" });
  };

  const addPattern = () => {
    if (newPattern.trim()) {
      setBannedPatterns([...bannedPatterns, newPattern.trim()]);
      setNewPattern("");
      toast({ title: "Pattern Added", description: `"${newPattern}" has been added to banned patterns` });
    }
  };

  const removePattern = (pattern: string) => {
    setBannedPatterns(bannedPatterns.filter(p => p !== pattern));
    toast({ title: "Pattern Removed", description: `"${pattern}" has been removed` });
  };

  const addAdmin = () => {
    if (newAdmin.trim()) {
      setAdmins([...admins, newAdmin.trim()]);
      setNewAdmin("");
      toast({ title: "Admin Added", description: `"${newAdmin}" has been added as admin` });
    }
  };

  const removeAdmin = (admin: string) => {
    setAdmins(admins.filter(a => a !== admin));
    toast({ title: "Admin Removed", description: `"${admin}" has been removed` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-protection">Protection</h1>
        <p className="text-muted-foreground mt-1">Manage spam filters and security settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spam Words</CardTitle>
            <CardDescription>One word per line (supports thousands of words)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="spam-words-textarea">Spam Word List</Label>
              <Textarea
                id="spam-words-textarea"
                placeholder="Enter spam words, one per line..."
                value={spamWords}
                onChange={(e) => setSpamWords(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
                data-testid="textarea-spam-words"
              />
              <p className="text-xs text-muted-foreground">
                {spamWords.split('\n').filter(w => w.trim()).length} words configured
              </p>
            </div>
            <Button onClick={handleSaveSpamWords} className="w-full" data-testid="button-save-spam-words">
              Save Spam Words
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Banned Patterns</CardTitle>
            <CardDescription>URL patterns to block</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add pattern..."
                value={newPattern}
                onChange={(e) => setNewPattern(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPattern()}
                data-testid="input-banned-pattern"
              />
              <Button onClick={addPattern} size="icon" data-testid="button-add-pattern">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {bannedPatterns.map((pattern) => (
                <Badge key={pattern} variant="secondary" className="gap-1" data-testid={`pattern-${pattern}`}>
                  {pattern}
                  <button onClick={() => removePattern(pattern)} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Administrators</CardTitle>
            <CardDescription>Users with admin privileges</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add admin username..."
                value={newAdmin}
                onChange={(e) => setNewAdmin(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addAdmin()}
                data-testid="input-admin"
              />
              <Button onClick={addAdmin} size="icon" data-testid="button-add-admin">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {admins.map((admin) => (
                <Badge key={admin} variant="default" className="gap-1" data-testid={`admin-${admin}`}>
                  {admin}
                  <button onClick={() => removeAdmin(admin)} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
