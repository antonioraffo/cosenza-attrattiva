import { useSyncExternalStore } from "react";

/** Store minimale compatibile con useSyncExternalStore, opzionalmente persistito in localStorage. */
export function createStore<T>(initial: T, persistKey?: string) {
  let state = initial;
  let hydrated = !persistKey;
  const listeners = new Set<() => void>();

  const hydrate = () => {
    if (hydrated || typeof window === "undefined") return;
    hydrated = true;
    try {
      const raw = window.localStorage.getItem(persistKey!);
      if (raw) state = { ...initial, ...(JSON.parse(raw) as T) };
    } catch {
      /* storage non disponibile (navigazione privata): si resta in memoria */
    }
  };

  const get = () => {
    hydrate();
    return state;
  };

  const set = (next: T | ((prev: T) => T)) => {
    hydrate();
    state = typeof next === "function" ? (next as (p: T) => T)(state) : next;
    if (persistKey) {
      try {
        window.localStorage.setItem(persistKey, JSON.stringify(state));
      } catch {
        /* quota o storage bloccato */
      }
    }
    listeners.forEach((l) => l());
  };

  const subscribe = (l: () => void) => {
    listeners.add(l);
    // sincronizza tra schede
    const onStorage = (e: StorageEvent) => {
      if (persistKey && e.key === persistKey) {
        hydrated = false;
        hydrate();
        l();
      }
    };
    if (persistKey) window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(l);
      if (persistKey) window.removeEventListener("storage", onStorage);
    };
  };

  function useStore(): T;
  function useStore<S>(selector: (s: T) => S): S;
  function useStore<S>(selector?: (s: T) => S) {
    return useSyncExternalStore(
      subscribe,
      () => (selector ? selector(get()) : get()),
      () => (selector ? selector(initial) : initial),
    );
  }

  return { get, set, subscribe, useStore };
}
