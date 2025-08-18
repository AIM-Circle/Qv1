import React, { useRef, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
  disabled?: boolean;
}

export function FileUpload({ onFileSelect, selectedFile, onClearFile, disabled }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files[0] && files[0].type === 'application/pdf') {
      onFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {selectedFile ? (
        <div className="flex items-center justify-between p-4 bg-surface-elevated rounded-xl border border-primary/10 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearFile}
            disabled={disabled}
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "upload-drop-zone relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer",
            isDragOver 
              ? "border-primary bg-primary/5 shadow-glow" 
              : "border-border hover:border-primary/50 hover:bg-primary/2",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="flex flex-col items-center gap-4">
            <div className={cn(
              "p-4 rounded-full transition-all duration-300",
              isDragOver ? "bg-primary/20" : "bg-primary/10"
            )}>
              <Upload className={cn(
                "h-8 w-8 transition-colors",
                isDragOver ? "text-primary" : "text-primary/70"
              )} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                {isDragOver ? "Drop your PDF here" : "Upload PDF File"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Drag & drop or click to browse
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}