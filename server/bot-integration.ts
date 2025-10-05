import type { Express } from 'express';
import { promises as fs } from 'fs';
import * as http from 'http';
import * as crypto from 'crypto';
import * as path from 'path';
import axios from 'axios';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration
const club_code = process.env.CLUB_CODE || 'default';
const club_name = process.env.CLUB_NAME || 'Default Club';
const my_uid = process.env.BOT_UID || '';
const bot_ep = process.env.EP || '';
const bot_key = process.env.KEY || '';

// File paths
const MEMBERS_FILE = './data/club_members.json';
const SETTINGS_FILE = './data/settings.json';
const USERS_FILE = './data/users.json';
const SPAM_FILE = './data/spam.txt';
const ADMINS_FILE = './data/admins.txt';
const BANNED_PATTERNS_FILE = './data/banned_patterns.txt';
const BOT_CONFIG_FILE = './data/bot_configuration.json';

// Bot state
let botState = {
  connected: false,
  connecting: false,
  socket: null as any,
  clubCode: club_code,
  clubName: club_name,
  startTime: null as number | null,
  stats: {
    messagesProcessed: 0,
    usersKicked: 0,
    spamBlocked: 0
  }
};

// Bot configuration
let botConfig = {
  admins: [] as string[],
  spamWords: [] as string[],
  bannedPatterns: [] as string[],
  settings: null as any,
  botConfiguration: null as any
};

// Game state
let secretNumber = Math.floor(Math.random() * 100) + 1;
let botMic = 0;
let index_idx = 1;
let sequence = 2;
let mics = new Array(10).fill(null);
let onMic = false;
let savedData: any = {};
let club_members: any[] = [];
let messageBuffer = '';
let typeWord: string | false = false;
let messageStorage = '';
let clubAdmins: string[] = [];
let pendingRemovals: string[] = [];
let bannedUserIds: string[] = [];
let check_ban_list = false;

// OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

// Conversation history for OpenAI
const conversationHistory = new Map();

// Logger
const logger = {
  info: (message: string) => console.log(`[INFO] ${message}`),
  error: (message: string) => console.error(`[ERROR] ${message}`),
  warn: (message: string) => console.warn(`[WARN] ${message}`)
};

// Helper functions
async function loadSettings() {
  try {
    const data = await fs.readFile(SETTINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      const defaults = {
        allowAvatars: true,
        banLevel: 10,
        allowGuestIds: false,
        createdAt: new Date().toISOString()
      };
      await fs.writeFile(SETTINGS_FILE, JSON.stringify(defaults, null, 2));
      return defaults;
    }
    throw error;
  }
}

async function loadConfigFromFile(type: string) {
  try {
    let filePath = '';
    if (type === 'settings') filePath = SETTINGS_FILE;
    else if (type === 'bot-config') filePath = BOT_CONFIG_FILE;
    else if (type === 'admins') filePath = ADMINS_FILE;
    else if (type === 'spam-words') filePath = SPAM_FILE;
    else if (type === 'banned-patterns') filePath = BANNED_PATTERNS_FILE;
    else return null;

    const data = await fs.readFile(filePath, 'utf8');
    
    if (type === 'settings' || type === 'bot-config') {
      return JSON.parse(data);
    } else {
      // Text files
      if (type === 'spam-words') {
        return data.split('\n').filter(line => line.trim() !== '');
      } else {
        return data.split(',').map(item => item.trim()).filter(item => item !== '');
      }
    }
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      logger.warn(`Config file not found: ${type}`);
      return null;
    }
    logger.error(`Error loading config ${type}: ${error.message}`);
    return null;
  }
}

async function loadAllConfigurations() {
  try {
    const settings = await loadConfigFromFile('settings');
    if (settings) {
      botConfig.settings = settings;
      logger.info(`⚙️ Loaded settings: Avatars: ${settings.allowAvatars}, Ban Level: ${settings.banLevel}`);
    } else {
      botConfig.settings = {
        allowAvatars: true,
        banLevel: 10,
        allowGuestIds: false
      };
    }

    const botConfiguration = await loadConfigFromFile('bot-config');
    if (botConfiguration) {
      botConfig.botConfiguration = botConfiguration;
      logger.info(`🤖 Bot config loaded: ${botConfiguration.botName} (${botConfiguration.botTone})`);
    } else {
      botConfig.botConfiguration = {
        botName: 'Elijah',
        botTone: 'upbeat',
        welcomeMessage: '✨️˚.⭒Wᴇʟᴄᴏᴍᴇ {name}˚✨️'
      };
    }

    const admins = await loadConfigFromFile('admins');
    if (admins) {
      botConfig.admins = admins;
      logger.info(`👥 Loaded ${admins.length} admins`);
    }

    const spamWords = await loadConfigFromFile('spam-words');
    if (spamWords) {
      botConfig.spamWords = spamWords;
      logger.info(`🚫 Loaded ${spamWords.length} spam words`);
    }

    const bannedPatterns = await loadConfigFromFile('banned-patterns');
    if (bannedPatterns) {
      botConfig.bannedPatterns = bannedPatterns;
      logger.info(`⛔ Loaded ${bannedPatterns.length} banned patterns`);
    }
  } catch (error: any) {
    logger.error(`Error loading configurations: ${error.message}`);
  }
}

async function saveClubMembers(jsonMessage: any) {
  try {
    if (jsonMessage?.PY?.ML !== undefined) {
      const jsonString = JSON.stringify(jsonMessage.PY.ML, null, 2);
      await fs.writeFile(MEMBERS_FILE, jsonString, 'utf8');
      logger.info('Club members saved successfully!');
    }
  } catch (error) {
    logger.error('Error saving club members');
  }
}

function formatWelcomeMessage(userName: string) {
  const welcomeTemplate = botConfig.botConfiguration?.welcomeMessage || '✨️˚.⭒Wᴇʟᴄᴏᴍᴇ {name}˚✨️';
  return welcomeTemplate.replace('{name}', userName);
}

async function loadSavedData(filePath: string) {
  try {
    await fs.access(filePath);
    const rawData = await fs.readFile(filePath, 'utf8');
    savedData = JSON.parse(rawData);
    logger.info('Data loaded.');
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      logger.info('📁 No existing data file found. Starting fresh.');
      savedData = {};
    } else {
      savedData = {};
    }
  }
}

async function saveData(data: any, filePath: string) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    logger.error('Error saving data');
  }
}

function findPlayerID(UID: string) {
  for (const GC in savedData) {
    if (savedData[GC].UID === UID) {
      return GC;
    }
  }
  return null;
}

function findPlayerName(UID: string) {
  for (const GC in savedData) {
    if (savedData[GC].UID === UID) {
      return savedData[GC].NM;
    }
  }
  return 'Unknown';
}

function checkAvatar(number: number) {
  return number.toString().startsWith('1000');
}

// OpenAI functions
function gptTone(user_id: string) {
  const tones: any = {
    upbeat: "You are an upbeat and friendly assistant. Be positive and encouraging!",
    sarcastic: "You are a witty and sarcastic assistant. Use humor and sass in your responses!",
    wise: "You are a wise and thoughtful assistant. Provide deep insights and wisdom.",
    energetic: "You are an energetic and enthusiastic assistant. Show excitement in every response!",
    chill: "You are a chill and relaxed assistant. Keep things cool and casual.",
    phuppo: "You are a phuppo (aunt) character. Be caring but slightly nosy and gossipy.",
    gangster: "You are a gangster character. Talk tough and street-smart.",
    party: "You are a party animal. Everything is fun and exciting!"
  };
  
  const tone = botConfig.botConfiguration?.botTone || 'upbeat';
  return tones[tone] || tones.upbeat;
}

function removeBotName(message: string) {
  const botName = botConfig.botConfiguration?.botName || 'Elijah';
  return message.replace(new RegExp(botName, 'gi'), '').trim();
}

function splitMessage(text: string, maxLength: number = 150) {
  const words = text.split(' ');
  const chunks: string[] = [];
  let currentChunk = '';

  for (const word of words) {
    if ((currentChunk + word).length > maxLength) {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = word + ' ';
    } else {
      currentChunk += word + ' ';
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

async function getResponse(message: string, user_id: string) {
  try {
    if (!conversationHistory.has(user_id)) {
      conversationHistory.set(user_id, [
        { role: "system", content: gptTone(user_id) }
      ]);
    }

    const history = conversationHistory.get(user_id);
    history.push({ role: "user", content: message });

    const recentHistory = history.slice(-11);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: recentHistory,
      max_tokens: 200,
      temperature: 0.8,
    });

    const reply = response.choices?.[0]?.message?.content?.trim() || "Sorry, I didn't catch that.";
    history.push({ role: "assistant", content: reply });

    return reply;
  } catch (error) {
    logger.error("Error fetching ChatGPT response");
    return "Sorry, I couldn't process that.";
  }
}

async function addSpamWord(word: string) {
  try {
    await fs.appendFile(SPAM_FILE, `${word}\n`);
    botConfig.spamWords.push(word);
    logger.info(`Word "${word}" added successfully.`);
  } catch (err) {
    logger.error('Error adding word');
  }
}

// Initialize bot
async function initializeBot() {
  try {
    await loadAllConfigurations();
    await loadSavedData(USERS_FILE);
    logger.info('Bot initialized successfully');
  } catch (error) {
    logger.error('Error initializing bot');
  }
}

// Export bot integration
export function setupBotIntegration(app: Express) {
  // ====================
  // JACK API ENDPOINTS
  // ====================

  // Get members with pagination
  app.get('/api/jack/members', async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (page < 1 || limit < 1 || limit > 100) {
        return res.json({
          success: false,
          message: 'Invalid pagination parameters'
        });
      }

      const data = await fs.readFile(MEMBERS_FILE, 'utf8');
      const allMembers = JSON.parse(data);

      const levelStats = {
        total: allMembers.length,
        highLevel: allMembers.filter((m: any) => m.LVL >= 10).length,
        mediumLevel: allMembers.filter((m: any) => m.LVL >= 5 && m.LVL <= 9).length,
        lowLevel: allMembers.filter((m: any) => m.LVL >= 1 && m.LVL <= 4).length
      };

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMembers = allMembers.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: {
          members: paginatedMembers,
          total: allMembers.length,
          page: page,
          limit: limit,
          totalPages: Math.ceil(allMembers.length / limit),
          levelStats: levelStats
        }
      });
    } catch (error) {
      res.json({ success: false, message: 'Failed to load members' });
    }
  });

  // Remove member
  app.delete('/api/jack/members/:uid', async (req, res) => {
    try {
      const { uid } = req.params;
      const data = await fs.readFile(MEMBERS_FILE, 'utf8');
      const allMembers = JSON.parse(data);

      const memberIndex = allMembers.findIndex((m: any) => m.UID === uid);
      if (memberIndex === -1) {
        return res.json({ success: false, message: 'Member not found' });
      }

      const removed = allMembers.splice(memberIndex, 1)[0];
      await fs.writeFile(MEMBERS_FILE, JSON.stringify(allMembers, null, 2));
      
      pendingRemovals.push(uid);
      logger.info(`🗑️ Member removed: ${removed.NM}`);

      res.json({
        success: true,
        message: `Member ${removed.NM} removed successfully`,
        removedMember: removed
      });
    } catch (error) {
      res.json({ success: false, message: 'Failed to remove member' });
    }
  });

  // Bulk remove members
  app.post('/api/jack/members/bulk-remove', async (req, res) => {
    try {
      const { level, count } = req.body;

      if (typeof level !== 'number' || typeof count !== 'number') {
        return res.json({ success: false, message: 'Invalid parameters' });
      }

      const data = await fs.readFile(MEMBERS_FILE, 'utf8');
      const allMembers = JSON.parse(data);
      const membersAtLevel = allMembers.filter((m: any) => m.LVL === level);

      if (membersAtLevel.length === 0) {
        return res.json({ success: false, message: `No members at level ${level}` });
      }

      const removeCount = Math.min(count, membersAtLevel.length);
      const membersToRemove = membersAtLevel.slice(0, removeCount);
      const uidsToRemove = membersToRemove.map((m: any) => m.UID);

      const updated = allMembers.filter((m: any) => !uidsToRemove.includes(m.UID));
      await fs.writeFile(MEMBERS_FILE, JSON.stringify(updated, null, 2));

      pendingRemovals.push(...uidsToRemove);
      logger.info(`🗑️ Bulk removed ${removeCount} members at level ${level}`);

      res.json({
        success: true,
        message: `Removed ${removeCount} members at level ${level}`,
        removedCount: removeCount
      });
    } catch (error) {
      res.json({ success: false, message: 'Failed to bulk remove' });
    }
  });

  // Load bot configuration
  app.get('/api/jack/bot-config', async (req, res) => {
    try {
      const data = await fs.readFile(BOT_CONFIG_FILE, 'utf8');
      const config = JSON.parse(data);
      botConfig.botConfiguration = config;
      res.json({ success: true, data: config });
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        const defaultConfig = {
          botName: 'Elijah',
          botTone: 'upbeat',
          welcomeMessage: '✨️˚.⭒Wᴇʟᴄᴏᴍᴇ {name}˚✨️',
          createdAt: new Date().toISOString()
        };
        await fs.writeFile(BOT_CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
        res.json({ success: true, data: defaultConfig });
      } else {
        res.json({ success: false, message: 'Failed to load config' });
      }
    }
  });

  // Save bot configuration
  app.post('/api/jack/bot-config', async (req, res) => {
    try {
      const { botName, botTone, welcomeMessage } = req.body;

      if (!botName || !botTone || !welcomeMessage) {
        return res.json({ success: false, message: 'Invalid bot configuration' });
      }

      const validTones = ['upbeat', 'sarcastic', 'wise', 'energetic', 'chill', 'phuppo', 'gangster', 'party'];
      if (!validTones.includes(botTone)) {
        return res.json({ success: false, message: 'Invalid bot tone' });
      }

      const config = {
        botName: botName.trim(),
        botTone,
        welcomeMessage: welcomeMessage.trim(),
        updatedAt: new Date().toISOString()
      };

      await fs.writeFile(BOT_CONFIG_FILE, JSON.stringify(config, null, 2));
      botConfig.botConfiguration = config;
      conversationHistory.clear();

      logger.info(`Bot configuration updated: ${botName} (${botTone})`);
      res.json({ success: true, message: 'Bot configuration saved' });
    } catch (error) {
      res.json({ success: false, message: 'Failed to save config' });
    }
  });

  // Load settings
  app.get('/api/jack/settings', async (req, res) => {
    try {
      const settings = await loadSettings();
      res.json({ success: true, data: settings });
    } catch (error) {
      res.json({ success: false, message: 'Failed to load settings' });
    }
  });

  // Save settings
  app.post('/api/jack/settings', async (req, res) => {
    try {
      const { allowAvatars, banLevel, allowGuestIds } = req.body;

      if (typeof allowAvatars !== 'boolean' ||
          typeof allowGuestIds !== 'boolean' ||
          typeof banLevel !== 'number' ||
          banLevel < 1 || banLevel > 100) {
        return res.json({ success: false, message: 'Invalid settings data' });
      }

      const settings = {
        allowAvatars,
        banLevel,
        allowGuestIds,
        updatedAt: new Date().toISOString()
      };

      await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      botConfig.settings = settings;

      logger.info(`Settings updated: Avatars: ${allowAvatars}, Ban Level: ${banLevel}`);
      res.json({ success: true, message: 'Settings saved successfully' });
    } catch (error) {
      res.json({ success: false, message: 'Failed to save settings' });
    }
  });

  // Load configuration (admins, spam-words, banned-patterns)
  app.get('/api/jack/config/:type', async (req, res) => {
    try {
      const { type } = req.params;
      const fileMap: any = {
        'admins': ADMINS_FILE,
        'spam-words': SPAM_FILE,
        'banned-patterns': BANNED_PATTERNS_FILE
      };

      const filePath = fileMap[type];
      if (!filePath) {
        return res.json({ success: false, message: 'Invalid config type' });
      }

      const data = await fs.readFile(filePath, 'utf8');
      let parsedData;

      if (type === 'spam-words') {
        parsedData = data.split('\n').filter(line => line.trim() !== '');
      } else {
        parsedData = data.split(',').map(item => item.trim()).filter(item => item !== '');
      }

      res.json({ success: true, data: parsedData });
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        res.json({ success: false, message: 'File not found' });
      } else {
        res.json({ success: false, message: 'Failed to load config' });
      }
    }
  });

  // Save configuration
  app.post('/api/jack/config/:type', async (req, res) => {
    try {
      const { type } = req.params;
      const { data } = req.body;

      const fileMap: any = {
        'admins': ADMINS_FILE,
        'spam-words': SPAM_FILE,
        'banned-patterns': BANNED_PATTERNS_FILE
      };

      const filePath = fileMap[type];
      if (!filePath) {
        return res.json({ success: false, message: 'Invalid config type' });
      }

      let fileContent;
      if (type === 'spam-words') {
        fileContent = data.join('\n');
        botConfig.spamWords = data;
      } else if (type === 'banned-patterns') {
        fileContent = data.join(', ');
        botConfig.bannedPatterns = data;
      } else if (type === 'admins') {
        fileContent = data.join(', ');
        botConfig.admins = data;
      }

      await fs.writeFile(filePath, fileContent, 'utf8');
      logger.info(`Configuration ${type} updated: ${data.length} items`);

      res.json({ success: true, message: 'Configuration saved' });
    } catch (error) {
      res.json({ success: false, message: 'Failed to save config' });
    }
  });

  // Get bot status
  app.get('/api/jack/status', (req, res) => {
    const uptime = botState.startTime ? Date.now() - botState.startTime : 0;

    res.json({
      success: true,
      connected: botState.connected,
      connecting: botState.connecting,
      clubCode: botState.clubCode,
      clubName: botState.clubName,
      uptime: uptime,
      stats: botState.stats,
      configLoaded: {
        admins: botConfig.admins.length,
        spamWords: botConfig.spamWords.length,
        bannedPatterns: botConfig.bannedPatterns.length
      }
    });
  });

  // Restart bot endpoint
  app.post('/api/jack/restart', async (req, res) => {
    try {
      logger.info('🔄 Bot restart requested from dashboard');
      res.json({
        success: true,
        message: 'Bot restart initiated'
      });

      setTimeout(() => {
        process.exit(0);
      }, 1000);
    } catch (error) {
      res.json({ success: false, message: 'Failed to restart' });
    }
  });

  // Initialize bot on server start
  initializeBot();

  logger.info('✅ Bot integration endpoints registered');
  logger.info('📡 Bot API available at /api/jack/*');
}
