/**
 * FlowErs MVP Validation & Analytics Inspector
 * Provides researchers and founders live visibility into user events:
 * Audio playback rates, topic clicks, resource inquiries, onboarding completion.
 */

import React from 'react';
import { X, Download, Trash2, Activity, Play, CheckCircle2, BookOpen, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnalyticsDashboardModal: React.FC = () => {
  const { analyticsEvents, isAnalyticsOpen, setIsAnalyticsOpen, clearAnalytics } = useApp();

  if (!isAnalyticsOpen) return null;

  // Aggregate stats
  const signups = analyticsEvents.filter((e) => e.eventName === 'signup_completed' || e.eventName === 'account_created').length;
  const onboarding = analyticsEvents.filter((e) => e.eventName === 'onboarding_completed').length;
  const audioPlays = analyticsEvents.filter((e) => e.eventName === 'monthly_message_played' || e.eventName === 'weekly_guidance_played').length;
  const audioCompletes = analyticsEvents.filter((e) => e.eventName === 'monthly_message_completed' || e.eventName === 'weekly_guidance_completed').length;
  const topicClicks = analyticsEvents.filter((e) => e.eventName === 'topic_opened').length;
  const resourceReads = analyticsEvents.filter((e) => e.eventName === 'resource_opened').length;
  const markedReads = analyticsEvents.filter((e) => e.eventName === 'resource_marked_read').length;
  const externalSourceClicks = analyticsEvents.filter((e) => e.eventName === 'original_source_clicked').length;

  const downloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analyticsEvents, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `mae_mvp_events_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="analytics-modal-title"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#FAF9F5] border border-[#E5EADF] shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#E5EADF] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EBF1E4] flex items-center justify-center text-[#88A04D]">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h2 id="analytics-modal-title" className="text-base sm:text-lg font-semibold text-[#233125]">
                MVP Validation & Research Telemetry
              </h2>
              <p className="text-xs text-[#5F6E60]">
                Live event tracking configured for ម៉ែ — by FlowErs MVP hypothesis testing.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAnalyticsOpen(false)}
            className="p-2 text-[#5F6E60] hover:text-[#233125] rounded-full hover:bg-[#FAF9F5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Metric KPI cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-[#E5EADF]">
              <span className="text-[11px] font-medium text-[#5F6E60] block mb-1">
                Audio Guidance Plays
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-[#233125] font-mono tabular-nums">{audioPlays}</span>
                <span className="text-[11px] text-[#88A04D]">({audioCompletes} finished)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E5EADF]">
              <span className="text-[11px] font-medium text-[#5F6E60] block mb-1">
                Topic Focus Explored
              </span>
              <span className="text-2xl font-bold text-[#233125] font-mono tabular-nums">{topicClicks}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E5EADF]">
              <span className="text-[11px] font-medium text-[#5F6E60] block mb-1">
                Resource Deep Dives
              </span>
              <span className="text-2xl font-bold text-[#233125] font-mono tabular-nums">{resourceReads}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E5EADF]">
              <span className="text-[11px] font-medium text-[#5F6E60] block mb-1">
                Original Sources Clicked
              </span>
              <span className="text-2xl font-bold text-[#233125] font-mono tabular-nums">{externalSourceClicks}</span>
            </div>
          </div>

          {/* Event Stream Log */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5F6E60]">
                Event Stream Log ({analyticsEvents.length} events recorded)
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={downloadJson}
                  className="text-xs text-[#88A04D] hover:text-[#5C7034] font-medium flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={clearAnalytics}
                  className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-[#E5EADF] divide-y divide-[#E5EADF]/60 overflow-hidden max-h-56 overflow-y-auto font-mono text-xs">
              {analyticsEvents.length === 0 ? (
                <div className="p-6 text-center text-[#5F6E60] font-sans">
                  No events logged yet. Interact with the website, play audio, or open topics to record events.
                </div>
              ) : (
                analyticsEvents.map((evt) => (
                  <div key={evt.id} className="p-3 flex items-start justify-between gap-3 hover:bg-[#FAF9F5]">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#233125]">{evt.eventName}</span>
                        {evt.pregnancyWeek && (
                          <span className="text-[11px] text-[#88A04D]">Wk {evt.pregnancyWeek}</span>
                        )}
                      </div>
                      {evt.contentId && (
                        <p className="text-[11px] text-[#5F6E60]">ID: {evt.contentId}</p>
                      )}
                    </div>
                    <span className="text-[10px] text-[#5F6E60] tabular-nums shrink-0">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E5EADF] flex justify-end">
          <button
            type="button"
            onClick={() => setIsAnalyticsOpen(false)}
            className="px-5 py-2 rounded-full bg-[#FAF9F5] border border-[#E5EADF] text-[#233125] text-xs font-medium hover:bg-[#F0F4E8]"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
