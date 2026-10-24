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
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <div className="w-full space-y-8 animate-apple-in">
      {/* Category Hero Banner */}
      <section className="text-center max-w-2xl mx-auto pt-2 pb-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200/80 shadow-sm mb-4">
          <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-3 h-3" />
          </span>
          <span className="text-[12px] font-semibold tracking-tight text-zinc-700">
            {category.heroBadge}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-zinc-950 leading-[1.1] mb-3.5">
          {category.heroTitle}
        </h1>

        <p className="text-[14px] sm:text-[15.5px] text-zinc-500 font-normal leading-relaxed">
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
                className={`apple-card ${tool.pastelBg} hover:bg-white rounded-[26px] p-6 border border-white/80 flex flex-col justify-between cursor-pointer group relative overflow-hidden transition-all`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 squircle ${tool.iconBg} flex items-center justify-center transition-transform group-hover:scale-105`}
                    >
                      {renderIcon(tool.iconName, 'w-5 h-5')}
                    </div>
                    <span
                      className={`text-[11px] font-semibold ${tool.badgeColor} bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-2xs border border-zinc-100`}
                    >
                      {tool.pillTag}
                    </span>
                  </div>

                  <h3 className="text-[17px] font-bold tracking-tight text-zinc-900 mb-1.5 group-hover:text-zinc-950 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-[13px] text-zinc-500 leading-relaxed min-h-[40px]">
                    {tool.shortDesc}
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-zinc-900/5 flex items-center justify-between text-[13px] font-semibold text-zinc-600 group-hover:text-zinc-950 transition">
                  <span className="flex items-center gap-1.5">
                    <span>Open Tool</span>
                    <span className="text-[11px] font-medium text-zinc-400">
                      • Zero login
                    </span>
                  </span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-zinc-400 group-hover:text-zinc-900" />
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-zinc-200/80 my-6">
          <Search className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-800">
            No tools found matching &quot;{searchFilter}&quot;
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Try searching for another keyword or clear the search filter.
          </p>
        </div>
      )}
    </div>
  );
}
