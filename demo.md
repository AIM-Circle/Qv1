# Demo Guide - AIM Question Generator

This guide will help you test the AIM Question Generator application with sample documents.

## Quick Start

1. **Start the Application**
   - Run `start.ps1` (PowerShell) or `start.bat` (Command Prompt)
   - Or start manually:
     - Backend: `cd backend && python app.py`
     - Frontend: `npm run dev`

2. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Testing the Application

### 1. Health Check
Test the backend API is running:
```bash
cd backend
python test.py
```

### 2. Sample PDFs for Testing
You can test with any PDF document, but here are some good options:

- **Academic Papers**: Research papers, journal articles
- **Textbooks**: Educational content with clear concepts
- **Reports**: Business or technical reports
- **Articles**: News articles or blog posts

### 3. Test Scenarios

#### Scenario 1: Theory Questions
1. Upload a PDF with conceptual content
2. Select "Theory Questions" type
3. Choose 3-5 questions
4. Generate and review results

#### Scenario 2: Objective Questions
1. Upload a PDF with factual information
2. Select "Multiple Choice (Objective)" type
3. Choose 5-8 questions
4. Generate and review results

### 4. Expected Results

**Theory Questions:**
- Main question text displayed clearly
- Two sub-questions (a and b) shown as part of the main question
- Detailed answers provided for each sub-question
- Focus on understanding and critical thinking
- Sub-questions provide specific areas to focus on

**Objective Questions:**
- Multiple choice format (A, B, C, D)
- Correct answer indicated
- Detailed explanation provided

## Troubleshooting Demo Issues

### Backend Not Starting
- Check Python installation: `python --version`
- Verify dependencies: `pip list`
- Check OpenAI API key in `.env` file

### Frontend Not Starting
- Check Node.js installation: `node --version`
- Verify dependencies: `npm list`
- Check for port conflicts

### API Connection Errors
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify network connectivity

### Question Generation Fails
- Check OpenAI API key validity
- Verify API credits/quotas
- Check PDF text extraction

## Performance Tips

- **PDF Size**: Keep PDFs under 10MB for best performance
- **Text Content**: Ensure PDFs have extractable text (not just images)
- **Question Count**: Start with 3-5 questions for faster generation
- **Question Type**: Theory questions are generally faster than objective

## Sample Test Results

After successful generation, you should see:
- **Clean, formatted questions** with proper separation between question text and options
- **Enhanced UI** with improved badges, animations, and visual hierarchy
- **Proper answer structures** that are clearly separated from question content
- **Print-ready formatting** with clean layouts
- **Responsive design** that works on all devices
- **Smooth animations** for better user experience

### UI Improvements Made:
- **Objective Questions**: Clean option display with letter badges, improved spacing
- **Theory Questions**: Main question with sub-questions displayed clearly, detailed answers provided
- **Visual Enhancements**: Better color schemes, gradients, and hover effects
- **Animations**: Smooth slide-up, fade-in, and hover animations
- **Typography**: Improved readability with better font weights and spacing
- **Content Organization**: Clear separation between question types and their respective displays
- **Answer Display**: Comprehensive answers for theory questions with clear formatting

## Next Steps

Once testing is complete:
1. Customize the application for your needs
2. Deploy to production environment
3. Set up monitoring and logging
4. Configure production OpenAI API keys
