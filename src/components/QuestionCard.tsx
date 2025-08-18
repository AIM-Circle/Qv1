import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, Info, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Question } from '@/lib/api';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
}

export function QuestionCard({ question, questionNumber }: QuestionCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  // Parse question content to separate question text from options
  const parseQuestionContent = (content: string, type: 'theory' | 'objective') => {
    if (type === 'objective') {
      // For objective questions, separate question from options
      const lines = content.split('\n').filter(line => line.trim());
      const questionText = lines[0] || '';
      const options = lines.slice(1).filter(line => 
        line.trim().match(/^[A-D]\)/) || line.trim().match(/^[A-D]\./)
      );
      
      return { questionText, options };
    } else {
      // For theory questions, the content should include the main question
      // The sub-questions (a and b) are stored in answer.options
      return { questionText: content, options: [] };
    }
  };

  const { questionText, options } = parseQuestionContent(question.content, question.type);

  return (
    <Card className="bg-surface-elevated border border-primary/10 shadow-soft question-card-hover animate-slide-up">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full text-sm font-semibold">
              {questionNumber}
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-full",
                question.type === 'theory' 
                  ? "bg-blue-100 text-blue-700 border border-blue-200" 
                  : "bg-green-100 text-green-700 border border-green-200"
              )}>
                {question.type === 'theory' ? 'Theory' : 'Objective'}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Question Text */}
        <div className="space-y-3">
          <div className="text-foreground font-medium leading-relaxed">
            {questionText}
          </div>
          
          {/* Options for Objective Questions */}
          {question.type === 'objective' && options.length > 0 && (
            <div className="space-y-2 pl-4">
              {options.map((option, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="option-badge flex items-center justify-center w-5 h-5 bg-secondary/50 text-secondary-foreground rounded text-xs font-medium mt-0.5">
                    {option.charAt(0)}
                  </div>
                  <span className="text-foreground/80 text-sm leading-relaxed">
                    {option.substring(2).trim()}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {/* Sub-questions for Theory Questions */}
          {question.type === 'theory' && question.answer?.options && (
            <div className="space-y-2 pl-4 mt-3">
              {question.answer.options.a && (
                <div className="flex items-start gap-3">
                  <div className="option-badge flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-700 rounded text-xs font-medium mt-0.5">
                    a
                  </div>
                  <span className="text-foreground/80 text-sm leading-relaxed">
                    {question.answer.options.a}
                  </span>
                </div>
              )}
              {question.answer.options.b && (
                <div className="flex items-start gap-3">
                  <div className="option-badge flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-700 rounded text-xs font-medium mt-0.5">
                    b
                  </div>
                  <span className="text-foreground/80 text-sm leading-relaxed">
                    {question.answer.options.b}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Answer Section */}
        {question.answer && (
          <div className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAnswer}
              className="w-full justify-between font-medium hover:bg-primary/5 hover:border-primary/30"
            >
              <span className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                {showAnswer ? 'Hide Answer' : 'Show Answer'}
              </span>
                {showAnswer ? (
                    <ChevronUp className="h-4 w-4" />
                ) : (
                    <ChevronDown className="h-4 w-4" />
                )}
            </Button>

            {showAnswer && (
              <div className="answer-section bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20 animate-fade-in">
                {question.type === 'objective' && question.answer.correct && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg border border-success/20">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-success text-sm">Correct Answer</div>
                        <div className="font-medium text-success/90">{question.answer.correct}</div>
                      </div>
                    </div>
                    
                    {question.answer.explanation && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-primary text-sm">Explanation</span>
                        </div>
                        <p className="text-foreground/90 text-sm leading-relaxed pl-6">
                          {question.answer.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {question.type === 'theory' && question.answer.options && question.answer.answers && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-primary text-sm">Answers</span>
                    </div>
                    
                    <div className="space-y-3">
                      {question.answer.answers.a && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-start gap-2">
                            <div className="flex items-center justify-center w-5 h-5 bg-green-100 text-green-700 rounded text-xs font-medium mt-0.5">
                              a
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-green-800 text-sm mb-1">Answer to sub-question a:</div>
                              <div className="text-green-700 text-sm leading-relaxed">
                                {question.answer.answers.a}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {question.answer.answers.b && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-start gap-2">
                            <div className="flex items-center justify-center w-5 h-5 bg-green-100 text-green-700 rounded text-xs font-medium mt-0.5">
                              b
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-green-800 text-sm mb-1">Answer to sub-question b:</div>
                              <div className="text-green-700 text-sm leading-relaxed">
                                {question.answer.answers.b}
                              </div>
                            </div>
                      </div>
                      </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}