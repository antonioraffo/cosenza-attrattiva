"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Status = "idle" | "active" | "denied" | "unsupported";

interface IOSOrientationEvent extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}
type PermissionAPI = { requestPermission?: () => Promise<"granted" | "denied"> };

/**
 * Rotta della bussola del dispositivo (0 = nord) e inclinazione (beta).
 * iOS richiede il permesso su gesto dell'utente; Android usa `deviceorientationabsolute`.
 */
export function useDeviceHeading() {
  const [heading, setHeading] = useState<number | null>(null);
  const [beta, setBeta] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const smoothed = useRef<number | null>(null);
  const cleanup = useRef<(() => void) | null>(null);

  const listen = useCallback(() => {
    const onEvent = (e: DeviceOrientationEvent) => {
      const ios = (e as IOSOrientationEvent).webkitCompassHeading;
      let h: number | null = null;
      if (typeof ios === "number") h = ios;
      else if (e.absolute && e.alpha !== null) h = 360 - e.alpha;
      if (h === null) return;
      const screenAngle = window.screen.orientation?.angle ?? 0;
      h = (h + screenAngle + 360) % 360;
      // filtro passa-basso circolare per eliminare il tremolio
      const prev = smoothed.current;
      if (prev === null) smoothed.current = h;
      else {
        const d = ((h - prev + 540) % 360) - 180;
        smoothed.current = (prev + d * 0.2 + 360) % 360;
      }
      setHeading(smoothed.current);
      if (e.beta !== null) setBeta(e.beta);
      setStatus("active");
    };
    const evt = "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation";
    window.addEventListener(evt, onEvent as EventListener, true);
    cleanup.current = () => window.removeEventListener(evt, onEvent as EventListener, true);
  }, []);

  const request = useCallback(async () => {
    if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
      setStatus("unsupported");
      return;
    }
    const api = DeviceOrientationEvent as unknown as PermissionAPI;
    if (typeof api.requestPermission === "function") {
      try {
        if ((await api.requestPermission()) !== "granted") return setStatus("denied");
      } catch {
        return setStatus("denied");
      }
    }
    cleanup.current?.();
    listen();
    // nessun evento entro 1,5 s = sensore assente (desktop)
    window.setTimeout(() => setStatus((s) => (s === "active" ? s : "unsupported")), 1500);
  }, [listen]);

  useEffect(() => () => cleanup.current?.(), []);

  return { heading, beta, status, request };
}
