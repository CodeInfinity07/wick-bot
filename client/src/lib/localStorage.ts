// LocalStorage utility for client-side data persistence

export interface Member {
  UID: string;
  NM: string;
  LVL: number;
}

export interface BotConfig {
  botName: string;
  botTone: string;
  welcomeMessage: string;
}

export interface Settings {
  allowAvatars: boolean;
  banLevel: number;
  allowGuestIds: boolean;
}

export interface BotStatus {
  isRunning: boolean;
  lastStarted: string | null;
  lastStopped: string | null;
}

// Initialize localStorage with default data
export function initializeLocalStorage() {
  if (!localStorage.getItem("members")) {
    const defaultMembers: Member[] = [
      { UID: "user001", NM: "Alex Johnson", LVL: 15 },
      { UID: "user002", NM: "Sarah Chen", LVL: 8 },
      { UID: "user003", NM: "Mike Davis", LVL: 22 },
      { UID: "user004", NM: "Emma Wilson", LVL: 5 },
      { UID: "user005", NM: "Chris Brown", LVL: 12 },
      { UID: "user006", NM: "Lisa Anderson", LVL: 3 },
      { UID: "user007", NM: "John Smith", LVL: 2 },
      { UID: "user008", NM: "Maria Garcia", LVL: 18 },
    ];
    localStorage.setItem("members", JSON.stringify(defaultMembers));
  }

  if (!localStorage.getItem("botConfig")) {
    const defaultConfig: BotConfig = {
      botName: "RexBot",
      botTone: "upbeat",
      welcomeMessage: "✨️˚.⭒Wᴇʟᴄᴏᴍᴇ {name}˚✨️",
    };
    localStorage.setItem("botConfig", JSON.stringify(defaultConfig));
  }

  if (!localStorage.getItem("settings")) {
    const defaultSettings: Settings = {
      allowAvatars: true,
      banLevel: 10,
      allowGuestIds: false,
    };
    localStorage.setItem("settings", JSON.stringify(defaultSettings));
  }

  if (!localStorage.getItem("spamWords")) {
    localStorage.setItem(
      "spamWords",
      "spam\nscam\nfake\nphishing\nclick here\nfree money\nwin now\nvirus\nmalware"
    );
  }

  if (!localStorage.getItem("bannedPatterns")) {
    localStorage.setItem("bannedPatterns", "http://, bit.ly, discord.gg");
  }

  if (!localStorage.getItem("admins")) {
    localStorage.setItem("admins", "Admin1, Admin2, Admin3");
  }

  if (!localStorage.getItem("exemptions")) {
    localStorage.setItem("exemptions", "");
  }

  if (!localStorage.getItem("loyalMembers")) {
    localStorage.setItem("loyalMembers", "");
  }

  if (!localStorage.getItem("botStatus")) {
    const defaultStatus: BotStatus = {
      isRunning: true,
      lastStarted: new Date().toISOString(),
      lastStopped: null,
    };
    localStorage.setItem("botStatus", JSON.stringify(defaultStatus));
  }
}

// Members
export function getMembers(): Member[] {
  const data = localStorage.getItem("members");
  return data ? JSON.parse(data) : [];
}

export function saveMembers(members: Member[]) {
  localStorage.setItem("members", JSON.stringify(members));
}

// Bot Configuration
export function getBotConfig(): BotConfig {
  const data = localStorage.getItem("botConfig");
  return data ? JSON.parse(data) : { botName: "", botTone: "upbeat", welcomeMessage: "" };
}

export function saveBotConfig(config: BotConfig) {
  localStorage.setItem("botConfig", JSON.stringify(config));
}

// Settings
export function getSettings(): Settings {
  const data = localStorage.getItem("settings");
  return data ? JSON.parse(data) : { allowAvatars: true, banLevel: 10, allowGuestIds: false };
}

export function saveSettings(settings: Settings) {
  localStorage.setItem("settings", JSON.stringify(settings));
}

// Bot Status
export function getBotStatus(): BotStatus {
  const data = localStorage.getItem("botStatus");
  return data ? JSON.parse(data) : { isRunning: false, lastStarted: null, lastStopped: null };
}

export function saveBotStatus(status: BotStatus) {
  localStorage.setItem("botStatus", JSON.stringify(status));
}

// Spam Words
export function getSpamWords(): string[] {
  const data = localStorage.getItem("spamWords") || "";
  return data.split("\n").map(w => w.trim()).filter(w => w !== "");
}

export function saveSpamWords(words: string[]) {
  localStorage.setItem("spamWords", words.join("\n"));
}

// Banned Patterns
export function getBannedPatterns(): string[] {
  const data = localStorage.getItem("bannedPatterns") || "";
  return data.split(",").map(p => p.trim()).filter(p => p !== "");
}

export function saveBannedPatterns(patterns: string[]) {
  localStorage.setItem("bannedPatterns", patterns.join(", "));
}

// Admins
export function getAdmins(): string[] {
  const data = localStorage.getItem("admins") || "";
  return data.split(",").map(a => a.trim()).filter(a => a !== "");
}

export function saveAdmins(admins: string[]) {
  localStorage.setItem("admins", admins.join(", "));
}

// Exemptions
export function getExemptions(): string[] {
  const data = localStorage.getItem("exemptions") || "";
  return data.split(",").map(e => e.trim()).filter(e => e !== "");
}

export function saveExemptions(exemptions: string[]) {
  localStorage.setItem("exemptions", exemptions.join(", "));
}

// Loyal Members
export function getLoyalMembers(): string[] {
  const data = localStorage.getItem("loyalMembers") || "";
  return data.split(",").map(m => m.trim()).filter(m => m !== "");
}

export function saveLoyalMembers(members: string[]) {
  localStorage.setItem("loyalMembers", members.join(", "));
}
