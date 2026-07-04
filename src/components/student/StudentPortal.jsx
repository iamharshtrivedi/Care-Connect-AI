import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { CASE_STUDIES, QUIZ_QUESTIONS, TUTOR_RESPONSES } from '../../data/mockData';
import {
  GraduationCap, BookOpen, MessageSquare, Brain, ChevronRight,
  CheckCircle, XCircle, Award, Sparkles, ArrowRight, RotateCcw,
  Lightbulb, HelpCircle, Target, TrendingUp, Clock
} from 'lucide-react';
import TypewriterText from '../shared/TypewriterText';
import GeminiBadge from '../shared/GeminiBadge';

export default function StudentPortal() {
  const { darkMode } = useApp();
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const selectCaseStudy = (study) => {
    setSelectedStudy(study);
    setChatMessages([{
      role: 'tutor',
      text: `Welcome! You're now reviewing the case: **"${study.title}"**.\n\nI'm your AI Medical Tutor. I'll help you understand the clinical reasoning behind this case. Select a question below to begin your exploration, or ask your own!`,
    }]);
  };

  const askQuestion = (question) => {
    setChatMessages(prev => [...prev, { role: 'student', text: question }]);
    setIsTyping(true);

    const response = TUTOR_RESPONSES[question];
    setTimeout(() => {
      setIsTyping(false);
      setChatMessages(prev => [...prev, {
        role: 'tutor',
        text: response?.response || "That's a thoughtful question! In this case, the AI analyzed multiple symptom features using weighted Bayesian inference. Each clinical feature contributes independently to the posterior probability. Let me know if you'd like me to dive deeper into any specific aspect.",
        isNew: true
      }]);
    }, 1800);
  };

  const handleQuizAnswer = (index) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === QUIZ_QUESTIONS[currentQuestion].correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
    setQuizStarted(true);
  };

  const difficultyColor = (d) => {
    if (d === 'Advanced') return darkMode ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-200';
    if (d === 'Intermediate') return darkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-200';
    return darkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200';
  };

  const cardClass = darkMode ? 'glass-card rounded-2xl p-5' : 'glass-card-light rounded-2xl p-5 shadow-sm';
  const labelClass = darkMode ? 'text-slate-400' : 'text-gray-500';
  const headingClass = darkMode ? 'text-white' : 'text-gray-900';

  const tutorQuestions = Object.keys(TUTOR_RESPONSES);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${headingClass}`}>
            <GraduationCap className="inline w-6 h-6 mr-2 text-violet-400" />
            Student Learning Portal
          </h2>
          <p className={`text-sm mt-1 ${labelClass}`}>
            Interactive clinical reasoning with AI-guided case studies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
            darkMode ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' : 'bg-violet-50 text-violet-600 border border-violet-200'
          }`}>
            <Award className="w-3.5 h-3.5" />
            3 Case Studies Available
          </div>
        </div>
      </div>

      {/* Institutional Access Banner */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${
        darkMode
          ? 'bg-violet-500/5 border border-violet-500/20'
          : 'bg-violet-50 border border-violet-200'
      }`}>
        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
          <GraduationCap className="w-4 h-4 text-violet-400" />
        </div>
        <div>
          <p className={`text-sm font-semibold ${darkMode ? 'text-violet-300' : 'text-violet-700'}`}>
            Institutional Access Active: Simulated via Medical College Partner Node
          </p>
          <p className={`text-[10px] mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Content approved for educational use · Student ID verified via institutional SSO
          </p>
        </div>
      </div>

      {/* Case Study Library */}
      {!selectedStudy && (
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${headingClass}`}>
            <BookOpen className="inline w-5 h-5 mr-2 text-primary-light" />
            Case Study Library
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CASE_STUDIES.map(study => (
              <button
                key={study.id}
                id={`case-study-${study.id}`}
                onClick={() => selectCaseStudy(study)}
                className={`text-left p-5 rounded-2xl transition-all group hover:scale-[1.02] ${
                  darkMode
                    ? 'glass-card hover:border-primary/40'
                    : 'glass-card-light hover:border-indigo-300 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyColor(study.difficulty)}`}>
                    {study.difficulty}
                  </span>
                  <span className={`text-xs ${labelClass}`}>{study.category}</span>
                </div>
                <h4 className={`text-sm font-semibold mb-2 leading-tight ${headingClass} group-hover:text-primary-light transition-colors`}>
                  {study.title}
                </h4>
                <p className={`text-xs ${labelClass} line-clamp-3 mb-3`}>{study.presentation.slice(0, 150)}...</p>
                <div className={`flex items-center gap-1.5 text-xs font-medium ${darkMode ? 'text-primary-light' : 'text-indigo-600'}`}>
                  Explore Case <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Case Study View */}
      {selectedStudy && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Case Details */}
          <div className="lg:col-span-3 space-y-4">
            {/* Back Button */}
            <button
              onClick={() => { setSelectedStudy(null); setChatMessages([]); }}
              className={`text-xs font-medium flex items-center gap-1 ${darkMode ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
            >
              ← Back to Library
            </button>

            {/* Case Flow: Presentation → AI Reasoning → Doctor Decision */}
            <div className={cardClass}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyColor(selectedStudy.difficulty)}`}>
                  {selectedStudy.difficulty}
                </span>
                <span className={`text-xs ${labelClass}`}>{selectedStudy.category}</span>
              </div>
              <h3 className={`text-lg font-semibold mb-4 ${headingClass}`}>{selectedStudy.title}</h3>

              {/* Step 1: Presentation */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">1</div>
                  <span className={`text-sm font-semibold ${headingClass}`}>Patient Presentation</span>
                </div>
                <div className={`ml-8 p-4 rounded-xl ${darkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-gray-50 border border-gray-200'}`}>
                  <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>{selectedStudy.presentation}</p>
                </div>
              </div>

              {/* Step 2: AI Reasoning Path */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">2</div>
                    <span className={`text-sm font-semibold ${headingClass}`}>AI Reasoning Path</span>
                  </div>
                  <GeminiBadge className="scale-90 origin-right" />
                </div>
                <div className="ml-8 space-y-2">
                  {selectedStudy.aiReasoning.map((step, i) => (
                    <div key={i} className={`p-3 rounded-xl ${darkMode ? 'bg-slate-800/30 border border-slate-700/40' : 'bg-gray-50/50 border border-gray-200'}`}>
                      <p className={`text-xs font-semibold mb-1 ${darkMode ? 'text-primary-light' : 'text-indigo-600'}`}>
                        Step {step.step}: {step.title}
                      </p>
                      <TypewriterText text={step.detail} speed={10} className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-gray-600'}`} />
                    </div>
                  ))}
                </div>

                {/* AI Differential */}
                <div className="ml-8 mt-3 space-y-1.5">
                  {selectedStudy.aiDifferential.map((d, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className={`text-xs font-medium w-16 text-right ${
                        d.confidencePct >= 70 ? 'text-emerald-400' : d.confidencePct >= 30 ? 'text-amber-400' : labelClass
                      }`}>
                        {d.confidencePct}%
                      </span>
                      <div className={`flex-1 h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                        <div
                          className={`h-full rounded-full ${
                            d.confidencePct >= 70 ? 'bg-emerald-500' : d.confidencePct >= 30 ? 'bg-amber-500' : 'bg-slate-500'
                          }`}
                          style={{ width: `${d.confidencePct}%` }}
                        />
                      </div>
                      <span className={`text-xs flex-1 ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>{d.condition}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 3: Doctor Decision */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">3</div>
                  <span className={`text-sm font-semibold ${headingClass}`}>Doctor's Final Decision</span>
                </div>
                <div className={`ml-8 p-4 rounded-xl ${
                  darkMode ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'
                }`}>
                  <p className={`text-sm leading-relaxed ${darkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>{selectedStudy.doctorDecision}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: AI Tutor Chat */}
          <div className="lg:col-span-2 space-y-4">
            <div className={`${cardClass} flex flex-col h-[600px]`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-semibold ${headingClass}`}>AI Medical Tutor</h3>
                    <p className={`text-[10px] ${labelClass}`}>Socratic Learning Mode</p>
                  </div>
                </div>
                <GeminiBadge className="scale-75 origin-right hidden sm:flex" />
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'student' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'student'
                        ? 'bg-gradient-to-r from-primary to-primary-dark text-white rounded-br-md'
                        : darkMode
                          ? 'bg-slate-800 text-slate-200 border border-slate-700/50 rounded-bl-md'
                          : 'bg-gray-100 text-gray-800 border border-gray-200 rounded-bl-md'
                    }`}>
                      {msg.text.split('\n').map((line, j) => (
                        <p key={j} className={j > 0 ? 'mt-2' : ''}>
                          {line.split('**').map((part, k) =>
                            k % 2 === 1 ? <strong key={k}>{part}</strong> : part
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start animate-fade-in">
                    <div className={`rounded-2xl px-4 py-3 flex items-center gap-1.5 ${
                      darkMode ? 'bg-slate-800 border border-slate-700/50' : 'bg-gray-100 border border-gray-200'
                    }`}>
                      <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Questions */}
              <div className="space-y-1.5">
                <p className={`text-[10px] font-medium ${labelClass}`}>
                  <Lightbulb className="inline w-3 h-3 mr-1" />
                  Ask the tutor:
                </p>
                {tutorQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => askQuestion(q)}
                    disabled={isTyping}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all ${
                      isTyping
                        ? 'opacity-50 cursor-not-allowed'
                        : darkMode
                          ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700/50'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <HelpCircle className="inline w-3 h-3 mr-1.5 text-violet-400" />
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Section */}
      <div className={cardClass}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${headingClass}`}>
            <Target className="inline w-5 h-5 mr-2 text-accent-amber" />
            Knowledge Check Quiz
          </h3>
          {!quizStarted && (
            <button
              id="start-quiz"
              onClick={() => { setQuizStarted(true); resetQuiz(); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/25 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Start Quiz
            </button>
          )}
        </div>

        {quizStarted && !quizComplete && (
          <div className="animate-fade-in">
            {/* Progress */}
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs ${labelClass}`}>Question {currentQuestion + 1}/{QUIZ_QUESTIONS.length}</span>
              <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all"
                  style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>
              <span className={`text-xs font-medium ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>Score: {score}</span>
            </div>

            {/* Question */}
            <p className={`text-sm font-medium mb-4 leading-relaxed ${headingClass}`}>
              {QUIZ_QUESTIONS[currentQuestion].question}
            </p>

            {/* Options */}
            <div className="space-y-2 mb-4">
              {QUIZ_QUESTIONS[currentQuestion].options.map((opt, i) => {
                const isCorrect = i === QUIZ_QUESTIONS[currentQuestion].correctIndex;
                const isSelected = i === selectedAnswer;
                let optStyle = darkMode
                  ? 'bg-slate-800/50 border border-slate-700/50 text-slate-200 hover:bg-slate-800'
                  : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100';

                if (showResult) {
                  if (isCorrect) optStyle = 'bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-400';
                  else if (isSelected && !isCorrect) optStyle = 'bg-red-500/10 border-2 border-red-500/40 text-red-400';
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleQuizAnswer(i)}
                    disabled={showResult}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-3 ${optStyle}`}
                  >
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      showResult && isCorrect
                        ? 'bg-emerald-500 text-white'
                        : showResult && isSelected && !isCorrect
                          ? 'bg-red-500 text-white'
                          : darkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {showResult && isCorrect ? <CheckCircle className="w-3.5 h-3.5" /> :
                       showResult && isSelected && !isCorrect ? <XCircle className="w-3.5 h-3.5" /> :
                       String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showResult && (
              <div className={`mb-4 p-4 rounded-xl animate-slide-up ${
                selectedAnswer === QUIZ_QUESTIONS[currentQuestion].correctIndex
                  ? darkMode ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'
                  : darkMode ? 'bg-red-500/5 border border-red-500/20' : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-xs font-semibold mb-1 ${
                  selectedAnswer === QUIZ_QUESTIONS[currentQuestion].correctIndex ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {selectedAnswer === QUIZ_QUESTIONS[currentQuestion].correctIndex ? '✓ Correct!' : '✗ Incorrect'}
                </p>
                <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                  {QUIZ_QUESTIONS[currentQuestion].explanation}
                </p>
              </div>
            )}

            {showResult && (
              <button
                onClick={nextQuestion}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg transition-all"
              >
                {currentQuestion < QUIZ_QUESTIONS.length - 1 ? (
                  <>Next Question <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>See Results <Award className="w-4 h-4" /></>
                )}
              </button>
            )}
          </div>
        )}

        {quizComplete && (
          <div className="text-center py-8 animate-slide-up">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h4 className={`text-xl font-bold ${headingClass}`}>Quiz Complete!</h4>
            <p className={`text-3xl font-bold mt-2 ${
              score === QUIZ_QUESTIONS.length ? 'text-emerald-400' : score >= 2 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {score}/{QUIZ_QUESTIONS.length}
            </p>
            <p className={`text-sm mt-1 ${labelClass}`}>
              {score === QUIZ_QUESTIONS.length ? 'Perfect score! Excellent clinical reasoning.' :
               score >= 2 ? 'Good work! Review the case studies to strengthen your knowledge.' :
               'Keep studying! Review the AI reasoning paths in the case studies.'}
            </p>
            <button
              onClick={resetQuiz}
              className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg transition-all mx-auto"
            >
              <RotateCcw className="w-4 h-4" /> Retake Quiz
            </button>
          </div>
        )}

        {!quizStarted && (
          <p className={`text-sm ${labelClass}`}>
            Test your clinical reasoning skills with a 3-question quiz based on the case studies above. Instant feedback with detailed explanations.
          </p>
        )}
      </div>
    </div>
  );
}
