"use client";

import { useEffect, useState, useCallback } from "react";
import { getQueueCount } from "@/lib/offline";

const SIMULATE_KEY = "gizisync_simulate_offline";

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [queueCount, setQueueCount] = useState<number>(0);

  const updateQueue = useCallback(() => {
    setQueueCount(getQueueCount());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);
    const savedSim = sessionStorage.getItem(SIMULATE_KEY);
    setIsSimulatedOffline(savedSim === "true");
    updateQueue();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleQueueChange = () => updateQueue();
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gizisync_offline_measurements") {
        updateQueue();
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("gizisync-queue-updated", handleQueueChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("gizisync-queue-updated", handleQueueChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [updateQueue]);

  const toggleSimulation = () => {
    setIsSimulatedOffline((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        sessionStorage.setItem(SIMULATE_KEY, String(next));
      }
      return next;
    });
  };

  const isOffline = !isOnline || isSimulatedOffline;

  return {
    isOnline,
    isSimulatedOffline,
    isOffline,
    queueCount,
    toggleSimulation,
    refreshQueue: updateQueue,
  };
}
