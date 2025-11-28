import React, { useState, useMemo } from 'react';
import { QUESTIONS, TOTAL_QUESTIONS, IQ_RANGES } from './constants';
import { UserAnswers, Category, ScoreAnalysis } from './types';
import { Button } from './components/Button';
import { ProgressBar } from './components/ProgressBar';
import { generateIQAnalysis } from './services/geminiService';
import { Brain, ChevronRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

// Screen states
type Screen = 'intro' | 'test' | 'results';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [analysisText, setAnalysisText] = useState<string>('');
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  const handleStart = () => {
    setScreen('test');
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleAnswer = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishTest();
    }
  };

  const calculateScore = (): ScoreAnalysis => {
    let correctCount = 0;
    const breakdown: Record<Category, { correct: number; total: number }> = {
      [Category.NUMERICAL]: { correct: 0, total: 0 },
      [Category.LOGICAL]: { correct: 0, total: 0 },
      [Category.SPATIAL]: { correct: 0, total: 0 },
      [Category.VERBAL]: { correct: 0, total: 0 },
    };

    QUESTIONS.forEach(q => {
      const isCorrect = answers[q.id] === q.correctAnswerIndex;
      if (isCorrect) correctCount++;
      
      breakdown[q.category].total++;
      if (isCorrect) breakdown[q.category].correct++;
    });

    // Simple Linear Mapping for IQ Estimate (Baseline 70 + (Score * 3.75))
    // 0 correct -> 70 IQ
    // 20 correct -> 145 IQ
    const iqEstimate = Math.round(70 + (correctCount * 3.75));
    
    const classification = IQ_RANGES.find(r => iqEstimate >= r.min && iqEstimate <= r.max)?.label || "غير محدد";

    return { correctCount, iqEstimate, classification, breakdown };
  };

  const finishTest = async () => {
    setScreen('results');
    const results = calculateScore();
    
    setIsLoadingAnalysis(true);
    const analysis = await generateIQAnalysis(results.correctCount, results.breakdown);
    setAnalysisText(analysis);
    setIsLoadingAnalysis(false);
  };

  const results = useMemo(() => screen === 'results' ? calculateScore() : null, [screen, answers]);

  // --- RENDERERS ---

  const renderIntro = () => (
    <div className="max-w-2xl mx-auto text-center space-y-8 p-8 animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-indigo-100 rounded-full">
          <Brain className="w-16 h-16 text-indigo-600" />
        </div>
      </div>
      <h1 className="text-4xl font-bold text-slate-800">اختبار الذكاء العربي المتقدم</h1>
      <p className="text-lg text-slate-600 leading-relaxed">
        هذا الاختبار مصمم لقياس قدراتك الذهنية في أربعة مجالات رئيسية: 
        <span className="font-bold text-indigo-600 mx-1">المنطق الرقمي</span>،
        <span className="font-bold text-indigo-600 mx-1">الاستدلال المنطقي</span>،
        <span className="font-bold text-indigo-600 mx-1">الذكاء المكاني</span>، و
        <span className="font-bold text-indigo-600 mx-1">القدرات اللفظية</span>.
      </p>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-right">
        <h3 className="font-bold text-slate-800 mb-4 text-xl">تعليمات الاختبار:</h3>
        <ul className="space-y-3 text-slate-600 list-disc list-inside">
          <li>عدد الأسئلة: <strong>20 سؤالاً</strong></li>
          <li>الزمن المقدر: <strong>10-15 دقيقة</strong></li>
          <li>تتدرج الأسئلة من السهل إلى الصعب.</li>
          <li>حاول الإجابة على جميع الأسئلة ولا تترك أي سؤال فارغاً.</li>
        </ul>
      </div>

      <Button onClick={handleStart} className="w-full md:w-auto text-lg px-12">
        ابدأ الاختبار الآن
      </Button>
    </div>
  );

  const renderQuestion = () => {
    const isAnswered = answers[currentQuestion.id] !== undefined;

    return (
      <div className="max-w-3xl mx-auto w-full">
        <ProgressBar current={currentQuestionIndex + 1} total={TOTAL_QUESTIONS} />
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="p-8 border-b border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">
                {currentQuestion.category === 'numerical' && 'استدلال رقمي'}
                {currentQuestion.category === 'logical' && 'منطق'}
                {currentQuestion.category === 'spatial' && 'ذكاء مكاني'}
                {currentQuestion.category === 'verbal' && 'قدرات لفظية'}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-6 leading-normal">
              {currentQuestion.questionText}
            </h2>

            {currentQuestion.asciiArt && (
              <div className="bg-slate-900 text-green-400 p-6 rounded-lg font-mono text-center text-lg md:text-xl whitespace-pre-wrap overflow-x-auto mb-6 shadow-inner dir-ltr">
                {currentQuestion.asciiArt}
              </div>
            )}
          </div>

          <div className="p-8 bg-slate-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={`
                    p-4 rounded-xl text-right transition-all duration-200 border-2 relative
                    ${answers[currentQuestion.id] === idx 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md' 
                      : 'border-white bg-white hover:border-indigo-200 text-slate-700 hover:shadow-sm'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center ml-3 text-sm font-bold border
                      ${answers[currentQuestion.id] === idx 
                        ? 'bg-indigo-600 text-white border-indigo-600' 
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                      }
                    `}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-6 border-t border-slate-100 bg-white flex justify-end">
            <Button 
              onClick={handleNext} 
              disabled={!isAnswered}
              className="flex items-center gap-2"
            >
              {currentQuestionIndex === TOTAL_QUESTIONS - 1 ? 'إنهاء الاختبار' : 'السؤال التالي'}
              <ChevronRight className="w-5 h-5 rotate-180" /> 
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!results) return null;

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-800">نتائج الاختبار</h2>
          <p className="text-slate-500">تم الانتهاء من التقييم بنجاح</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Score Card */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-0 opacity-50"></div>
            
            <div className="p-8 text-center relative z-10">
              <span className="text-slate-500 font-medium">معدل الذكاء التقديري (IQ)</span>
              <div className="text-7xl font-bold text-indigo-600 my-4 tracking-tighter">
                {results.iqEstimate}
              </div>
              <div className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full font-bold text-sm mb-6">
                {results.classification}
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-700">{results.correctCount}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">إجابة صحيحة</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-700">{Math.round((results.correctCount / TOTAL_QUESTIONS) * 100)}%</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">الدقة</div>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 space-y-6">
            <h3 className="font-bold text-slate-800 border-b pb-2">تفاصيل الأداء</h3>
            {(Object.entries(results.breakdown) as [string, { correct: number; total: number }][]).map(([cat, val]) => (
              <div key={cat}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-600 capitalize">
                     {cat === 'numerical' && 'رقمي'}
                     {cat === 'logical' && 'منطقي'}
                     {cat === 'spatial' && 'مكاني'}
                     {cat === 'verbal' && 'لفظي'}
                  </span>
                  <span className="text-slate-400">{val.correct}/{val.total}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      val.correct === val.total ? 'bg-emerald-500' : 
                      val.correct >= val.total/2 ? 'bg-indigo-500' : 'bg-amber-500'
                    }`} 
                    style={{ width: `${(val.correct / val.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis Section */}
        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-lg border border-indigo-100 p-8 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
               <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-indigo-900">تحليل الذكاء الاصطناعي</h3>
          </div>
          
          <div className="prose prose-indigo max-w-none text-slate-700 leading-relaxed min-h-[100px]">
            {isLoadingAnalysis ? (
              <div className="flex items-center gap-3 text-indigo-500 animate-pulse">
                <Brain className="w-5 h-5 animate-bounce" />
                <span>جاري تحليل نمط إجاباتك وتوليد التقرير...</span>
              </div>
            ) : (
              <p className="whitespace-pre-line">{analysisText}</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-center pt-8">
            <Button variant="outline" onClick={() => window.location.reload()}>
                إعادة الاختبار
            </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-indigo-600" />
            <span className="font-bold text-xl tracking-tight text-slate-800">IQ Test <span className="text-indigo-600">Pro</span></span>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center">
        {screen === 'intro' && renderIntro()}
        {screen === 'test' && renderQuestion()}
        {screen === 'results' && renderResults()}
      </main>

      <footer className="text-center py-6 text-slate-400 text-sm">
        <p>&copy; 2024 Arabic IQ Test Pro. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;