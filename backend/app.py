from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF
import openai
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure CORS for production and development
allowed_origins = [
    "http://localhost:3000",  # Local development
    "http://localhost:5000",  # Local development
    "http://localhost:3005",  # Local development
    "http://localhost:5173",  # Vite dev server
    "https://pdf-qgen.vercel.app",  # Vercel production
    "https://pdf-qgen-c95cnn2eg-peaces-projects-c6cf6075.vercel.app"  # Vercel preview
]

CORS(app, origins=allowed_origins, supports_credentials=True)

# Initialize OpenAI client using the new SDK format
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def extract_text_from_pdf(file):
    try:
        doc = fitz.open(stream=file.read(), filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text
    except Exception as e:
        print(f"PDF extraction error: {e}")
        raise Exception(f"Failed to extract text from PDF: {str(e)}")

def parse_theory_questions(questions_text):
    """Parse theory questions from OpenAI response into structured format"""
    questions = []
    question_parts = questions_text.split("Question")
    
    for part in question_parts:
        if not part.strip() or part.strip().startswith("Question"):
            continue
            
        lines = part.strip().split('\n')
        if not lines:
            continue
            
        # Extract question content, sub-questions, and answers
        question_content = ""
        answer_options = {}
        answers = {}
        
        in_main_question = True
        in_sub_questions = False
        in_answers = False
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Check if we're entering the sub-questions section
            if line.startswith('a.') or line.startswith('b.'):
                in_main_question = False
                in_sub_questions = True
                if line.startswith('a.'):
                    answer_options['a'] = line[2:].strip()
                elif line.startswith('b.'):
                    answer_options['b'] = line[2:].strip()
            elif line.startswith('Answer:'):
                in_main_question = False
                in_sub_questions = False
                in_answers = True
                continue
            elif in_answers and (line.startswith('a)') or line.startswith('b)')):
                if line.startswith('a)'):
                    answers['a'] = line[2:].strip()
                elif line.startswith('b)'):
                    answers['b'] = line[2:].strip()
            elif in_main_question:
                # Only add lines to question content if we're still in the main question section
                # Skip lines that are just numbers or empty
                if line and not line.replace('.', '').isdigit():
                    question_content += line + '\n'
        
        if question_content.strip() and answer_options:
            questions.append({
                "id": str(len(questions) + 1),
                "content": question_content.strip(),
                "type": "theory",
                "answer": {
                    "options": answer_options,
                    "answers": answers
                }
            })
    
    return questions

def parse_objective_questions(questions_text):
    """Parse objective questions from OpenAI response into structured format"""
    questions = []
    question_parts = questions_text.split("Question")
    
    for part in question_parts:
        if not part.strip() or part.strip().startswith("Question"):
            continue
            
        lines = part.strip().split('\n')
        if not lines:
            continue
            
        question_content = ""
        options = {}
        correct_answer = ""
        explanation = ""
        
        in_question = True
        in_options = False
        in_explanation = False
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            if line.startswith('A)') or line.startswith('B)') or line.startswith('C)') or line.startswith('D)'):
                in_question = False
                in_options = True
                if line.startswith('A)'):
                    options['A'] = line[2:].strip()
                elif line.startswith('B)'):
                    options['B'] = line[2:].strip()
                elif line.startswith('C)'):
                    options['C'] = line[2:].strip()
                elif line.startswith('D)'):
                    options['D'] = line[2:].strip()
            elif line.startswith('Correct Answer:'):
                in_question = False
                correct_answer = line.split(':')[1].strip()
            elif line.startswith('Explanation:'):
                in_question = False
                in_explanation = True
                explanation = line.split(':')[1].strip()
            elif in_explanation:
                explanation += " " + line
            elif in_question and not line.startswith('Question'):
                question_content += line + '\n'
        
        if question_content.strip() and options:
            questions.append({
                "id": str(len(questions) + 1),
                "content": f"{question_content.strip()}\n\nA) {options.get('A', '')}\nB) {options.get('B', '')}\nC) {options.get('C', '')}\nD) {options.get('D', '')}",
                "type": "objective",
                "answer": {
                    "correct": correct_answer,
                    "explanation": explanation
                }
            })
    
    return questions

def generate_questions(text, num_questions, question_type="theory"):
    if question_type == "objective":
        return generate_objective_questions(text, num_questions)
    else:
        return generate_theory_questions(text, num_questions)

def generate_theory_questions(text, num_questions):
    prompt = (
        f"You are an expert university lecturer and assessment designer.\n\n"
        f"Based on the following academic text, generate {num_questions} high-quality, university-level comprehension questions. "
        f"Your questions should:\n"
        f"- Test deep understanding, not simple recall.\n"
        f"- Encourage critical thinking, analysis, or application of concepts.\n"
        f"- Use a mix of short-answer, open-ended, and case-based questions.\n\n"
        f"Follow this EXACT format for each question (do not include anything else):\n"
        f"  Question [number]:\n"
        f"  [Main question text]\n"
        f"  a. [First sub-question]\n"
        f"  b. [Second sub-question]\n"
        f"  Answer:\n"
        f"  a) [Detailed answer to first sub-question based on the provided text]\n"
        f"  b) [Detailed answer to second sub-question based on the provided text]\n\n"
        f"TEXT:\n{text}"
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1200,
        )

        questions_text = response.choices[0].message.content.strip()
        return parse_theory_questions(questions_text)

    except Exception as e:
        print(f"Error generating theory questions: {e}")
        raise Exception(f"Failed to generate theory questions: {str(e)}")

def generate_objective_questions(text, num_questions):
    prompt = f"You are an expert university lecturer and assessment designer.\n\n" \
             f"Based on the following academic text, generate {num_questions} high-quality multiple choice questions. Your questions should:\n" \
             f"- Test understanding of key concepts from the text.\n" \
             f"- Have exactly 4 options (A, B, C, D).\n" \
             f"- Follow this EXACT format for each question:\n" \
             f"  Question [number]: [Question text]\n" \
             f"  A) [Option A]\n" \
             f"  B) [Option B]\n" \
             f"  C) [Option C]\n" \
             f"  D) [Option D]\n" \
             f"  Correct Answer: [Letter]\n" \
             f"  Explanation: [Detailed explanation based on the PDF text]\n\n" \
             f"Make sure:\n" \
             f"- Only one option is correct.\n" \
             f"- All options are plausible but clearly distinguishable.\n" \
             f"- The explanation directly references the PDF content.\n\n" \
             f"TEXT:\n{text}"

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1500
        )
        
        questions_text = response.choices[0].message.content.strip()
        return parse_objective_questions(questions_text)
        
    except Exception as e:
        print(f"Error generating objective questions: {e}")
        raise Exception(f"Failed to generate objective questions: {str(e)}")

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "AIM Question Generator API is running"})

@app.route("/api/generate-questions", methods=["POST"])
def generate_questions_api():
    """API endpoint to generate questions from PDF"""
    try:
        # Check if file is present
        if 'pdf_file' not in request.files:
            return jsonify({"error": "No PDF file provided"}), 400
        
        pdf = request.files['pdf_file']
        if not pdf or pdf.filename == '':
            return jsonify({"error": "No PDF file selected"}), 400
        
        if not pdf.filename.lower().endswith('.pdf'):
            return jsonify({"error": "File must be a PDF"}), 400
        
        # Get form data
        num_questions = int(request.form.get("num_questions", 3))
        question_type = request.form.get("question_type", "theory")
        
        # Validate inputs
        if num_questions < 1 or num_questions > 10:
            return jsonify({"error": "Number of questions must be between 1 and 10"}), 400
        
        if question_type not in ["theory", "objective"]:
            return jsonify({"error": "Question type must be 'theory' or 'objective'"}), 400
        
        # Extract text from PDF
        text = extract_text_from_pdf(pdf)
        if not text.strip():
            return jsonify({"error": "Could not extract text from the PDF. Please try a different file."}), 400
        
        # Limit text length for better performance
        text = text[:3000]  # Increased limit for better question generation
        
        # Generate questions
        questions = generate_questions(text, num_questions, question_type)
        
        if not questions:
            return jsonify({"error": "Failed to generate questions. Please try again."}), 500
        
        return jsonify({
            "success": True,
            "questions": questions,
            "question_type": question_type,
            "num_questions": len(questions)
        })
        
    except ValueError as e:
        return jsonify({"error": f"Invalid input: {str(e)}"}), 400
    except Exception as e:
        print(f"API error: {e}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
