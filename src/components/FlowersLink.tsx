/**
 * Flowers — Medical Record Library & Personal Planner
 * Link to: https://flowers-qrr1.onrender.com/
 */
import React from 'react';
import { ExternalLink, Flower2, BookOpen } from 'lucide-react';

export const FlowersLink: React.FC = () => {
  return (
    <a
      href="https://flowers-qrr1.onrender.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 rounded-3xl bg-gradient-to-br from-[#F4F8F0] to-[#E8EFE4] border border-[#88A04D]/20 p-5 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5"
      aria-label="Flowers Medical Record Library"
    >
      <div className="w-12 h-12 rounded-2xl bg-[#88A04D] text-white flex items-center justify-center shadow-sm">
        <Flower2 size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-bold text-[#233125] leading-tight">
          Flowers
        </h3>
        <p className="text-xs text-[#5F6E60] mt-0.5 truncate">
          បណ្ដាល័យកំណត់ត្រាវេជ្ជសាស្ដ្រ និងកម្មវិធីផែនការផ្ទាល់ខ្លួន
        </p>
        <p className="text-xs text-[#88A04D] font-medium mt-0.5">
          Medical Record Library & Personal Planner
        </p>
      </div>
      <ExternalLink size={18} className="text-[#88A04D] shrink-0" />
    </a>
  );
};
