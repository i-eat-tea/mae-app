/**
 * ម៉ែ — by FlowErs
 * Content Entry & Management Interface
 *
 * Implements Section 9 of the refinement brief:
 * Clearly labeled fields for the FlowErs team to input verified resources one-by-one.
 */

import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { PregnancyResource, ResourceStatus } from '../types';
import { useApp } from '../context/AppContext';

const CATEGORIES = [
  'អាហារូបត្ថម្ភ (Nutrition)',
  'ការពិនិត្យសុខភាព (Checkups)',
  'ការថែទាំកាយនិងចិត្ត (Wellbeing)',
  'ចំណេះដឹងទូទៅអំឡុងពេលមានផ្ទៃពោះ (Pregnancy Basics)',
  'ការត្រៀមខ្លួនសម្រាល (Preparation for Birth)',
];

const STAGES = [
  'ត្រីមាសទី ១ (សប្ដាហ៍ ១-១២)',
  'ត្រីមាសទី ២ (សប្ដាហ៍ ១៣-២៧)',
  'ត្រីមាសទី ៣ (សប្ដាហ៍ ២៨-៤០)',
  'គ្រប់ដំណាក់កាលនៃការពពោះ',
];

interface ContentEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceToEdit: PregnancyResource | null;
}

export const ContentEntryModal: React.FC<ContentEntryModalProps> = ({
  isOpen,
  onClose,
  resourceToEdit,
}) => {
  const { addResource, updateResource, deleteResource, showToast, t } = useApp();

  const [titleKh, setTitleKh] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1]);
  const [pregnancyStage, setPregnancyStage] = useState(STAGES[0]);
  const [pregnancyWeeksStr, setPregnancyWeeksStr] = useState('8, 9, 10, 11, 12');
  const [summaryKh, setSummaryKh] = useState('');
  const [summaryEn, setSummaryEn] = useState('');
  const [summaryPurpose, setSummaryPurpose] = useState('');
  const [weeklyFocus, setWeeklyFocus] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [audioDuration, setAudioDuration] = useState('');
  const [audioTranscriptKh, setAudioTranscriptKh] = useState('');
  const [status, setStatus] = useState<ResourceStatus>('Published');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (resourceToEdit) {
      setTitleKh(resourceToEdit.titleKh || resourceToEdit.title || '');
      setTitleEn(resourceToEdit.titleEn || '');
      setSourceName(resourceToEdit.sourceName || '');
      setSourceUrl(resourceToEdit.sourceUrl || '');
      setCategory(resourceToEdit.category || CATEGORIES[1]);
      setPregnancyStage(resourceToEdit.pregnancyStage || STAGES[0]);
      setPregnancyWeeksStr((resourceToEdit.pregnancyWeeks || [9]).join(', '));
      setSummaryKh(resourceToEdit.summaryKh || resourceToEdit.summary || '');
      setSummaryEn(resourceToEdit.summaryEn || '');
      setSummaryPurpose(resourceToEdit.summaryPurpose || '');
      setWeeklyFocus(resourceToEdit.weeklyFocus || '');
      setAudioUrl(resourceToEdit.audioUrl || '');
      setAudioDuration(resourceToEdit.audioDuration || '');
      setAudioTranscriptKh(resourceToEdit.audioTranscriptKh || '');
      setStatus(resourceToEdit.status || 'Published');
    } else {
      setTitleKh('');
      setTitleEn('');
      setSourceName('');
      setSourceUrl('');
      setCategory(CATEGORIES[1]);
      setPregnancyStage(STAGES[0]);
      setPregnancyWeeksStr('8, 9, 10');
      setSummaryKh('');
      setSummaryEn('');
      setSummaryPurpose('');
      setWeeklyFocus('');
      setAudioUrl('');
      setAudioDuration('');
      setAudioTranscriptKh('');
      setStatus('Published');
    }
    setErrorMsg(null);
  }, [resourceToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titleKh.trim() && !titleEn.trim()) {
      setErrorMsg('សូមបញ្ចូលចំណងជើងជាភាសាខ្មែរ ឬអង់គ្លេស។ (Please provide a title)');
      return;
    }
    if (!sourceName.trim()) {
      setErrorMsg('សូមបញ្ចូលឈ្មោះស្ថាប័ន ឬប្រភព (Source / Organization)');
      return;
    }
    if (!sourceUrl.trim() || !sourceUrl.startsWith('http')) {
      setErrorMsg('សូមបញ្ចូលតំណភ្ជាប់ឯកសារដើមត្រឹមត្រូវ (Original Source Link starting with http)');
      return;
    }
    if (!summaryKh.trim() && !summaryEn.trim()) {
      setErrorMsg('សូមបញ្ចូលសេចក្តីសង្ខេប (Summary)');
      return;
    }

    const weeks = pregnancyWeeksStr
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n >= 1 && n <= 42);

    const payload = {
      titleKh: titleKh.trim() || titleEn.trim(),
      titleEn: titleEn.trim() || titleKh.trim(),
      sourceName: sourceName.trim(),
      sourceUrl: sourceUrl.trim(),
      category,
      pregnancyStage,
      pregnancyWeeks: weeks.length > 0 ? weeks : [9],
      summaryKh: summaryKh.trim() || summaryEn.trim(),
      summaryEn: summaryEn.trim() || summaryKh.trim(),
      summaryPurpose: summaryPurpose.trim(),
      weeklyFocus: weeklyFocus.trim(),
      audioUrl: audioUrl.trim() || undefined,
      audioDuration: audioDuration.trim() || undefined,
      audioTranscriptKh: audioTranscriptKh.trim() || undefined,
      status,
    };

    if (resourceToEdit) {
      updateResource(resourceToEdit.id, payload);
    } else {
      addResource(payload);
    }

    onClose();
  };

  const handleDelete = () => {
    if (resourceToEdit && confirm('តើអ្នកពិតជាចង់លុបឯកសារនេះមែនទេ? (Delete resource?)')) {
      deleteResource(resourceToEdit.id);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#FAF9F5] border border-[#E5EADF] shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#E5EADF] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-[#EBF1E4] border border-[#88A04D]/30 flex items-center justify-center text-sm">
              📝
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-[#233125]">
                {resourceToEdit ? 'កែសម្រួលឯកសារ (Edit Resource)' : 'បញ្ចូលឯកសារចំណេះដឹង (Add Resource)'}
              </h2>
              <p className="text-xs text-[#5F6E60]">
                FlowErs Curated Content Protocol · សម្រាប់ក្រុមការងារ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#5F6E60] hover:text-[#233125] rounded-full hover:bg-[#FAF9F5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[72vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title - Khmer */}
          <div>
            <label className="block text-xs font-bold text-[#233125] mb-1">
              Title — Khmer (ចំណងជើងជាភាសាខ្មែរ) *
            </label>
            <input
              type="text"
              required
              value={titleKh}
              onChange={(e) => setTitleKh(e.target.value)}
              placeholder="ឧទាហរណ៍៖ ការពិនិត្យផ្ទៃពោះតាមកាលកំណត់ និងពិធីសារសុវត្ថិភាពមាតុភាព"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5EADF] text-xs sm:text-sm text-[#233125] focus:border-[#88A04D] focus:ring-1 focus:ring-[#88A04D]"
            />
          </div>

          {/* Title - English */}
          <div>
            <label className="block text-xs font-semibold text-[#5F6E60] mb-1">
              Title — English (ចំណងជើងជាភាសាអង់គ្លេស)
            </label>
            <input
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="e.g. Routine Antenatal Care Protocols & Safe Motherhood"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5EADF] text-xs sm:text-sm text-[#233125] focus:border-[#88A04D]"
            />
          </div>

          {/* Source / Organization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#233125] mb-1">
                Source / Organization (ស្ថាប័ន / ប្រភព) *
              </label>
              <input
                type="text"
                required
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                placeholder="ឧទាហរណ៍៖ ក្រសួងសុខាភិបាលកម្ពុជា / NMCHC, WHO, UNICEF, RHAC"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5EADF] text-xs sm:text-sm text-[#233125] focus:border-[#88A04D]"
              />
            </div>

            {/* Original Source Link */}
            <div>
              <label className="block text-xs font-bold text-[#233125] mb-1">
                Original Source Link (តំណភ្ជាប់ឯកសារដើម) *
              </label>
              <input
                type="url"
                required
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://nmchc.moh.gov.kh/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5EADF] text-xs sm:text-sm text-[#233125] focus:border-[#88A04D]"
              />
              <span className="text-[10px] text-[#5C7034] italic block mt-0.5">
                👉 This is where you put the original source link.
              </span>
            </div>
          </div>

          {/* Category & Pregnancy Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#233125] mb-1">
                Category (ប្រភេទ)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5EADF] text-xs sm:text-sm text-[#233125] focus:border-[#88A04D]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#233125] mb-1">
                Pregnancy Stage / Week (ដំណាក់កាល / សប្ដាហ៍)
              </label>
              <select
                value={pregnancyStage}
                onChange={(e) => setPregnancyStage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5EADF] text-xs sm:text-sm text-[#233125] focus:border-[#88A04D]"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-[#5C7034] italic block mt-0.5">
                👉 This is where you connect it to the pregnancy stage.
              </span>
            </div>
          </div>

          {/* Khmer Summary */}
          <div>
            <label className="block text-xs font-bold text-[#233125] mb-1">
              Khmer Summary (សេចក្តីសង្ខេបជាភាសាខ្មែរ) *
            </label>
            <textarea
              required
              rows={3}
              value={summaryKh}
              onChange={(e) => setSummaryKh(e.target.value)}
              placeholder="សរសេរជាភាសាខ្មែរទន់ភ្លន់ ដូចម៉ែនិយាយប្រាប់កូនស្រី..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5EADF] text-xs sm:text-sm text-[#233125] focus:border-[#88A04D]"
            />
            <span className="text-[10px] text-[#5C7034] italic block mt-0.5">
              👉 This is where you put your summary.
            </span>
          </div>

          {/* English Summary */}
          <div>
            <label className="block text-xs font-semibold text-[#5F6E60] mb-1">
              English Summary (សេចក្តីសង្ខេបជាភាសាអង់គ្លេស)
            </label>
            <textarea
              rows={2}
              value={summaryEn}
              onChange={(e) => setSummaryEn(e.target.value)}
              placeholder="Warm, simplified maternal English summary..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5EADF] text-xs sm:text-sm text-[#233125] focus:border-[#88A04D]"
            />
            <span className="text-[10px] text-[#5C7034] italic block mt-0.5">
              👉 This is where you put your English summary.
            </span>
          </div>

          {/* What this information should help the mother understand */}
          <div>
            <label className="block text-xs font-bold text-[#233125] mb-1">
              What should this information help the mother understand? (តើព័ត៌មាននេះជួយឱ្យម្តាយយល់ដឹងពីអ្វី?)
            </label>
            <textarea
              rows={2}
              value={summaryPurpose}
              onChange={(e) => setSummaryPurpose(e.target.value)}
              placeholder="ឧទាហរណ៍៖ ជួយឱ្យម្តាយដឹងច្បាស់ពីសារៈសំខាន់នៃការពិនិត្យផ្ទៃពោះដំបូង និងកាត់បន្ថយការភ័យខ្លាច..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5EADF] text-xs sm:text-sm text-[#233125] focus:border-[#88A04D]"
            />
            <span className="text-[10px] text-[#5C7034] italic block mt-0.5">
              👉 This is where you explain what the summary is supposed to help with.
            </span>
          </div>

          {/* Weekly / Stage Focus */}
          <div>
            <label className="block text-xs font-bold text-[#233125] mb-1">
              Weekly / Stage Focus (ចំណុចសំខាន់សម្រាប់ផ្តោតយកចិត្តទុកដាក់)
            </label>
            <input
              type="text"
              value={weeklyFocus}
              onChange={(e) => setWeeklyFocus(e.target.value)}
              placeholder="ឧទាហរណ៍៖ កក់ការណាត់ជួបគ្រូពេទ្យលើកដំបូង និងរៀបចំសៀវភៅតាមដានសុខភាពមាតា"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5EADF] text-xs sm:text-sm text-[#233125] focus:border-[#88A04D]"
            />
          </div>

          {/* Optional Audio Integration (Supabase Storage reference) */}
          <div className="p-3.5 rounded-2xl bg-[#F0F4E8]/60 border border-[#88A04D]/25 space-y-3">
            <h4 className="text-xs font-bold text-[#5C7034] uppercase tracking-wider">
              🎙️ Supabase Storage Audio (ស្រេចចិត្ត / Optional)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#5F6E60] mb-1">
                  Storage Audio Path (e.g. Psi_audio/1.mp3)
                </label>
                <input
                  type="text"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  placeholder="Psi_audio/1.mp3"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E5EADF] text-xs text-[#233125] focus:border-[#88A04D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5F6E60] mb-1">
                  Audio Duration (e.g. 2:15)
                </label>
                <input
                  type="text"
                  value={audioDuration}
                  onChange={(e) => setAudioDuration(e.target.value)}
                  placeholder="2:15"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E5EADF] text-xs text-[#233125] focus:border-[#88A04D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5F6E60] mb-1">
                Audio Transcript (Khmer Conversation)
              </label>
              <textarea
                rows={3}
                value={audioTranscriptKh}
                onChange={(e) => setAudioTranscriptKh(e.target.value)}
                placeholder="ឆ្មប៖ ជម្រាបសួរ...&#10;ម្តាយ៖ ជម្រាបសួរ..."
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E5EADF] text-xs text-[#233125] focus:border-[#88A04D]"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-4 pt-1">
            <span className="text-xs font-bold text-[#233125]">Status:</span>
            <label className="inline-flex items-center gap-1.5 text-xs text-[#233125] cursor-pointer">
              <input
                type="radio"
                name="status"
                value="Published"
                checked={status === 'Published'}
                onChange={() => setStatus('Published')}
                className="accent-[#88A04D]"
              />
              <span>Published (ផ្សាយជាផ្លូវការ)</span>
            </label>
            <label className="inline-flex items-center gap-1.5 text-xs text-[#5F6E60] cursor-pointer">
              <input
                type="radio"
                name="status"
                value="Draft"
                checked={status === 'Draft'}
                onChange={() => setStatus('Draft')}
                className="accent-[#88A04D]"
              />
              <span>Draft (សេចក្តីព្រាង)</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#E5EADF] flex items-center justify-between gap-3">
            {resourceToEdit ? (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>លុបឯកសារ</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-full bg-white border border-[#E5EADF] text-xs font-medium text-[#5F6E60] hover:text-[#233125] transition-colors"
              >
                បោះបង់
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#88A04D] hover:bg-[#5C7034] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{resourceToEdit ? 'រក្សាទុកការកែប្រែ' : 'បញ្ចូលឯកសារ'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
