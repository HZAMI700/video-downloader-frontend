'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { faqs } from '../lib/faqs';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="w-full max-w-4xl mx-auto py-12 px-2">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-[#181D24] text-[#009688] dark:text-[#00c9a7] text-xs font-bold border border-slate-200 dark:border-[#263241] shadow-xs">
          <HelpCircle className="w-3.5 h-3.5 text-[#009688] dark:text-[#00c9a7]" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Common Questions About <span className="skywork-gradient-text">Playzy</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Everything you need to know about downloading videos, AI writing, voice generation, and transcription.
        </p>
      </div>

      <div className="space-y-3.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <motion.div
              key={idx}
              initial={false}
              className="rounded-2xl border border-slate-200 dark:border-[#263241] bg-white dark:bg-[#181D24] shadow-sm overflow-hidden transition-all duration-200 hover:border-[#00c9a7]/40"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 hover:text-[#009688] dark:hover:text-[#00c9a7] transition"
              >
                <span className="pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-300 shrink-0 ${
                    isOpen ? 'rotate-180 text-[#009688] dark:text-[#00c9a7]' : ''
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-[#263241] pt-3.5 font-normal">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
