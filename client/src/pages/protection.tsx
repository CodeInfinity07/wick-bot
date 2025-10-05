import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Save, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface ProtectionData {
  success: boolean;
  data: string[];
}

export default function Protection() {
  const { toast } = useToast();

  const { data: spamWordsData, isLoading: spamLoading, isError: spamError } = useQuery<ProtectionData>({
    queryKey: ["/api/protection/spam-words"],
  });

  const { data: bannedPatternsData, isLoading: patternsLoading, isError: patternsError } = useQuery<ProtectionData>({
    queryKey: ["/api/protection/banned-patterns"],
  });

  const { data: adminsData, isLoading: adminsLoading, isError: adminsError } = useQuery<ProtectionData>({
    queryKey: ["/api/protection/admins"],
  });

  const [spamWords, setSpamWords] = useState("");
  const [bannedPatterns, setBannedPatterns] = useState("");
  const [admins, setAdmins] = useState("");

  useEffect(() => {
    if (spamWordsData?.data) {
      setSpamWords(spamWordsData.data.join("\n"));
    }
  }, [spamWordsData]);

  useEffect(() => {
    if (bannedPatternsData?.data) {
      setBannedPatterns(bannedPatternsData.data.join(", "));
    }
  }, [bannedPatternsData]);

  useEffect(() => {
    if (adminsData?.data) {
      setAdmins(adminsData.data.join(", "));
    }
  }, [adminsData]);

  const saveSpamWordsMutation = useMutation({
    mutationFn: async (words: string[]) => {
      return await apiRequest("PUT", "/api/protection/spam-words", { words });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/protection/spam-words"] });
      toast({
        title: "Success",
        description: "Spam words saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save spam words",
        variant: "destructive",
      });
    },
  });

  const saveBannedPatternsMutation = useMutation({
    mutationFn: async (patterns: string[]) => {
      return await apiRequest("PUT", "/api/protection/banned-patterns", { patterns });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/protection/banned-patterns"] });
      toast({
        title: "Success",
        description: "Banned patterns saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save banned patterns",
        variant: "destructive",
      });
    },
  });

  const saveAdminsMutation = useMutation({
    mutationFn: async (adminList: string[]) => {
      return await apiRequest("PUT", "/api/protection/admins", { admins: adminList });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/protection/admins"] });
      toast({
        title: "Success",
        description: "Admins saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save admins",
        variant: "destructive",
      });
    },
  });

  const handleSaveSpamWords = (e: React.FormEvent) => {
    e.preventDefault();
    const words = spamWords
      .split("\n")
      .map((w) => w.trim())
      .filter((w) => w !== "");
    saveSpamWordsMutation.mutate(words);
  };

  const handleSaveBannedPatterns = (e: React.FormEvent) => {
    e.preventDefault();
    const patterns = bannedPatterns
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p !== "");
    saveBannedPatternsMutation.mutate(patterns);
  };

  const handleSaveAdmins = (e: React.FormEvent) => {
    e.preventDefault();
    const adminList = admins
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a !== "");
    saveAdminsMutation.mutate(adminList);
  };

  const spamWordCount = spamWords
    .split("\n")
    .filter((w) => w.trim() !== "").length;

  if (spamLoading || patternsLoading || adminsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-protection">Protection</h1>
          <p className="text-muted-foreground mt-1">Manage spam filters and security settings</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading protection settings...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (spamError || patternsError || adminsError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-protection">Protection</h1>
          <p className="text-muted-foreground mt-1">Manage spam filters and security settings</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-destructive">Failed to load protection settings. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-protection">Protection</h1>
        <p className="text-muted-foreground mt-1">Manage spam filters and security settings</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Spam Words</CardTitle>
          </div>
          <CardDescription>
            One word per line (supports thousands of words)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveSpamWords} className="space-y-4">
            <div>
              <Textarea
                placeholder="Enter spam words, one per line..."
                value={spamWords}
                onChange={(e) => setSpamWords(e.target.value)}
                className="min-h-[200px] font-mono"
                data-testid="textarea-spam-words"
              />
              <p className="text-sm text-muted-foreground mt-2">
                <span data-testid="text-spam-word-count">{spamWordCount}</span> words configured
              </p>
            </div>
            <Button
              type="submit"
              disabled={saveSpamWordsMutation.isPending}
              data-testid="button-save-spam-words"
            >
              <Save className="mr-2 h-4 w-4" />
              {saveSpamWordsMutation.isPending ? "Saving..." : "Save Spam Words"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Banned Patterns</CardTitle>
          <CardDescription>
            URL patterns to block (comma-separated)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveBannedPatterns} className="space-y-4">
            <Textarea
              placeholder="http://, bit.ly, discord.gg"
              value={bannedPatterns}
              onChange={(e) => setBannedPatterns(e.target.value)}
              className="min-h-[100px]"
              data-testid="textarea-banned-patterns"
            />
            <Button
              type="submit"
              disabled={saveBannedPatternsMutation.isPending}
              data-testid="button-save-patterns"
            >
              <Save className="mr-2 h-4 w-4" />
              {saveBannedPatternsMutation.isPending ? "Saving..." : "Save Patterns"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Administrators</CardTitle>
          <CardDescription>
            Admin usernames (comma-separated)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveAdmins} className="space-y-4">
            <Textarea
              placeholder="Admin1, Admin2, Admin3"
              value={admins}
              onChange={(e) => setAdmins(e.target.value)}
              className="min-h-[100px]"
              data-testid="textarea-admins"
            />
            <Button
              type="submit"
              disabled={saveAdminsMutation.isPending}
              data-testid="button-save-admins"
            >
              <Save className="mr-2 h-4 w-4" />
              {saveAdminsMutation.isPending ? "Saving..." : "Save Admins"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
