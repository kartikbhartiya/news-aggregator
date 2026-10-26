/**
 * Universal Audio Engine for PRISM
 * Uses high-quality server-synthesized MP3 audio stream with Web Speech API fallback.
 * Works flawlessly across Linux, Chromium, Firefox, Safari, and mobile without
 * relying on missing system TTS packages.
 */

class UniversalSpeechEngine {
  private currentAudio: HTMLAudioElement | null = null;
  private currentUrl: string | null = null;
  private isCurrentlyPlaying: boolean = false;
  private activeSpeed: number = 1.0;
  private onEndCallback: (() => void) | null = null;
  private onErrorCallback: ((err?: any) => void) | null = null;

  public isSupported(): boolean {
    return typeof window !== 'undefined' && typeof window.Audio !== 'undefined';
  }

  public getIsPlaying(): boolean {
    return this.isCurrentlyPlaying;
  }

  public speak(
    text: string,
    options: {
      rate?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err?: any) => void;
    } = {}
  ): boolean {
    if (!this.isSupported()) return false;

    try {
      this.stop();

      this.activeSpeed = options.rate || 1.0;
      this.onEndCallback = options.onEnd || null;
      this.onErrorCallback = options.onError || null;

      const cleanText = text
        .replace(/https?:\/\/\S+/g, '')
        .replace(/[*_#`~[\]()]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText) return false;

      // 1. Primary: Server-side High-Fidelity MP3 Audio Stream
      // Truncate cleanly if unreasonably long to ensure instant streaming
      const safeText = cleanText.length > 1200 ? cleanText.slice(0, 1200) + '...' : cleanText;
      const ttsUrl = `/api/news/tts?text=${encodeURIComponent(safeText)}`;
      
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = ttsUrl;
      audio.playbackRate = this.activeSpeed;
      this.currentAudio = audio;
      this.currentUrl = ttsUrl;

      audio.onplay = () => {
        this.isCurrentlyPlaying = true;
        options.onStart?.();
      };

      audio.onplaying = () => {
        this.isCurrentlyPlaying = true;
        options.onStart?.();
      };

      audio.onended = () => {
        this.isCurrentlyPlaying = false;
        this.onEndCallback?.();
      };

      audio.onerror = (e) => {
        console.warn('MP3 stream error, attempting Web Speech API fallback...', e);
        this.fallbackWebSpeech(safeText, options);
      };

      // Play synchronously within user gesture
      audio.load();
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isCurrentlyPlaying = true;
            options.onStart?.();
          })
          .catch((err) => {
            console.warn('Audio play deferred or failed, falling back to Web Speech:', err);
            this.fallbackWebSpeech(safeText, options);
          });
      }

      return true;
    } catch (err) {
      console.warn('Primary audio failed:', err);
      this.fallbackWebSpeech(text, options);
      return false;
    }
  }

  private fallbackWebSpeech(
    text: string,
    options: { rate?: number; onStart?: () => void; onEnd?: () => void; onError?: (err?: any) => void }
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.isCurrentlyPlaying = false;
      options.onError?.();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 1.0;
      utterance.lang = 'en-US';

      utterance.onstart = () => {
        this.isCurrentlyPlaying = true;
        options.onStart?.();
      };

      utterance.onend = () => {
        this.isCurrentlyPlaying = false;
        options.onEnd?.();
      };

      utterance.onerror = (e) => {
        this.isCurrentlyPlaying = false;
        options.onError?.(e);
      };

      (window as any).__prism_utterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      this.isCurrentlyPlaying = false;
      options.onError?.(e);
    }
  }

  public setSpeed(speed: number) {
    this.activeSpeed = speed;
    if (this.currentAudio) {
      this.currentAudio.playbackRate = speed;
    }
  }

  public pause() {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
      this.isCurrentlyPlaying = false;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  public resume() {
    if (this.currentAudio && this.currentAudio.paused) {
      this.currentAudio.play();
      this.isCurrentlyPlaying = true;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }

  public stop(): void {
    this.isCurrentlyPlaying = false;
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio.src = '';
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }
}

export const speechEngine = new UniversalSpeechEngine();
