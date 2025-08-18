const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface Question {
  id: string;
  content: string;
  type: 'theory' | 'objective';
  answer?: {
    correct?: string;
    explanation?: string;
    options?: {
      a: string;
      b: string;
    };
    answers?: {
      a: string;
      b: string;
    };
  };
}

export interface GenerateQuestionsRequest {
  pdf_file: File;
  num_questions: number;
  question_type: 'theory' | 'objective';
}

export interface GenerateQuestionsResponse {
  success: boolean;
  questions: Question[];
  question_type: string;
  num_questions: number;
}

export interface ApiError {
  error: string;
}

export class ApiService {
  static async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }
    return response.json();
  }

  static async generateQuestions(request: GenerateQuestionsRequest): Promise<GenerateQuestionsResponse> {
    const formData = new FormData();
    formData.append('pdf_file', request.pdf_file);
    formData.append('num_questions', request.num_questions.toString());
    formData.append('question_type', request.question_type);

    const response = await fetch(`${API_BASE_URL}/api/generate-questions`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.error || `Request failed: ${response.statusText}`);
    }

    return response.json();
  }
}
