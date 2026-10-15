import React, { useState, useEffect, useMemo } from 'react';
import { buildNodes } from './lib/nodes';
import { UI } from './lib/ui';

type Lang = 'km' | 'en';

export default function App() {
  const [lang, setLang] = useState<Lang>(() => {
    try { const s = localStorage.getItem('mae.lang'); return s === 'en' ? 'en' : 'km'; } catch { return 'km'; }
  });
  useEffect(() => { document.documentElement.lang = lang; try { localStorage.setItem('mae.lang', lang); } catch {} }, [lang]);

  const nodes = useMemo(() => buildNodes(), []);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const t = (l: { km?: string; en?: string } | undefined) => { if (!l) return ''; return (lang === 'km' ? l.km : l.en) || l.en || ''; };

  const catSlugToName: Record<string, string> = {
    checkups: 'ការពិនិត្យសុខភាព (Checkups)', nutrition: 'អាហារូបត្ថម្ភ (Nutrition)', wellbeing: 'ការថែទាំកាយនិងចិត្ត (Wellbeing)',
    basics: 'ចំណេះដឹងទូទៅអំឡុងពេលមានផ្ទៃពោះ (Pregnancy Basics)', preparation: 'ការត្រៀមខ្លួនសម្រាលនិងសំណួរ (Preparation & Questions)',
  };

  const visible = useMemo(() => nodes.filter((n) => {
    const fMatch = filter === 'all' || (filter === 'checkups' && n.category.includes('Checkups')) || (filter === 'nutrition' && n.category.includes('Nutrition')) || (filter === 'wellbeing' && n.category.includes('Wellbeing')) || (filter === 'basics' && n.category.includes('Basics')) || (filter === 'preparation' && n.category.includes('Preparation'));
    const q = query.trim().toLowerCase();
    return fMatch && (!q || (t(n.title) + ' ' + t(n.summary)).toLowerCase().includes(q));
  }), [nodes, filter, query, lang]);

  return (
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '3rem 1.5rem 5rem', fontFamily: '"Kantumruy Pro", system-ui, sans-serif', background: '#FAF9F5', color: '#233125', minHeight: '100vh' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500, fontSize: 'clamp(2.2rem,6vw,4rem)', lineHeight: 1.15, marginBottom: '.25rem' }}>ម៉ែ <span style={{ fontWeight: 400, fontStyle: 'italic', color: '#5C7034' }}>— by FlowErs</span></h1>
        <p style={{ color: '#5F6E60', fontSize: '.95rem' }}>Read &amp; Dip Info Hub — {nodes.length} nodes with real source links</p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button aria-pressed={lang==='km'} onClick={() => setLang('km')} style={{ padding: '.35rem .9rem', borderRadius: '.5rem', border: '1px solid #233125', background: lang==='km' ? '#233125' : '#fff', color: lang==='km' ? '#fff' : '#233125', fontSize: '.85rem', cursor: 'pointer', fontWeight: 600 }}>ខ្មែរ</button>
          <button aria-pressed={lang==='en'} onClick={() => setLang('en')} style={{ padding: '.35rem .9rem', borderRadius: '.5rem', border: '1px solid #233125', background: lang==='en' ? '#233125' : '#fff', color: lang==='en' ? '#fff' : '#233125', fontSize: '.85rem', cursor: 'pointer', fontWeight: 600 }}>English</button>
          <span style={{ fontSize: '.8rem', color: '#5F6E60', marginLeft: '.25rem' }}>{lang === 'km' ? 'ភាសា៖ ខ្មែរ' : 'Language: English'}</span>
        </div>
      </header>

      <main>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder={UI.searchPlaceholder[lang==='km'?'km':'en'] || ''} style={{ width: '100%', maxWidth: 420, padding: '.6rem 1rem', borderRadius: '.75rem', border: '1px solid #E5EADF', background: '#fff', fontSize: '.9rem', fontFamily: 'inherit', marginBottom: '1rem' }} />
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {['all','checkups','nutrition','wellbeing','basics','preparation'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '.35rem .8rem', borderRadius: '9999px', border: '1px solid #E5EADF', background: filter === f ? '#233125' : '#fff', color: filter === f ? '#fff' : '#233125', fontSize: '.75rem', fontWeight: 600, cursor: 'pointer' }}>{f === 'all' ? (UI.categories.all[lang==='km'?'km':'en']) : (UI.categories[f as keyof typeof UI.categories]?.[lang==='km'?'km':'en'] || f)}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1rem' }}>
          {visible.map(node => {
            const open = expanded === node.id;
            const titleText = t(node.title);
            const summaryText = t(node.summary);
            const whyText = node.why ? t(node.why) : '';
            const tipText = node.tip ? t(node.tip) : '';
            return (
              <article key={node.id} style={{ background: '#fff', border: '1px solid #E5EADF', borderRadius: '1.25rem', padding: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '.35rem', alignItems: 'center', marginBottom: '.25rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-block', fontSize: '.7rem', fontWeight: 600, padding: '.15rem .6rem', borderRadius: '9999px', background: '#F0F4E8', color: '#5C7034' }}>
                    {node.category.includes('Checkups') ? UI.categories.checkups[lang==='km'?'km':'en'] : node.category.includes('Nutrition') ? UI.categories.nutrition[lang==='km'?'km':'en'] : node.category.includes('Wellbeing') ? UI.categories.wellbeing[lang==='km'?'km':'en'] : node.category.includes('Basics') ? UI.categories.basics[lang==='km'?'km':'en'] : node.category.includes('Preparation') ? UI.categories.preparation[lang==='km'?'km':'en'] : node.category}
                  </span>
                  {node.safetyCritical && <span style={{ fontSize: '.7rem', fontWeight: 700, color: '#C44', border: '1px solid #C44', borderRadius: '9999px', padding: '.1rem .5rem' }}>⚠ Critical</span>}
                  <span style={{ fontSize: '.75rem', color: '#5F6E60' }}>{node.weekLabel || ''}</span>
                </div>
                <h3 style={{ margin: '.5rem 0 .25rem', fontFamily: '"Playfair Display", serif', fontSize: '1.1rem', fontWeight: 600 }}>{titleText}</h3>
                <p style={{ fontSize: '.88rem', color: '#5F6E60', lineHeight: 1.65, margin: '.25rem 0' }}>{summaryText}</p>
                <button aria-expanded={open} aria-controls={`d-${node.id}`} onClick={() => setExpanded(open ? null : node.id)} style={{ marginTop: '.5rem', padding: '.35rem .75rem', borderRadius: '.5rem', border: '1px solid #5C7034', background: open ? '#233125' : '#fff', color: open ? '#fff' : '#233125', fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{open ? 'Close ▾' : (UI.readButton[lang==='km'?'km':'en'] || 'Read more ▾')}</button>
                <div id={`d-${node.id}`} style={{ display: open ? 'block' : 'none', marginTop: '.75rem', paddingTop: '.5rem', borderTop: '1px solid #E5EADF' }}>
                  {whyText && <p style={{ fontSize: '.88rem', margin: '.25rem 0' }}><strong style={{ color: '#5C7034' }}>{UI.helpsUnderstand[lang==='km'?'km':'en'] || 'Why it matters:'}</strong> {whyText}</p>}
                  {tipText && <p style={{ fontSize: '.88rem', margin: '.25rem 0' }}><strong style={{ color: '#88A04D' }}>{UI.viewGuide[lang==='km'?'km':'en'] || 'Try this:'}</strong> {tipText}</p>}
                  {node.questions && (node.questions[lang==='km'?'km':'en'] || []).length > 0 && (
                    <div style={{ marginTop: '.5rem' }}>
                      <strong style={{ fontSize: '.85rem', color: '#5C7034' }}>Questions:</strong>
                      <ul style={{ margin: '.25rem 0 .25rem 1.25rem', padding: 0, fontSize: '.85rem' }}>
                        {(node.questions[lang==='km'?'km':'en'] || []).map((q,i) => <li key={i}>{q}</li>)}
                      </ul>
                    </div>
                  )}
                  <div style={{ marginTop: '.75rem' }}>
                    <strong style={{ fontSize: '.8rem', color: '#5F6E60', display: 'block', marginBottom: '.25rem' }}>{UI.sourceLabel[lang==='km'?'km':'en'] || 'Source:'}</strong>
                    {node.sources.map((src,i) => (
                      <div key={i} style={{ marginBottom: '.25rem' }}>
                        <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '.85rem', fontWeight: 600 }}>{src.name} ↗</a>
                        <span style={{ fontSize: '.75rem', color: '#999', marginLeft: '.5rem' }}>{src.url.endsWith('.pdf') ? 'PDF' : ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: '.5rem', paddingTop: '.25rem', borderTop: '1px dashed #E5EADF', fontSize: '.8rem', color: '#888' }}>
                  {UI.sourceLabel[lang==='km'?'km':'en']} {node.sources.map((s,i) => <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '.25rem', fontSize: '.8rem' }}>{s.name}</a>)}
                </div>
                {node.kind === 'weekly' && <span aria-label="English only" style={{ fontSize: '.7rem', color: '#999', marginTop: '.25rem', display: 'inline-block' }}>[EN]</span>}
              </article>
            );
          })}
        </div>
      </main>

      <footer style={{ marginTop: '4rem', paddingTop: '1.5rem', borderTop: '1px solid #E5EADF', color: '#5F6E60', fontSize: '.8rem' }}>
        <p>ម៉ែ — Read &amp; Dip Info Hub · Sources: NMCHC, WHO, UNICEF, RHAC, PSI · {nodes.length} nodes</p>
        <p style={{ marginTop: '.25rem', fontSize: '.75rem', color: '#999' }}>
          Disclaimer: {lang === 'km' ? 'សូមស្វែងរកការណែនាំពីគ្រូពេទ្យ' : 'Seek advice from a health worker; this site does not replace clinical care.'}
        </p>
        <p style={{ marginTop: '.25rem', fontSize: '.7rem', color: '#aaa' }}>© FlowErs</p>
      </footer>
    </div>
  );
}
