/**
 * ម៉ែ — by FlowErs
 * PlanContext: My Plan (គម្រោងរបស់ខ្ញុំ)
 *
 * Manages gentle, pre-written self-care and preparation tasks for mothers.
 * Strictly uses Cambodia local date (Asia/Phnom_Penh) to evaluate "Today".
 * Supports Supabase `plan_items` table with fallback to localStorage.
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { PlanItem } from '../types';
import { useApp } from './AppContext';
import { supabase } from '../lib/supabase';

const STORAGE_KEY_LOCAL_PLAN = 'mae_local_plan_items';

/**
 * Returns today's date formatted as YYYY-MM-DD in the Cambodia (Asia/Phnom_Penh) timezone.
 */
export const getCambodiaTodayStr = (): string => {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Phnom_Penh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
};

/**
 * Adds N days to a YYYY-MM-DD string.
 */
export const addDaysToCambodiaDate = (dateStr: string, days: number): string => {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  } catch {
    return dateStr;
  }
};

interface PlanContextType {
  items: PlanItem[];
  isLoading: boolean;
  addItems: (
    newItems: Array<Omit<PlanItem, 'id' | 'user_id' | 'created_at'>>,
    metadata?: { items_kept?: number; items_removed?: number; duration?: 'day' | 'week'; source_id?: string }
  ) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  toggleDone: (id: string) => Promise<void>;
  getDueToday: () => PlanItem[];
  getThisWeekItems: () => PlanItem[];
  getDoneItems: () => PlanItem[];
  todayDateStr: string;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, currentWeek, logEvent, showToast, t } = useApp();
  const [items, setItems] = useState<PlanItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LOCAL_PLAN);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const todayDateStr = useMemo(() => getCambodiaTodayStr(), []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOCAL_PLAN, JSON.stringify(items));
    } catch {}
  }, [items]);

  // Load from Supabase plan_items when user logs in
  useEffect(() => {
    if (!user?.id) return;

    setIsLoading(true);
    supabase
      .from('plan_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        setIsLoading(false);
        if (!error && Array.isArray(data)) {
          setItems(data as PlanItem[]);
        }
      });
  }, [user?.id]);

  /**
   * Add multiple kept suggestions into the user's plan.
   */
  const addItems = async (
    newItems: Array<Omit<PlanItem, 'id' | 'user_id' | 'created_at'>>,
    metadata?: { items_kept?: number; items_removed?: number; duration?: 'day' | 'week'; source_id?: string }
  ) => {
    if (newItems.length === 0) return;

    const userId = user?.id || 'guest_user';
    const clientItems: PlanItem[] = newItems.map((item) => ({
      ...item,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `plan_${Date.now()}_${Math.random()}`,
      user_id: userId,
      created_at: new Date().toISOString(),
    }));

    // Update local state immediately
    setItems((prev) => [...clientItems, ...prev]);

    // Log telemetry event
    logEvent('plan_item_added', metadata?.source_id, currentWeek, {
      items_kept: metadata?.items_kept ?? newItems.length,
      items_removed: metadata?.items_removed ?? 0,
      duration: metadata?.duration ?? 'day',
      source_id: metadata?.source_id,
    });

    // If logged in, save to Supabase
    if (user?.id) {
      try {
        const dbPayload = newItems.map((item) => ({
          user_id: user.id,
          text_kh: item.text_kh,
          text_en: item.text_en,
          source_type: item.source_type,
          source_id: item.source_id,
          start_date: item.start_date,
          end_date: item.end_date,
          reminder_time: item.reminder_time || '08:00',
          done: false,
        }));
        const { data, error } = await supabase.from('plan_items').insert(dbPayload).select();
        if (!error && Array.isArray(data) && data.length > 0) {
          // Replace generated IDs with DB IDs
          setItems((prev) => {
            const filtered = prev.filter((p) => !clientItems.some((ci) => ci.id === p.id));
            return [...(data as PlanItem[]), ...filtered];
          });
        }
      } catch (err) {
        console.warn('Could not insert plan items into Supabase', err);
      }
    }

    showToast(t('បានបញ្ចូលទៅក្នុង «គម្រោងរបស់ខ្ញុំ» ដោយជោគជ័យ 🌸', 'Added to My Plan successfully 🌸'));
  };

  /**
   * Delete an item from the plan.
   */
  const deleteItem = async (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    logEvent('plan_item_deleted', id, currentWeek);

    if (user?.id) {
      try {
        await supabase.from('plan_items').delete().eq('id', id).eq('user_id', user.id);
      } catch (err) {
        console.warn('Could not delete plan item from Supabase', err);
      }
    }

    showToast(t('បានលុបការរំលឹកចេញ', 'Item removed'));
  };

  /**
   * Toggle done state for an item.
   */
  const toggleDone = async (id: string) => {
    let nextDone = false;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          nextDone = !item.done;
          return { ...item, done: nextDone };
        }
        return item;
      })
    );

    logEvent('plan_item_completed', id, currentWeek, { done: nextDone });

    if (user?.id) {
      try {
        await supabase.from('plan_items').update({ done: nextDone }).eq('id', id).eq('user_id', user.id);
      } catch (err) {
        console.warn('Could not update done status in Supabase', err);
      }
    }
  };

  /**
   * Get items due today (start_date <= today <= end_date and !done) using Cambodia date.
   */
  const getDueToday = (): PlanItem[] => {
    const today = getCambodiaTodayStr();
    return items.filter((item) => !item.done && item.start_date <= today && today <= item.end_date);
  };

  /**
   * Get items for this week that are not completed.
   */
  const getThisWeekItems = (): PlanItem[] => {
    const today = getCambodiaTodayStr();
    return items.filter((item) => !item.done && item.end_date >= today);
  };

  /**
   * Get all completed items.
   */
  const getDoneItems = (): PlanItem[] => {
    return items.filter((item) => item.done);
  };

  const value = {
    items,
    isLoading,
    addItems,
    deleteItem,
    toggleDone,
    getDueToday,
    getThisWeekItems,
    getDoneItems,
    todayDateStr,
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
};

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};
