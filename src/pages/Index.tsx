import React, { useState, useCallback, useEffect } from 'react';
import { Brain, FileText, Download, RefreshCw, Settings2, Sparkles, Info, Users, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/FileUpload';
import { QuestionCard } from '@/components/QuestionCard';
import { MobileNavigation } from '@/components/MobileNavigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import heroImage from '@/assets/hero-bg.jpg';
import { ApiService, Question } from '@/lib/api';


const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [questionType, setQuestionType] = useState<string>('theory');
  const [questionCount, setQuestionCount] = useState<string>('3');
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'questions' | 'about'>('upload');
  const { toast } = useToast();

  // Check API health on component mount
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        await ApiService.healthCheck();
        console.log('API is healthy');
      } catch (error) {
        console.error('API health check failed:', error);
        toast({
          title: "API Connection Error",
          description: "Unable to connect to the backend. Please ensure the server is running.",
          variant: "destructive",
        });
      }
    };
    
    checkApiHealth();
  }, [toast]);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    toast({
      title: "File uploaded successfully",
      description: `${file.name} is ready for processing.`,
    });
  }, [toast]);

  const handleClearFile = useCallback(() => {
    setSelectedFile(null);
    setQuestions([]);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a PDF file first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await ApiService.generateQuestions({
        pdf_file: selectedFile,
        num_questions: parseInt(questionCount),
        question_type: questionType as 'theory' | 'objective'
      });
      
      setQuestions(response.questions);
      setActiveTab('questions');
      toast({
        title: "Questions generated successfully",
        description: `Generated ${response.questions.length} ${response.question_type} questions.`,
      });
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile, questionType, questionCount, toast]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setQuestions([]);
    setActiveTab('upload');
    setQuestionCount('3');
    setQuestionType('theory');
    toast({
      title: "Reset complete",
      description: "All data has been cleared.",
    });
  }, [toast]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleUploadTabClick = useCallback(() => {
    setActiveTab('upload');
    // Focus on upload area after a brief delay
    setTimeout(() => {
      const uploadElement = document.querySelector('.upload-drop-zone');
      if (uploadElement) {
        uploadElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }, []);

  const renderAboutTab = () => (
    <div className="space-y-8">
      {/* About Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-4 bg-primary/20 rounded-full">
            <Info className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          About AIM Question Generator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Learn more about how our AI-powered tool transforms your documents into intelligent questions.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-soft border-primary/10 text-center">
          <CardContent className="pt-6 space-y-4">
            <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">AI-Powered Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Advanced artificial intelligence reads and understands your PDF content to generate meaningful questions.
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft border-primary/10 text-center">
          <CardContent className="pt-6 space-y-4">
            <div className="p-3 bg-success/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <Users className="h-8 w-8 text-success" />
            </div>
            <h3 className="font-semibold text-foreground">For Students</h3>
            <p className="text-sm text-muted-foreground">
              Ideal for students who want to generate practice questions, test their knowledge, and create personalized study guides from their notes and materials.
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft border-primary/10 text-center">
          <CardContent className="pt-6 space-y-4">
            <div className="p-3 bg-primary-glow/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <Zap className="h-8 w-8 text-primary-glow" />
            </div>
            <h3 className="font-semibold text-foreground">Fast & Efficient</h3>
            <p className="text-sm text-muted-foreground">
              Generate multiple questions in seconds. Save hours of manual work with intelligent automation.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features List */}
      <Card className="shadow-soft border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Features & Capabilities
          </CardTitle>
          <CardDescription>
            Everything you need for intelligent question generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Theory and objective questions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Customizable question count</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Instant answer generation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Print-ready format</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Mobile-optimized interface</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Secure document processing</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Company */}
      <Card className="shadow-soft border-primary/10 bg-gradient-to-br from-primary/2 to-primary/5">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Built by AIM Circle</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            We're passionate about empowering education through technology. Our mission is to make learning and teaching more efficient and effective.
          </p>
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-primary">Empowering education through technology</span>
          </div>
        </CardContent>
      </Card>

      {/* Get Started CTA */}
      <div className="text-center">
        <Button 
          size="lg"
          onClick={handleUploadTabClick}
          className="h-12 px-8 text-base font-semibold"
        >
          <FileText className="h-5 w-5 mr-2" />
          Get Started - Upload Your PDF
        </Button>
      </div>
    </div>
  );

  const renderUploadTab = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-8 md:p-12">
        <div className="absolute inset-0 opacity-10">
          <img 
            src={heroImage} 
            alt="Background pattern" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/20 rounded-full">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              AIM Question Generator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your PDF documents into intelligent questions with AI-powered analysis. 
            Perfect for educators, and students.
          </p>
          <div className="flex items-center justify-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium">Powered by Advanced AI</span>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <Card className="shadow-soft border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Upload Document
          </CardTitle>
          <CardDescription>
            Select a PDF file to generate questions from its content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            onClearFile={handleClearFile}
            disabled={isLoading}
          />
        </CardContent>
      </Card>

      {/* Settings Section */}
      <Card className="shadow-soft border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            Generation Settings
          </CardTitle>
          <CardDescription>
            Configure how your questions will be generated
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="question-count">Number of Questions</Label>
              <Input
                id="question-count"
                type="number"
                min="1"
                max="10"
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                disabled={isLoading}
                className="shadow-soft"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="question-type">Question Type</Label>
              <Select value={questionType} onValueChange={setQuestionType} disabled={isLoading}>
                <SelectTrigger className="shadow-soft">
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="theory">Theory Questions</SelectItem>
                  <SelectItem value="objective">Multiple Choice (Objective)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={handleGenerate} 
              disabled={!selectedFile || isLoading}
              className="flex-1 h-12 text-base font-semibold"
            >
              {isLoading ? (
                <>
                  <Brain className="h-5 w-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Questions
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReset}
              disabled={isLoading}
              className="h-12"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );

  const renderQuestionsTab = () => {
    if (isLoading) {
      return <LoadingSpinner message="Generating your questions..." />;
    }

    if (questions.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No questions generated yet</h3>
          <p className="text-muted-foreground mb-6">Upload a PDF and generate questions to see them here.</p>
          <Button onClick={() => setActiveTab('upload')} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Generated Questions</h2>
            <p className="text-muted-foreground">
              {questions.length} {questionType} questions from your document
            </p>
          </div>
          <Button onClick={handlePrint} variant="outline" className="shadow-soft">
            <Download className="h-4 w-4 mr-2" />
            Print Questions
          </Button>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              questionNumber={index + 1}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        {/* Desktop Header */}
        <div className="hidden md:block mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">AIM Question Generator</h1>
                <p className="text-sm text-muted-foreground">AI-powered document analysis</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab('about')}
              className={cn(
                "flex items-center gap-2",
                activeTab === 'about' && "bg-primary/10 text-primary"
              )}
            >
              <Info className="h-4 w-4" />
              About
            </Button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground">AIM Generator</h1>
            </div>
            <p className="text-sm text-muted-foreground">AI-powered question generation</p>
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="pb-20 md:pb-0">
          {activeTab === 'upload' && renderUploadTab()}
          {activeTab === 'questions' && renderQuestionsTab()}
          {activeTab === 'about' && renderAboutTab()}
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation
        activeTab={activeTab}
        onTabChange={(tab) => tab === 'upload' ? handleUploadTabClick() : setActiveTab(tab)}
        onReset={handleReset}
        questionCount={questions.length}
      />
    </div>
  );
};

export default Index;