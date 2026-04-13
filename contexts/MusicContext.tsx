"use client";

import {
    createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode
} from "react";
import { getMusicUrl } from "@/app/actions/profile";

interface MusicContextType {
    isPlaying: boolean;
    toggle: () => void;
    isReady: boolean;
}

const MusicContext = createContext<MusicContextType | null>(null);

export function useMusic() {
    const ctx = useContext(MusicContext);
    if (!ctx) throw new Error("useMusic must be used inside MusicProvider");
    return ctx;
}

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

function extractVideoId(url: string): string | null {
    if (!url) return null;

    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) return shortMatch[1];

    const longMatch = url.match(/[?&]v=([^?&]+)/);
    if (longMatch) return longMatch[1];

    if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();
    return null;
}

export function MusicProvider({ children }: { children: ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [videoId, setVideoId] = useState<string | null>(null);
    const playerRef = useRef<any>(null);
    const hasInteractedRef = useRef(false);

    useEffect(() => {
        getMusicUrl().then((url) => {
            if (url) setVideoId(extractVideoId(url));
        });
    }, []);

    const initPlayer = useCallback(() => {
        if (playerRef.current || !videoId) return;
        playerRef.current = new window.YT.Player("yt-music-player", {
            videoId,
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                iv_load_policy: 3,
                modestbranding: 1,
                rel: 0,
                loop: 1,
                playlist: videoId,
            },
            events: {
                onReady: (event: any) => {
                    event.target.setVolume(40);
                    setIsReady(true);
                    const saved = localStorage.getItem("cc-music-playing");
                    if (saved === "true" && hasInteractedRef.current) {
                        event.target.playVideo();
                        setIsPlaying(true);
                    }
                },
                onStateChange: (event: any) => {
                    if (event.data === 1) {
                        setIsPlaying(true);
                        localStorage.setItem("cc-music-playing", "true");
                    } else if (event.data === 2 || event.data === 0) {
                        setIsPlaying(false);
                        localStorage.setItem("cc-music-playing", "false");
                    }
                },
            },
        });
    }, [videoId]);

    useEffect(() => {
        if (!videoId) return;

        if (document.getElementById("yt-api-script")) {
            if (window.YT && window.YT.Player) {
                initPlayer();
            } else {
                window.onYouTubeIframeAPIReady = initPlayer;
            }
            return;
        }

        const tag = document.createElement("script");
        tag.id = "yt-api-script";
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
        window.onYouTubeIframeAPIReady = initPlayer;
    }, [videoId, initPlayer]);

    const toggle = useCallback(() => {
        if (!playerRef.current || !isReady) return;
        hasInteractedRef.current = true;
        if (isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    }, [isPlaying, isReady]);

    return (
        <MusicContext.Provider value={{ isPlaying, toggle, isReady }}>
            
            <div
                style={{
                    position: "fixed",
                    top: "-9999px",
                    left: "-9999px",
                    width: 1,
                    height: 1,
                    pointerEvents: "none",
                    visibility: "hidden",
                    zIndex: -1,
                }}
                aria-hidden="true"
            >
                <div id="yt-music-player" />
            </div>
            {children}
        </MusicContext.Provider>
    );
}
