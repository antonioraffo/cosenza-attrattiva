"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { splitSentences } from "@/lib/text";

export interface Track {
  id: string;
  title: string;
  /** Testo semplice: usato dalla sintesi vocale se manca `src` */
  text: string;
  lang: "it" | "en";
  src?: string | null;
}

type Status = "idle" | "playing" | "paused";

interface AudioCtx {
  track: Track | null;
  status: Status;
  progress: number; // 0–1
  rate: number;
  mode: "file" | "tts" | null;
  ttsSupported: boolean;
  play: (t: Track) => void;
  toggle: () => void;
  stop: () => void;
  setRate: (r: number) => void;
}

const Ctx = createContext<AudioCtx | null>(null);

export function useAudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio fuori da AudioProvider");
  return ctx;
}

let sharedAudio: HTMLAudioElement | null = null;
const getAudio = () => (sharedAudio ??= new Audio());

function pickVoice(lang: "it" | "en"): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const wanted = lang === "it" ? ["it-IT", "it"] : ["en-GB", "en-US", "en"];
  for (const w of wanted) {
    const matches = voices.filter((v) => v.lang.replace("_", "-").startsWith(w));
    // preferisce voci "naturali"/"enhanced" quando presenti
    const best = matches.find((v) => /natural|enhanced|premium|neural/i.test(v.name)) ?? matches.find((v) => v.localService) ?? matches[0];
    if (best) return best;
  }
  return null;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [track, setTrack] = useState<Track | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [rate, setRateState] = useState(1);
  const [mode, setMode] = useState<AudioCtx["mode"]>(null);
  const [ttsSupported, setTtsSupported] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sentences = useRef<string[]>([]);
  const index = useRef(0);
  const session = useRef(0); // invalida i callback di letture precedenti
  const rateRef = useRef(1);
  const trackRef = useRef<Track | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- rilevamento capacità solo lato client
    setTtsSupported("speechSynthesis" in window);
    // alcuni browser caricano le voci in modo asincrono
    if ("speechSynthesis" in window) window.speechSynthesis.getVoices();
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const speakFrom = useCallback((start: number) => {
    // una frase per volta: pausa/ripresa affidabili e niente tagli dopo ~15 s (bug di Chrome)
    function step(i: number) {
      const t = trackRef.current;
      if (!t) return;
      const my = session.current;
      if (i >= sentences.current.length) {
        setStatus("idle");
        setProgress(1);
        return;
      }
      index.current = i;
      const u = new SpeechSynthesisUtterance(sentences.current[i]);
      u.lang = t.lang === "it" ? "it-IT" : "en-GB";
      const v = pickVoice(t.lang);
      if (v) u.voice = v;
      u.rate = rateRef.current;
      u.onend = () => {
        if (session.current !== my) return;
        setProgress((i + 1) / sentences.current.length);
        step(i + 1);
      };
      u.onerror = (e) => {
        if (session.current !== my || e.error === "interrupted" || e.error === "canceled") return;
        setStatus("idle");
      };
      window.speechSynthesis.speak(u);
    }
    step(start);
  }, []);

  const stop = useCallback(() => {
    session.current++;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    audioRef.current?.pause();
    setStatus("idle");
    setProgress(0);
  }, []);

  const play = useCallback(
    (t: Track) => {
      stop();
      session.current++;
      trackRef.current = t;
      setTrack(t);
      setProgress(0);
      if (t.src) {
        setMode("file");
        const a = getAudio();
        audioRef.current = a;
        a.src = t.src;
        a.playbackRate = rateRef.current;
        a.ontimeupdate = () => setProgress(a.duration ? a.currentTime / a.duration : 0);
        a.onended = () => setStatus("idle");
        a.play().then(() => setStatus("playing")).catch(() => setStatus("idle"));
        return;
      }
      if (!("speechSynthesis" in window)) return;
      setMode("tts");
      sentences.current = splitSentences(t.text);
      setStatus("playing");
      speakFrom(0);
    },
    [speakFrom, stop],
  );

  const toggle = useCallback(() => {
    if (!trackRef.current) return;
    if (mode === "file" && audioRef.current) {
      const a = audioRef.current;
      if (a.paused) a.play().then(() => setStatus("playing")).catch(() => {});
      else {
        a.pause();
        setStatus("paused");
      }
      return;
    }
    if (status === "playing") {
      // pausa robusta: si interrompe e si riprende dalla frase corrente
      session.current++;
      window.speechSynthesis.cancel();
      setStatus("paused");
    } else if (status === "paused") {
      session.current++;
      setStatus("playing");
      speakFrom(index.current);
    } else {
      play(trackRef.current);
    }
  }, [mode, status, play, speakFrom]);

  const setRate = useCallback(
    (r: number) => {
      rateRef.current = r;
      setRateState(r);
      if (audioRef.current) audioRef.current.playbackRate = r;
      if (mode === "tts" && status === "playing") {
        session.current++;
        window.speechSynthesis.cancel();
        speakFrom(index.current);
      }
    },
    [mode, status, speakFrom],
  );

  const value = useMemo(
    () => ({ track, status, progress, rate, mode, ttsSupported, play, toggle, stop, setRate }),
    [track, status, progress, rate, mode, ttsSupported, play, toggle, stop, setRate],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
