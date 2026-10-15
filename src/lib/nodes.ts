import { INITIAL_PREGNANCY_RESOURCES } from '../data/resources';
import { STAGE_FOCUS_TOPICS } from '../data/monthlyMessages';
import { CURATED_WEEKLY_GUIDANCE } from '../data/weeklyGuidance';
export interface L { km?: string; en?: string }
export interface Source { name: string; url: string }
export interface InfoNode { id: string; kind: 'resource'|'focus'|'weekly'; category: string; title: L; summary: L; why?: L; tip?: L; questions?: { km?: string[]; en?: string[] }; weeks?: number[]; weekLabel?: string; sources: Source[]; safetyCritical?: boolean }
export function buildNodes(): InfoNode[] {
  const nodes: InfoNode[] = [];
  // 11 resources
  for (const r of INITIAL_PREGNANCY_RESOURCES) {
    nodes.push({
      id: r.id, kind: 'resource',
      category: r.category,
      title: { km: r.titleKh, en: r.titleEn },
      summary: { km: r.summaryKh, en: r.summaryEn },
      why: { km: r.summaryPurpose, en: r.summaryPurpose },
      tip: { km: r.weeklyFocus, en: r.weeklyFocus },
      weeks: r.pregnancyWeeks,
      weekLabel: r.pregnancyWeeks.length === 40 ? 'All weeks' : `Weeks ${Math.min(...r.pregnancyWeeks)}–${Math.max(...r.pregnancyWeeks)}`,
      sources: [{ name: r.sourceName, url: r.sourceUrl }],
      safetyCritical: (r as any).is_safety_critical,
    });
  }
  // 3 focus topics (key 3 / month 3)
  const focus = STAGE_FOCUS_TOPICS[3];
  if (focus) {
    for (const t of focus.topics) {
      const srcs: Source[] = [];
      for (const rid of (t as any).resourceIds || []) {
        const r = INITIAL_PREGNANCY_RESOURCES.find(x => x.id === rid);
        if (r) srcs.push({ name: r.sourceName, url: r.sourceUrl });
      }
      nodes.push({
        id: t.id, kind: 'focus',
        category: t.category,
        title: { km: t.titleKh, en: t.titleEn },
        summary: { km: t.summaryKh, en: t.summaryEn },
        questions: { km: (t as any).suggestedQuestionsKh, en: (t as any).suggestedQuestionsEn },
        sources: srcs,
      });
    }
  }
  // 13 weekly topics (weeks 8,9,10,12 and generic others)
  const weekKeys = [8,9,10,12];
  for (const w of weekKeys) {
    const wg = CURATED_WEEKLY_GUIDANCE[w];
    if (!wg) continue;
    for (const t of wg.topics) {
      const srcs: Source[] = [];
      for (const rid of (t as any).resourceIds || []) {
        const r = INITIAL_PREGNANCY_RESOURCES.find(x => x.id === rid);
        if (r) srcs.push({ name: r.sourceName, url: r.sourceUrl });
      }
      nodes.push({
        id: t.id + '-' + w, kind: 'weekly',
        category: t.category,
        title: { en: t.title },
        summary: { en: t.summary },
        questions: { en: (t as any).suggestedQuestions },
        weekLabel: `Week ${w}`,
        sources: srcs,
      });
    }
  }
  return nodes;
}
