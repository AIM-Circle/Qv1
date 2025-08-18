# AIM Question Generator

An AI-powered application that generates intelligent questions from PDF documents. Built with React frontend and Flask backend, it uses OpenAI's GPT models to create high-quality educational questions.

## Features

- **PDF Text Extraction**: Automatically extracts text from uploaded PDF files
- **AI Question Generation**: Uses OpenAI GPT-4o-mini to generate intelligent questions
- **Two Question Types**:
  - **Theory Questions**: Open-ended questions with sub-questions and answers
  - **Objective Questions**: Multiple choice questions with explanations
- **Customizable Settings**: Choose number of questions (1-10) and question type
- **Print-Ready Format**: Clean, printable output for educational use
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Processing**: Instant question generation from your documents

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Shadcn/ui components
- React Router for navigation
- React Query for state management

### Backend
- Flask (Python)
- PyMuPDF for PDF text extraction
- OpenAI API integration
- CORS support for frontend integration

## Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.8+
- OpenAI API key

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd aim-qgen
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
# Create a .env file with:
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env

# Start the backend server
python app.py
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# In a new terminal, from the root directory
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Test the Setup

```bash
# Test backend API (from backend directory)
python test.py
```

## Usage

1. **Upload PDF**: Drag and drop or click to upload a PDF document
2. **Configure Settings**: Choose the number of questions and question type
3. **Generate Questions**: Click "Generate Questions" to process your document
4. **Review Results**: View generated questions with answers
5. **Print/Export**: Use the print function to save questions for educational use

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/generate-questions` - Generate questions from PDF

## Environment Variables

Create a `.env` file in the backend directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## Troubleshooting

### Common Issues

1. **Backend Connection Error**
   - Ensure the Flask server is running on port 5000
   - Check that all dependencies are installed
   - Verify the virtual environment is activated

2. **OpenAI API Errors**
   - Verify your API key is correct
   - Check your OpenAI account has sufficient credits
   - Ensure the API key has access to GPT-4o-mini

3. **PDF Processing Issues**
   - Ensure the PDF is not password-protected
   - Try with a different PDF file
   - Check that the PDF contains extractable text

### Development

- Backend logs will appear in the terminal running `python app.py`
- Frontend logs will appear in the browser console
- Use the test script to verify backend functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the repository.
