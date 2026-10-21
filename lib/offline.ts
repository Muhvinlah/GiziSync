import { OfflineQueueItem } from "./validators";

const OFFLINE_QUEUE_KEY = "gizisync_offline_measurements";

export function getOfflineQueue(): OfflineQueueItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as OfflineQueueItem[];
  } catch (err) {
    console.error("Gagal membaca antrean offline dari localStorage:", err);
    return [];
  }
}

export function addToOfflineQueue(
  item: Omit<OfflineQueueItem, "local_id" | "queued_at">,
): OfflineQueueItem {
  if (typeof window === "undefined") {
    throw new Error("Penyimpanan offline hanya tersedia di peramban");
  }

  const queue = getOfflineQueue();
  const newItem: OfflineQueueItem = {
    ...item,
    local_id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    queued_at: new Date().toISOString(),
  };

  const updatedQueue = [...queue, newItem];
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(updatedQueue));
  notifyQueueChange();
  return newItem;
}

export function removeFromOfflineQueue(localId: string): void {
  if (typeof window === "undefined") return;
  const queue = getOfflineQueue();
  const updatedQueue = queue.filter((item) => item.local_id !== localId);
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(updatedQueue));
  notifyQueueChange();
}

export function clearOfflineQueue(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(OFFLINE_QUEUE_KEY);
  notifyQueueChange();
}

export function getQueueCount(): number {
  return getOfflineQueue().length;
}

function notifyQueueChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("gizisync-queue-updated"));
  }
}
