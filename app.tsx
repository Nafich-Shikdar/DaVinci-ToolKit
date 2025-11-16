
import React, { useState, useCallback } from 'react';
import { generateTitles } from './services/geminiService';
import Spinner from './components/Spinner';
import { CopyIcon, CheckIcon, SparklesIcon, BrainCircuitIcon } from './components/Icons';

const App: React.FC = () => {
  const [demoTitle, setDemoTitle] = useState<string>('');
  const [titleCount, setTitleCount] = useState<number>(10);
  const [isThinkingMode, setIsThinkingMode] = useState<boolean>(false);
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isAllCopied, setIsAllCopied] = useState<boolean>(false);

  const handleGenerateTitles = useCallback(async () => {
    if (!demoTitle.trim() || titleCount <= 0) {
      setError('অনুগ্রহ করে একটি ডেমো টাইটেল এবং টাইটেলের সংখ্যা ইনপুট দিন।');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedTitles([]);

    try {
      const titles = await generateTitles(demoTitle, titleCount, isThinkingMode);
      setGeneratedTitles(titles);
    } catch (err) {
      console.error(err);
      setError('টাইটেল তৈরি করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  }, [demoTitle, titleCount, isThinkingMode]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  const handleCopyAll = () => {
    if (generatedTitles.length === 0) return;
    const allTitlesText = generatedTitles.join('\n');
    navigator.clipboard.writeText(allTitlesText);
    setIsAllCopied(true);
    setTimeout(() => {
      setIsAllCopied(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-block bg-indigo-500/10 p-3 rounded-xl mb-4">
              <SparklesIcon className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            এআই টাইটেল জেনারেটর
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            আপনার পণ্যের জন্য আকর্ষণীয় ও এসইও-ফ্রেন্ডলি টাইটেল তৈরি করুন, মুহূর্তের মধ্যে।
          </p>
        </header>

        <main className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="demoTitle" className="block text-sm font-medium text-gray-300 mb-2">
                পণ্যের ডেমো টাইটেল
              </label>
              <input
                id="demoTitle"
                type="text"
                value={demoTitle}
                onChange={(e) => setDemoTitle(e.target.value)}
                placeholder="যেমন: পুরুষদের জন্য প্রিমিয়াম লেদার ওয়ালেট"
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="titleCount" className="block text-sm font-medium text-gray-300 mb-2">
                  কয়টি টাইটেল প্রয়োজন?
                </label>
                <input
                  id="titleCount"
                  type="number"
                  value={titleCount}
                  onChange={(e) => setTitleCount(Number(e.target.value))}
                  min="1"
                  max="100"
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                />
              </div>
              <div className="flex items-end">
                <div
                    onClick={() => setIsThinkingMode(!isThinkingMode)}
                    className="w-full flex items-center justify-between bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 cursor-pointer select-none"
                >
                    <div className="flex items-center gap-3">
                        <BrainCircuitIcon className={`w-6 h-6 transition-colors ${isThinkingMode ? 'text-indigo-400' : 'text-gray-500'}`} />
                        <span className="font-medium text-gray-200">থিংকিং মোড</span>
                    </div>
                    <div className={`relative w-12 h-6 rounded-full transition-colors ${isThinkingMode ? 'bg-indigo-600' : 'bg-gray-700'}`}>
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${isThinkingMode ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <button
              onClick={handleGenerateTitles}
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-indigo-600/20 text-lg"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  জেনারেট হচ্ছে...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  টাইটেল জেনারেট করুন
                </>
              )}
            </button>
          </div>

          {error && <p className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}
        </main>

        {generatedTitles.length > 0 && (
          <section className="mt-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-300">জেনারেট হওয়া টাইটেলসমূহ</h2>
              <button
                onClick={handleCopyAll}
                className="flex-shrink-0 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-all duration-200 px-4 py-2"
              >
                {isAllCopied ? (
                  <>
                    <CheckIcon className="w-4 h-4 mr-2 text-green-400" />
                    <span className="text-green-400">সব কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="w-4 h-4 mr-2" />
                    <span>সব কপি করুন</span>
                  </>
                )}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedTitles.map((title, index) => (
                <div key={index} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 flex justify-between items-center group">
                  <p className="text-gray-200 flex-1 pr-4">{title}</p>
                  <button
                    onClick={() => handleCopy(title, index)}
                    className="flex-shrink-0 flex items-center justify-center w-24 h-10 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-all duration-200"
                  >
                    {copiedIndex === index ? (
                      <>
                        <CheckIcon className="w-4 h-4 mr-2 text-green-400" />
                        <span className="text-green-400">কপি হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon className="w-4 h-4 mr-2" />
                        <span>কপি করুন</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default App;
