import React from 'react';
import { Loader2, Brain, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({ message = "Generating questions...", className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 space-y-4", className)}>
      <div className="relative">
        <div className="relative">
          <Brain className="h-12 w-12 text-primary animate-pulse-gentle" />
          <Loader2 className="h-6 w-6 text-primary-glow animate-spin absolute -top-1 -right-1" />
        </div>
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-gentle" />
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold text-foreground animate-fade-in">
          {message}
        </p>
        <p className="text-sm text-muted-foreground animate-fade-in">
          This may take a few moments...
        </p>
      </div>

      <div className="flex items-center gap-2 animate-fade-in">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse-gentle" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse-gentle" style={{ animationDelay: '200ms' }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse-gentle" style={{ animationDelay: '400ms' }} />
      </div>
    </div>
  );
}