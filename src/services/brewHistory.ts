import AsyncStorage from "@react-native-async-storage/async-storage";
import { z } from "zod";

const STORAGE_KEY = "brew_master_brew_history_v1";

/** Max rows kept locally (oldest dropped). */
export const MAX_BREW_HISTORY_ENTRIES = 120;

const brewLogEntrySchema = z.object({
  id: z.string(),
  recipeId: z.string(),
  recipeTitle: z.string(),
  brewMethod: z.string(),
  startedAt: z.string(),
  finishedAt: z.string(),
  coffeeGrams: z.number().optional(),
  waterGrams: z.number().optional(),
  stepCount: z.number().optional(),
});

export type BrewLogEntry = z.infer<typeof brewLogEntrySchema>;

export type NewBrewLogInput = Omit<BrewLogEntry, "id"> & { id?: string };

function parseStored(json: string | null): BrewLogEntry[] {
  if (!json) {
    return [];
  }
  try {
    const raw = JSON.parse(json) as unknown;
    const parsed = z.array(brewLogEntrySchema).safeParse(raw);
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

async function readAll(): Promise<BrewLogEntry[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return parseStored(json);
}

async function writeAll(entries: BrewLogEntry[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function newId(): string {
  return `h-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

class BrewHistoryService {
  async init(): Promise<void> {
    await readAll();
  }

  /** Append a completed brew; newest first in storage. */
  async addEntry(input: NewBrewLogInput): Promise<BrewLogEntry> {
    const entry: BrewLogEntry = {
      ...input,
      id: input.id ?? newId(),
    };
    brewLogEntrySchema.parse(entry);
    const existing = await readAll();
    const next = [entry, ...existing].slice(0, MAX_BREW_HISTORY_ENTRIES);
    await writeAll(next);
    return entry;
  }

  async getRecent(limit: number): Promise<BrewLogEntry[]> {
    const all = await readAll();
    return all.slice(0, Math.max(0, limit));
  }

  async getAll(): Promise<BrewLogEntry[]> {
    return readAll();
  }
}

export const brewHistoryService = new BrewHistoryService();
