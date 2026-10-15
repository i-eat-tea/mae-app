import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create mock Supabase client for environments without configured backend
const createMockClient = () => {
  const MOCK_USERS_KEY = 'mae_mock_auth_users';
  const MOCK_PROFILES_KEY = 'mae_mock_user_profiles';
  const MOCK_LINK_CODES_KEY = 'mae_mock_link_codes';
  const MOCK_TELEGRAM_LINKS_KEY = 'mae_mock_telegram_links';
  const authListeners: Set<(event: string, session: any) => void> = new Set();

  const getStoredUsers = (): Record<string, { email: string; password?: string; id: string }> => {
    try {
      return JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '{}');
    } catch {
      return {};
    }
  };

  const getStoredProfiles = (): Record<string, any> => {
    try {
      return JSON.parse(localStorage.getItem(MOCK_PROFILES_KEY) || '{}');
    } catch {
      return {};
    }
  };

  const getStoredLinkCodes = (): Record<string, any> => {
    try {
      return JSON.parse(localStorage.getItem(MOCK_LINK_CODES_KEY) || '{}');
    } catch {
      return {};
    }
  };

  const getStoredTelegramLinks = (): Record<string, any> => {
    try {
      return JSON.parse(localStorage.getItem(MOCK_TELEGRAM_LINKS_KEY) || '{}');
    } catch {
      return {};
    }
  };

  const notifyAuthChange = (event: string, session: any) => {
    authListeners.forEach((listener) => {
      try {
        listener(event, session);
      } catch (e) {
        console.warn('Auth listener error:', e);
      }
    });
  };

  return {
    auth: {
      getSession: async () => {
        try {
          const userStr = localStorage.getItem('mae_user_session');
          if (userStr) {
            const user = JSON.parse(userStr);
            return { data: { session: { user, access_token: 'mock-token' } }, error: null };
          }
        } catch {}
        return { data: { session: null }, error: null };
      },
      getUser: async () => {
        try {
          const userStr = localStorage.getItem('mae_user_session');
          if (userStr) {
            const user = JSON.parse(userStr);
            return { data: { user }, error: null };
          }
        } catch {}
        return { data: { user: null }, error: null };
      },
      onAuthStateChange: (callback: (event: string, session: any) => void) => {
        authListeners.add(callback);
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                authListeners.delete(callback);
              },
            },
          },
        };
      },
      signUp: async ({ email, password }: { email: string; password?: string }) => {
        const users = getStoredUsers();
        const cleanEmail = email.toLowerCase().trim();
        const existing = Object.values(users).find((u) => u.email === cleanEmail);
        const id = existing?.id || 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
        users[id] = { id, email: cleanEmail, password };
        try {
          localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
        } catch {}
        const user = { id, email: cleanEmail };
        const session = { user, access_token: 'mock-token' };
        notifyAuthChange('SIGNED_IN', session);
        return {
          data: { user, session },
          error: null,
        };
      },
      signInWithPassword: async ({ email, password }: { email: string; password?: string }) => {
        const users = getStoredUsers();
        const cleanEmail = email.toLowerCase().trim();
        const match = Object.values(users).find((u) => u.email === cleanEmail);
        const id = match?.id || 'usr_' + Date.now().toString(36);
        if (!match) {
          users[id] = { id, email: cleanEmail, password };
          try {
            localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
          } catch {}
        }
        const user = { id, email: cleanEmail };
        const session = { user, access_token: 'mock-token' };
        notifyAuthChange('SIGNED_IN', session);
        return {
          data: { user, session },
          error: null,
        };
      },
      signOut: async () => {
        notifyAuthChange('SIGNED_OUT', null);
        return { error: null };
      },
    },
    from: (table: string) => {
      let filterCol: string | null = null;
      let filterVal: any = null;
      let lastInsertedRows: any[] = [];
      let isDeleteOp = false;

      const performDeleteIfReady = () => {
        if (!isDeleteOp || !filterCol) return;
        if (table === 'link_codes') {
          const codes = getStoredLinkCodes();
          if (filterCol === 'user_id') {
            Object.keys(codes).forEach((k) => {
              if (codes[k].user_id === filterVal) delete codes[k];
            });
          } else if (filterCol === 'code') {
            delete codes[filterVal];
          }
          try {
            localStorage.setItem(MOCK_LINK_CODES_KEY, JSON.stringify(codes));
          } catch {}
        }
        if (table === 'telegram_links') {
          const links = getStoredTelegramLinks();
          if (filterCol === 'user_id') {
            delete links[filterVal];
          } else if (filterCol === 'chat_id') {
            Object.keys(links).forEach((k) => {
              if (links[k].chat_id === filterVal) delete links[k];
            });
          }
          try {
            localStorage.setItem(MOCK_TELEGRAM_LINKS_KEY, JSON.stringify(links));
          } catch {}
        }
      };

      const chain: any = {
        select: (_cols?: string) => chain,
        eq: (col: string, val: any) => {
          filterCol = col;
          filterVal = val;
          performDeleteIfReady();
          return chain;
        },
        neq: () => chain,
        order: () => chain,
        limit: () => chain,
        range: () => chain,
        match: () => chain,
        filter: () => chain,
        maybeSingle: async () => {
          if (table === 'users' && filterCol === 'id') {
            const profiles = getStoredProfiles();
            return { data: profiles[filterVal] || null, error: null };
          }
          if (table === 'entitlements' && filterCol === 'user_id') {
            const profiles = getStoredProfiles();
            const prof = profiles[filterVal];
            return { data: prof ? { is_premium: !!prof.is_premium } : null, error: null };
          }
          if (table === 'telegram_links' && filterCol === 'user_id') {
            const links = getStoredTelegramLinks();
            return { data: links[filterVal] || null, error: null };
          }
          if (table === 'link_codes' && filterCol === 'code') {
            const codes = getStoredLinkCodes();
            const record = codes[filterVal];
            if (record && new Date(record.expires_at) > new Date()) {
              return { data: record, error: null };
            }
            return { data: null, error: null };
          }
          return { data: null, error: null };
        },
        single: async () => {
          if (table === 'users' && filterCol === 'id') {
            const profiles = getStoredProfiles();
            return { data: profiles[filterVal] || null, error: null };
          }
          if (table === 'telegram_links' && filterCol === 'user_id') {
            const links = getStoredTelegramLinks();
            return { data: links[filterVal] || null, error: null };
          }
          return { data: null, error: null };
        },
        insert: (row: any) => {
          const rows = Array.isArray(row) ? row : [row];
          if (table === 'link_codes') {
            const codes = getStoredLinkCodes();
            rows.forEach((r) => {
              if (r.code) codes[r.code] = r;
            });
            try {
              localStorage.setItem(MOCK_LINK_CODES_KEY, JSON.stringify(codes));
            } catch {}
          }
          if (table === 'telegram_links') {
            const links = getStoredTelegramLinks();
            rows.forEach((r) => {
              if (r.user_id) links[r.user_id] = r;
            });
            try {
              localStorage.setItem(MOCK_TELEGRAM_LINKS_KEY, JSON.stringify(links));
            } catch {}
          }
          lastInsertedRows = rows.map((r) => ({
            ...r,
            id: r.id || 'mock_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
            created_at: r.created_at || new Date().toISOString(),
          }));
          return chain;
        },
        update: (_updates: any) => chain,
        delete: () => {
          isDeleteOp = true;
          performDeleteIfReady();
          return chain;
        },
        upsert: async (row: any) => {
          if (table === 'users' && row?.id) {
            const profiles = getStoredProfiles();
            profiles[row.id] = { ...profiles[row.id], ...row };
            try {
              localStorage.setItem(MOCK_PROFILES_KEY, JSON.stringify(profiles));
            } catch {}
          }
          if (table === 'telegram_links' && row?.user_id) {
            const links = getStoredTelegramLinks();
            links[row.user_id] = row;
            try {
              localStorage.setItem(MOCK_TELEGRAM_LINKS_KEY, JSON.stringify(links));
            } catch {}
          }
          return { error: null, data: null };
        },
        then: (onfulfilled?: (value: { data: any[] | null; error: null }) => any) => {
          performDeleteIfReady();
          const result = lastInsertedRows.length > 0 ? lastInsertedRows : null;
          return Promise.resolve({ data: result, error: null }).then(onfulfilled);
        },
      };

      return chain;
    },
    storage: {
      from: (bucket: string) => ({
        getPublicUrl: (path: string) => ({
          data: {
            publicUrl: `${(supabaseUrl || 'https://supabase.co').replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${path}`,
          },
        }),
      }),
    },
  };
};

let client: any;
if (supabaseUrl && supabaseAnonKey && typeof supabaseUrl === 'string' && supabaseUrl.startsWith('http')) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('[AI Studio] Could not initialize Supabase client, using in-memory mock:', err);
    client = createMockClient();
  }
} else {
  client = createMockClient();
}

export const supabase: SupabaseClient = client as unknown as SupabaseClient;

/**
 * Resolves an audio file path or URL to a valid Supabase Storage public URL.
 * Handles paths like "Psi_audio/1.mp3" or already-formed HTTP URLs.
 */
export function getStorageAudioUrl(pathOrUrl?: string): string {
  if (!pathOrUrl) return '';
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://') || pathOrUrl.startsWith('blob:')) {
    return pathOrUrl;
  }

  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl.slice(1) : pathOrUrl;

  // Extract bucket and object key
  let bucket = 'Psi_audio';
  let objectKey = cleanPath;

  if (cleanPath.startsWith('Psi_audio/')) {
    bucket = 'Psi_audio';
    objectKey = cleanPath.replace(/^Psi_audio\//, '');
  }

  try {
    const { data } = supabase.storage.from(bucket).getPublicUrl(objectKey);
    if (data?.publicUrl) return data.publicUrl;
  } catch {}

  const base = (supabaseUrl || 'https://supabase.co').replace(/\/$/, '');
  return `${base}/storage/v1/object/public/${bucket}/${objectKey}`;
}
