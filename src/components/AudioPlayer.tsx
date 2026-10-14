/**
 * ម៉ែ — by FlowErs
 * "ម៉ែចង់ប្រាប់កូន" (A Message from Mom)
 *
 * Warm, emotional monthly voice player with real HTML5 audio playback,
 * speed adjustment, seamless speech synthesis fallback, and an expandable
 * "Read the letter" section that is open by default.
 *
 * Attribution: Voice message courtesy of PSI (អង្គការ PSI).
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FileText,
  Sparkles,
  Heart,
  ChevronDown,
  ChevronUp,
  Gauge,
  Radio,
  CalendarCheck,
} from 'lucide-react';
import { PlanSuggestion } from '../types';
import { useApp } from '../context/AppContext';
import { getStorageAudioUrl } from '../lib/supabase';
import { FeedbackCard } from './FeedbackCard';
import { AddToPlanSheet } from './AddToPlanSheet';

interface AudioPlayerProps {
  title?: string;
  subtitle?: string;
  transcript: string;
  letter?: string;
  audioUrl?: string;
  durationStr?: string;
  monthOrWeek?: number;
  sourceType?: 'resource' | 'voice_message';
  sourceId?: string;
  planSuggestions?: PlanSuggestion[];
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  title,
  subtitle,
  transcript,
  letter,
  audioUrl,
  durationStr = '2:15',
  monthOrWeek = 1,
  sourceType = 'voice_message',
  sourceId,
  planSuggestions,
}) => {
  const { logEvent, t, language, isPremium, setIsUpgradeModalOpen } = useApp();

  const resolvedAudioUrl = useMemo(() => {
    return getStorageAudioUrl(audioUrl);
  }, [audioUrl]);

  const hasAudioSource = Boolean(resolvedAudioUrl && resolvedAudioUrl.trim() !== '');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const synthIntervalRef = useRef<any>(null);

  // Playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSourceMode, setAudioSourceMode] = useState<'html5' | 'synthesis'>('html5');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasListened, setHasListened] = useState(false);

  // Expandable transcript: Open by default
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(true);
  const [isPlanSheetOpen, setIsPlanSheetOpen] = useState(false);

  // Keep track of listening time for telemetry
  const listenedSecondsRef = useRef<number>(0);
  const playbackStartTimestampRef = useRef<number | null>(null);

  const displayTitle = title || t('សារសំឡេងប្រចាំខែពីម៉ែ 🌸', 'Monthly Voice Message from Mom 🌸');
  const displaySubtitle = subtitle || t('«មានសារតូចមួយសម្រាប់អ្នកក្នុងខែនេះ»', '"A short message for you this month"');
  const displayTranscript = transcript || letter || '';

  const activePlanSuggestions = planSuggestions && planSuggestions.length > 0
    ? planSuggestions
    : [
        {
          id: `voice_plan_m${monthOrWeek}_1`,
          text_kh: 'អ្នកអាចពិចារណាសម្រាកឱ្យបានគ្រប់គ្រាន់ និងពិសាទឹកស្អាតឱ្យបានច្រើន',
          text_en: 'You may want to consider getting adequate rest and drinking plenty of clean water',
        },
        {
          id: `voice_plan_m${monthOrWeek}_2`,
          text_kh: 'អ្នកអាចពិចារណាធ្វើចិត្តឱ្យស្រស់ស្រាយ និងញ៉ាំអាហារក្តៅៗដែលងាយរំលាយ',
          text_en: 'You may want to consider keeping a calm spirit and eating warm, gentle meals',
        },
      ];

  // Convert initial "2:15" string to seconds as fallback duration
  const fallbackDurationSeconds = (() => {
    const parts = durationStr.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return 135;
  })();

  const activeDuration = duration > 0 ? duration : fallbackDurationSeconds;

  const formatSeconds = (sec: number): string => {
    if (isNaN(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Helper to accumulate listened duration
  const accumulateListenedTime = () => {
    if (playbackStartTimestampRef.current !== null) {
      const elapsed = (Date.now() - playbackStartTimestampRef.current) / 1000;
      listenedSecondsRef.current += elapsed;
      playbackStartTimestampRef.current = null;
    }
  };

  // Speech Synthesis Fallback
  const startSpeechSynthesis = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(transcript);
    utterance.rate = 0.88 * playbackSpeed;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const matchVoice = voices.find((v) =>
      language === 'km' ? v.lang.startsWith('km') : v.lang.startsWith('en')
    );
    if (matchVoice) utterance.voice = matchVoice;

    synthUtteranceRef.current = utterance;

    utterance.onend = () => {
      accumulateListenedTime();
      setIsPlaying(false);
      setCurrentTime(activeDuration);
      setHasListened(true);
      logEvent(
        'monthly_message_completed',
        `mom_voice_m${monthOrWeek}`,
        monthOrWeek,
        { seconds_listened: Math.round(listenedSecondsRef.current) }
      );
    };

    utterance.onerror = () => {
      accumulateListenedTime();
      setIsPlaying(false);
    };

    // Simulate progress timer for speech synthesis
    if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
    synthIntervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 1;
        if (next >= activeDuration) {
          clearInterval(synthIntervalRef.current!);
          return activeDuration;
        }
        return next;
      });
    }, 1000 / playbackSpeed);

    try {
      window.speechSynthesis.speak(utterance);
    } catch {}
  };

  const stopSpeechSynthesis = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  // Play / Pause Handlers
  const handleTogglePlay = async () => {
    if (!isPlaying) {
      // START PLAYBACK
      setIsPlaying(true);
      playbackStartTimestampRef.current = Date.now();
      logEvent('monthly_message_played', `mom_voice_m${monthOrWeek}`, monthOrWeek, {
        source_mode: audioSourceMode,
        playback_rate: playbackSpeed,
      });

      if (audioSourceMode === 'html5' && audioRef.current) {
        try {
          audioRef.current.playbackRate = playbackSpeed;
          audioRef.current.muted = isMuted;
          await audioRef.current.play();
        } catch (err) {
          // If HTML5 audio fails to play (e.g. 404 on local /audio/month-X.mp3 file), fall back gracefully to synthesis!
          console.warn('[AudioPlayer] Audio file play failed, falling back to speech synthesis:', err);
          setAudioSourceMode('synthesis');
          startSpeechSynthesis();
        }
      } else {
        startSpeechSynthesis();
      }
    } else {
      // PAUSE / STOP PARTWAY
      accumulateListenedTime();
      setIsPlaying(false);
      setHasListened(true);

      if (audioSourceMode === 'html5' && audioRef.current) {
        audioRef.current.pause();
      } else {
        stopSpeechSynthesis();
      }

      // Log stop partway event with listened seconds
      logEvent(
        'monthly_message_completed',
        `mom_voice_m${monthOrWeek}`,
        monthOrWeek,
        {
          seconds_listened: Math.round(listenedSecondsRef.current),
          stopped_early: true,
        }
      );
    }
  };

  const handleReplay = () => {
    accumulateListenedTime();
    setCurrentTime(0);
    listenedSecondsRef.current = 0;
    playbackStartTimestampRef.current = Date.now();
    setIsPlaying(true);

    logEvent('monthly_message_played', `mom_voice_m${monthOrWeek}`, monthOrWeek, {
      action: 'replay',
    });

    if (audioSourceMode === 'html5' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().catch(() => {
        setAudioSourceMode('synthesis');
        startSpeechSynthesis();
      });
    } else {
      stopSpeechSynthesis();
      startSpeechSynthesis();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSec = parseFloat(e.target.value);
    setCurrentTime(newSec);
    if (audioSourceMode === 'html5' && audioRef.current) {
      audioRef.current.currentTime = newSec;
    }
  };

  // Speed controls: toggle between 0.8x, 1.0x, 1.2x
  const handleToggleSpeed = () => {
    const speeds = [1.0, 1.2, 0.8];
    const nextSpeedIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextSpeedIndex];
    setPlaybackSpeed(nextSpeed);

    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
    if (audioSourceMode === 'synthesis' && isPlaying) {
      stopSpeechSynthesis();
      startSpeechSynthesis();
    }
  };

  // HTML5 audio event handlers
  const onAudioLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration) {
      setDuration(audioRef.current.duration);
    }
  };

  const onAudioTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onAudioEnded = () => {
    accumulateListenedTime();
    setIsPlaying(false);
    setHasListened(true);
    logEvent(
      'monthly_message_completed',
      `mom_voice_m${monthOrWeek}`,
      monthOrWeek,
      {
        seconds_listened: Math.round(listenedSecondsRef.current),
        completed_natural: true,
      }
    );
  };

  const onAudioError = () => {
    console.warn('[AudioPlayer] Audio file not available yet, setting fallback mode.');
    setAudioSourceMode('synthesis');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeechSynthesis();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const progressPercent = activeDuration > 0 ? (currentTime / activeDuration) * 100 : 0;

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#F0F4E8]/90 via-white to-[#FAF9F5] border border-[#E5EADF] p-5 sm:p-7 shadow-xs space-y-4">
      {/* Real HTML5 Audio Element */}
      {resolvedAudioUrl && (
        <audio
          ref={audioRef}
          src={resolvedAudioUrl}
          preload="metadata"
          onLoadedMetadata={onAudioLoadedMetadata}
          onTimeUpdate={onAudioTimeUpdate}
          onEnded={onAudioEnded}
          onError={onAudioError}
        />
      )}

      {/* Header with Title and Visible PSI Attribution Credit */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#88A04D]/30 text-xs font-semibold text-[#5C7034] shadow-2xs">
              <Heart className="w-3.5 h-3.5 fill-[#88A04D] text-[#88A04D]" />
              <span>{t('សារសំឡេងណែនាំ 🌸', 'Voice Guidance 🌸')}</span>
            </span>

            {/* Credit Badge: Voice message courtesy of PSI */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-[#E5EADF] text-[11px] font-medium text-[#5F6E60]">
              <Radio className="w-3 h-3 text-[#88A04D]" />
              <span>{t('សារសំឡេងទទួលបានការអនុញ្ញាតពីអង្គការ PSI', 'Voice message courtesy of PSI')}</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#233125] leading-snug pt-1">
            {displayTitle}
          </h2>

          <p className="text-xs sm:text-sm text-[#5C7034] italic font-medium">
            {displaySubtitle}
          </p>
        </div>

        {/* Speed Adjustment Badge */}
        <button
          type="button"
          onClick={handleToggleSpeed}
          className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#FAF9F5] border border-[#E5EADF] text-xs font-semibold text-[#233125] transition-colors shadow-2xs"
          title={t('ល្បឿនចាក់', 'Playback speed')}
        >
          <Gauge className="w-3.5 h-3.5 text-[#88A04D]" />
          <span>{playbackSpeed.toFixed(1)}x</span>
        </button>
      </div>

      {/* Progress & Scrub Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={activeDuration}
            step={0.5}
            value={currentTime}
            onChange={handleSeek}
            disabled={!hasAudioSource && audioSourceMode !== 'synthesis'}
            className="w-full h-2 rounded-lg bg-[#E5EADF] accent-[#88A04D] cursor-pointer disabled:opacity-50"
            aria-label="Seek audio"
          />
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-[#5F6E60]">
          <span>{formatSeconds(currentTime)}</span>
          <span>{formatSeconds(activeDuration)}</span>
        </div>
      </div>

      {/* Player Control Buttons */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {/* Replay Button */}
          <button
            type="button"
            onClick={handleReplay}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-full border border-[#E5EADF] bg-white hover:bg-[#FAF9F5] text-[#5F6E60] hover:text-[#233125] transition-colors shadow-2xs"
            title={t('ស្តាប់ឡើងវិញ', 'Replay')}
            aria-label="Replay audio"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Mute Toggle */}
          <button
            type="button"
            onClick={() => {
              const nextMuted = !isMuted;
              setIsMuted(nextMuted);
              if (audioRef.current) audioRef.current.muted = nextMuted;
            }}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-full border border-[#E5EADF] bg-white hover:bg-[#FAF9F5] text-[#5F6E60] hover:text-[#233125] transition-colors shadow-2xs"
            title={isMuted ? t('បើកសំឡេង', 'Unmute') : t('បិទសំឡេង', 'Mute')}
            aria-label="Toggle mute"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Add to My Plan Button (Preview for free, full edit for premium) */}
          <button
            type="button"
            onClick={() => setIsPlanSheetOpen(true)}
            className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#88A04D]/35 bg-white hover:bg-[#F0F4E8] text-xs font-semibold text-[#5C7034] transition-colors shadow-2xs"
            title={t('បញ្ចូលក្នុងគម្រោង', 'Add to My Plan')}
          >
            <CalendarCheck className="w-4 h-4 text-[#88A04D]" />
            <span className="hidden sm:inline">{t('បញ្ចូលក្នុងគម្រោង', 'Add to Plan')}</span>
          </button>
        </div>

        {/* Big Central Play / Pause Button */}
        <button
          type="button"
          onClick={handleTogglePlay}
          className="min-h-[48px] px-6 py-2.5 rounded-full bg-[#88A04D] hover:bg-[#5C7034] active:scale-[0.98] text-white flex items-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5 fill-white" />
              <span className="font-semibold text-sm">{t('ផ្អាកសំឡេង', 'Pause Voice')}</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-white ml-0.5" />
              <span className="font-semibold text-sm">
                {!hasAudioSource && audioSourceMode !== 'synthesis'
                  ? t('ស្តាប់សំឡេង', 'Listen to Voice')
                  : t('ស្តាប់សំឡេង', 'Listen to Voice')}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Expandable "Audio Transcript" Section (OPEN BY DEFAULT) */}
      <section className="pt-2 border-t border-[#E5EADF]">
        <button
          type="button"
          onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
          className="w-full flex items-center justify-between py-2 text-left text-xs sm:text-sm font-bold text-[#233125] hover:text-[#5C7034] transition-colors cursor-pointer"
          aria-expanded={isTranscriptOpen}
        >
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#EBF1E4] text-[#88A04D] flex items-center justify-center shrink-0">
              <FileText className="w-3.5 h-3.5" />
            </span>
            <span>{t('អត្ថបទសំឡេង / Audio Transcript', 'អត្ថបទសំឡេង / Audio Transcript')}</span>
          </div>

          <div className="flex items-center gap-1 text-[#5F6E60] text-xs font-normal">
            <span>{isTranscriptOpen ? t('បិទ', 'Hide') : t('បើកមើល', 'Show')}</span>
            {isTranscriptOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isTranscriptOpen && displayTranscript && (
          <div className="mt-2.5 p-4 sm:p-5 rounded-2xl bg-white border border-[#E5EADF] shadow-2xs space-y-3 animate-fade-in">
            <div className="flex items-center justify-between text-[11px] text-[#5C7034] font-medium border-b border-[#FAF9F5] pb-2">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#88A04D]" />
                <span>{t('អត្ថបទសន្ទនា', 'Audio Transcript')}</span>
              </span>
              <span className="text-[#5F6E60]">{t('សារសំឡេងទទួលបានការអនុញ្ញាតពីអង្គការ PSI', 'Voice message courtesy of PSI')}</span>
            </div>

            <div className="text-sm sm:text-base text-[#233125] leading-relaxed whitespace-pre-line font-sans">
              {displayTranscript}
            </div>
          </div>
        )}
      </section>

      {/* Feature Feedback Card after listening to or stopping voice message */}
      {hasListened && <FeedbackCard feature="voice_message" />}

      {/* Add To My Plan Bottom Sheet */}
      <AddToPlanSheet
        isOpen={isPlanSheetOpen}
        onClose={() => setIsPlanSheetOpen(false)}
        sourceType={sourceType}
        sourceId={sourceId || `mom_voice_m${monthOrWeek}`}
        sourceTitle={displayTitle}
        suggestions={activePlanSuggestions}
      />
    </div>
  );
};
