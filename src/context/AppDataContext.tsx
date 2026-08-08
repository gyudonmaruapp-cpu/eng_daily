import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { FontSizeKey } from "../theme/tokens";
import { loadJSON, saveJSON } from "../utils/storage";
import { syncDailyNotification } from "../utils/notifications";
import { initializeAds } from "../utils/ads";

interface Settings {
  notificationsEnabled: boolean;
  notificationHour: number;
  notificationMinute: number;
  fontSize: FontSizeKey;
}

const DEFAULT_SETTINGS: Settings = {
  notificationsEnabled: true,
  notificationHour: 8,
  notificationMinute: 0,
  fontSize: "M",
};

interface ViewedEntry {
  id: string;
  viewedAt: string; // ISO timestamp
}

interface AppDataValue {
  ready: boolean;

  favoriteIds: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;

  viewed: ViewedEntry[]; // sorted most-recently-viewed first
  markViewed: (id: string) => void;

  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;

  personalizedAdsAllowed: boolean;
}

const AppDataContext = createContext<AppDataValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [viewed, setViewed] = useState<ViewedEntry[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [personalizedAdsAllowed, setPersonalizedAdsAllowed] = useState(false);

  useEffect(() => {
    (async () => {
      const [favs, seen, savedSettings] = await Promise.all([
        loadJSON<string[]>("favorites", []),
        loadJSON<ViewedEntry[]>("viewed", []),
        loadJSON<Settings>("settings", DEFAULT_SETTINGS),
      ]);
      setFavoriteIds(favs);
      setViewed(seen);
      setSettings(savedSettings);
      setReady(true);
      syncDailyNotification(
        savedSettings.notificationsEnabled,
        savedSettings.notificationHour,
        savedSettings.notificationMinute
      );
      initializeAds()
        .then(({ personalizedAdsAllowed }) => setPersonalizedAdsAllowed(personalizedAdsAllowed))
        .catch(() => {});
    })();
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      saveJSON("favorites", next);
      return next;
    });
  }, []);

  const markViewed = useCallback((id: string) => {
    setViewed((prev) => {
      if (prev.some((v) => v.id === id)) return prev;
      const next = [{ id, viewedAt: new Date().toISOString() }, ...prev];
      saveJSON("viewed", next);
      return next;
    });
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveJSON("settings", next);
      if ("notificationsEnabled" in patch || "notificationHour" in patch || "notificationMinute" in patch) {
        syncDailyNotification(next.notificationsEnabled, next.notificationHour, next.notificationMinute);
      }
      return next;
    });
  }, []);

  const value = useMemo<AppDataValue>(
    () => ({
      ready,
      favoriteIds,
      isFavorite: (id: string) => favoriteIds.includes(id),
      toggleFavorite,
      viewed,
      markViewed,
      settings,
      updateSettings,
      personalizedAdsAllowed,
    }),
    [ready, favoriteIds, viewed, settings, toggleFavorite, markViewed, updateSettings, personalizedAdsAllowed]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
