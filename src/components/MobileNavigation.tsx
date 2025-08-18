import React from 'react';
import { Upload, FileText, RefreshCw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileNavigationProps {
  activeTab: 'upload' | 'questions' | 'about';
  onTabChange: (tab: 'upload' | 'questions' | 'about') => void;
  onReset: () => void;
  questionCount?: number;
}

export function MobileNavigation({ activeTab, onTabChange, onReset, questionCount = 0 }: MobileNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface-elevated border-t border-primary/10 shadow-strong z-50 md:hidden">
      <div className="flex items-center justify-around py-2 px-2">
        <Button
          variant="mobile"
          size="sm"
          onClick={() => onTabChange('upload')}
          className={cn(
            "flex-col gap-1 h-auto py-2 px-3 rounded-lg transition-all duration-200",
            activeTab === 'upload' && "bg-primary/10 text-primary"
          )}
        >
          <Upload className="h-5 w-5" />
          <span className="text-xs font-medium">Upload</span>
        </Button>

        <Button
          variant="mobile"
          size="sm"
          onClick={() => onTabChange('questions')}
          className={cn(
            "flex-col gap-1 h-auto py-2 px-3 rounded-lg transition-all duration-200 relative",
            activeTab === 'questions' && "bg-primary/10 text-primary"
          )}
        >
          <div className="relative">
            <FileText className="h-5 w-5" />
            {questionCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {questionCount}
              </div>
            )}
          </div>
          <span className="text-xs font-medium">Questions</span>
        </Button>

        <Button
          variant="mobile"
          size="sm"
          onClick={() => onTabChange('about')}
          className={cn(
            "flex-col gap-1 h-auto py-2 px-3 rounded-lg transition-all duration-200",
            activeTab === 'about' && "bg-primary/10 text-primary"
          )}
        >
          <Info className="h-5 w-5" />
          <span className="text-xs font-medium">About</span>
        </Button>

        <Button
          variant="mobile"
          size="sm"
          onClick={onReset}
          className="flex-col gap-1 h-auto py-2 px-3 rounded-lg transition-all duration-200"
        >
          <RefreshCw className="h-5 w-5" />
          <span className="text-xs font-medium">Reset</span>
        </Button>
      </div>
    </div>
  );
}