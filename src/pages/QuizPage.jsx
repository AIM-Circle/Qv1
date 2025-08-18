import { useState } from "react";
import { useNavigate } from "react-router-dom";

const QuizPage = () => {
    const navigate = useNavigate();
  const mockQuestions = [
    {
      id: 1,
      type: "multiple-choice",
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Lisbon"],
      correctAnswer: "Paris",
    },
    {
      id: 2,
      type: "fill-in-the-blank",
      question: "_______ is the process of cell division in biology.",
      correctAnswer: "Mitosis",
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const currentQuestion = mockQuestions[currentQuestionIndex];

  const handleOptionSelect = (option) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: option,
    });
  };

  const handleInputChange = (e) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: e.target.value,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowSummary(false);
  };

  const handleBackToHome = () => {
    navigate("/dashboard"); 
  };

  return (
    <div className="page">
      <h1 className="page-title">AIM Circle</h1>
      <div className="upload-container">
      {!showSummary ? (
        <>
          <h1 className="upload-title">Quiz Time!</h1>
          <p className="upload-subtitle">{currentQuestion.question}</p>

          {currentQuestion.type === "multiple-choice" ? (
            <div>
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  style={{
                    padding: "10px",
                    margin: "10px 0",
                    border: userAnswers[currentQuestion.id] === option ? "2px solid #007bff" : "1px solid #ccc",
                    borderRadius: "8px",
                    cursor: "pointer",
                    background: userAnswers[currentQuestion.id] === option ? "#e0f0ff" : "#f9f9f9",
                    width: "100%",
                    textAlign: "left",
                  }}
                  aria-pressed={userAnswers[currentQuestion.id] === option}
                >
                  <p className="text">{option}</p>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <input
                id={`question-${currentQuestion.id}`}
                type="text"
                value={userAnswers[currentQuestion.id] || ""}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          )}

          <button onClick={handleNext} className="upload-button" style={{ marginTop: "20px" }}>
            {currentQuestionIndex === mockQuestions.length - 1 ? "Submit" : "Next"}
          </button>
        </>
      ) : (
        <>
          <h1 className="upload-title">Quiz Completed!</h1>
          <p className="upload-subtitle">Your answers:</p>
          <ul style={{ textAlign: "left" }}>
            {mockQuestions.map((q) => (
              <li key={q.id}>
                <div>
                <p className="text">Q{q.id}: {q.question}</p> 
                <p className="text">Your Answer: {userAnswers[q.id] || "No answer provided"}</p>
                <p className="text">Result:{" "}
                {userAnswers[q.id] === q.correctAnswer ? (
                  <span style={{ color: "green" }}>Correct</span>
                ) : (
                  <span style={{ color: "red" }}>Incorrect</span>
                )}</p>
                <br />
                </div>
              </li>
            ))}
          </ul>
          <button onClick={handleRestart} className="upload-button" style={{ marginTop: "20px" }}>
            Restart Quiz
          </button>
          <br />
          <button onClick={handleBackToHome} className="upload-button" style={{ marginTop: "10px", backgroundColor: "#ccc", color: "#333" }}>
            Back to Home
            </button>
        </>
      )}
    </div>
    </div>
  );
};

export default QuizPage;
