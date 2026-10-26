'use client';

import React from 'react';
import {
  MessageSquare,
  RefreshCw,
  CheckCheck,
  Image as ImageIcon,
  AlignLeft,
  UserCheck,
  Languages,
  FileSearch,
  FileAudio,
  Youtube,
  Radio,
  Disc,
  Music2,
  FileVideo,
  Scissors,
  Sparkles,
  Mic,
  Volume2,
  Wand2,
  ChevronRight,
  ArrowRight,
  ShieldAlert,
  Search,
} from 'lucide-react';
import { CategoryDefinition, CategoryToolItem } from '../../lib/categories';
import { ToolId } from '../AppSidebar';

interface CategoryOverviewProps {
  category: CategoryDefinition;
  onSelectTool: (toolId: ToolId) => void;
  searchFilter?: string;
}

export function CategoryOverview({
  category,
  onSelectTool,
  searchFilter = '',
}: CategoryOverviewProps) {
  const query = searchFilter.trim().toLowerCase();
  const filteredTools = category.tools.filter(
    (t) =>
      !query ||
      t.name.toLowerCase().includes(query) ||
      t.shortDesc.toLowerCase().includes(query) ||
      t.fullDesc.toLowerCase().includes(query) ||
      t.pillTag.toLowerCase().includes(query)
  );

  const renderIcon = (name: string, className = 'w-5 h-5') => {
    switch (name) {
      case 'MessageSquare':
        return <MessageSquare className={className} />;
      case 'RefreshCw':
        return <RefreshCw className={className} />;
      case 'CheckCheck':
        return <CheckCheck className={className} />;
      case 'ImageIcon':
        return <ImageIcon className={className} />;
      case 'AlignLeft':
        return <AlignLeft className={className} />;
      case 'UserCheck':
        return <UserCheck className={className} />;
      case 'Languages':
        return <Languages className={className} />;
      case 'FileSearch':
        return <FileSearch className={className} />;
      case 'FileAudio':
        return <FileAudio className={className} />;
      case 'Youtube':
        return <Youtube className={className} />;
      case 'Radio':
        return <Radio className={className} />;
      case 'Disc':
        return <Disc className={className} />;
      case 'Music2':
        return <Music2 className={className} />;
      case 'FileVideo':
        return <FileVideo className={className} />;
      case 'Scissors':
        return <Scissors className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Mic':
        return <Mic className={className} />;
      case 'Volume2':
        return <Volume2 className={className} />;
      case 'Wand2':
        return <Wand2 className={className} />;
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <div className="w-full space-y-8 animate-apple-in">
      {/* Category Hero Banner */}
      <section className="text-center max-w-2xl mx-auto pt-2 pb-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#141A22] border border-slate-200 dark:border-[#263241] shadow-sm mb-4">
          <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-3 h-3" />
          </span>
          <span className="text-[12px] font-semibold tracking-tight text-slate-700 dark:text-slate-300">
            {category.heroBadge}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-slate-900 dark:text-white leading-[1.1] mb-3.5">
          {category.heroTitle}
        </h1>

        <p className="text-[14px] sm:text-[15.5px] text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
          {category.heroDescription}
        </p>
      </section>

      {/* Bento Grid of Category Tools */}
      {filteredTools.length > 0 ? (
        <section aria-label={`${category.name} Tools Grid`} className="pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredTools.map((tool, idx) => (
              <article
                key={tool.id}
                onClick={() => onSelectTool(tool.id)}
                className={`bg-white dark:bg-[#181D24] rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-[#263241] shadow-2xs hover:shadow-xs hover:border-[#00c9a7]/40 flex flex-col justify-between cursor-pointer group relative overflow-hidden transition-all`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl ${tool.iconBg} flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xs`}
                    >
                      {renderIcon(tool.iconName, 'w-5 h-5')}
                    </div>
                    <span
                      className={`text-[11px] font-bold ${tool.badgeColor} px-2.5 py-0.5 rounded-full shadow-2xs border border-slate-200 dark:border-[#263241]`}
                    >
                      {tool.pillTag}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white mb-1 group-hover:text-[#00c9a7] transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed min-h-[36px]">
                    {tool.shortDesc}
                  </p>
                </div>

                <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-[#263241] flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-[#00c9a7] transition">
                  <span className="flex items-center gap-1.5">
                    <span>Open Tool</span>
                    <span className="text-[10px] font-medium text-slate-400">
                      • 100% Free
                    </span>
                  </span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-slate-400 group-hover:text-[#00c9a7]" />
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-[#181D24] rounded-3xl border border-slate-200 dark:border-[#263241] my-6">
          <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No tools found matching &quot;{searchFilter}&quot;
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Try searching for another keyword or clear the search filter.
          </p>
        </div>
      )}
    </div>
  );
}
