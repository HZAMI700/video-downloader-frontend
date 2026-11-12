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
    <div className="w-full space-y-8 animate-enter">
      {/* Category Hero Banner */}
      <section className="text-center max-w-2xl mx-auto pt-2 pb-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-line mb-4">
          <span className="w-5 h-5 rounded-full bg-accent/15 text-accent flex items-center justify-center">
            <Sparkles className="w-3 h-3" />
          </span>
          <span className="text-xs font-medium tracking-tight text-fg">
            {category.heroBadge}
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-fg">
          {category.heroTitle}
        </h1>

        <p className="text-sm sm:text-base text-muted font-normal leading-relaxed">
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
                className={`bg-surface rounded-2xl p-5 sm:p-6 border border-line hover:border-accent/40 flex flex-col justify-between cursor-pointer group relative overflow-hidden transition-all`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl ${tool.iconBg} flex items-center justify-center transition-transform`}
                    >
                      {renderIcon(tool.iconName, 'w-5 h-5')}
                    </div>
                    <span
                      className={`text-xs font-medium ${tool.badgeColor} px-2.5 py-0.5 rounded-full border border-line`}
                    >
                      {tool.pillTag}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold tracking-tight text-fg mb-1.5 group-hover:text-accent transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed min-h-[40px]">
                    {tool.shortDesc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-line flex items-center justify-between text-sm font-medium text-fg group-hover:text-accent transition">
                  <span className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-sunken hover:bg-accent/10 border border-line group-hover:border-accent/40">Launch Tool</span>
                    <span className="text-xs font-medium text-muted">
                      • 100% Free
                    </span>
                  </span>
                  <ChevronRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1 text-muted group-hover:text-accent" />
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <div className="p-12 text-center bg-surface rounded-3xl border border-line my-6">
          <Search className="w-10 h-10 text-muted mx-auto mb-3" />
          <h3 className="text-base font-medium text-fg">
            No tools found matching &quot;{searchFilter}&quot;
          </h3>
          <p className="text-xs text-muted mt-1">
            Try searching for another keyword or clear the search filter.
          </p>
        </div>
      )}
    </div>
  );
}
