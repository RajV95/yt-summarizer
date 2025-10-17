"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles, Youtube, Loader2, CheckCircle2, AlertCircle, Copy, Download } from 'lucide-react';

const TranscriptionForm = () => {

  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSummary = () => {
    const blob = new Blob([summary], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'youtube-summary.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent)=>{
    e.preventDefault();
    setLoading(true);
    setError("");
    setSummary("");

    try {
      const transcriptRes = await fetch('/api/transcript', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({url}),
      });

      if(!transcriptRes.ok){
        const errorData = await transcriptRes.json();
        throw new Error(errorData.error || "Failed to Fetch Transcript");
      }

      const { transcript } = await transcriptRes.json();

      const summaryRes = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      })

      if(!summaryRes.ok){
        const errorData = await summaryRes.json();
        throw new Error(errorData.error || "Failed to generate Summary");
      }

      const { summary } = await summaryRes.json();
      setSummary(summary);
      setLoading(false);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl shadow-lg mb-4 animate-float">
            <Youtube className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
            YouTube AI Summarizer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform any YouTube video into a summary powered by AI ✨
          </p>
        </div>

        {/* Main Card */}
        <Card className="border-2 border-purple-100 dark:border-purple-800 shadow-2xl backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste YouTube URL here..."
                    className="pl-11 h-12 text-base border-2 focus:border-purple-400 dark:focus:border-purple-600"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="h-12 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Summarize
                    </>
                  )}
                </Button>
              </div>

              {/* Progress Indicator */}
              {loading && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center justify-center space-x-2 text-sm text-purple-600 dark:text-purple-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Fetching transcript and generating summary...</span>
                  </div>
                  <div className="w-full bg-purple-100 dark:bg-purple-900 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 animate-progress"></div>
                  </div>
                </div>
              )}
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl flex items-start space-x-3 animate-shake">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Oops! Something went wrong</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Success & Summary */}
            {summary && (
              <div className="mt-6 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">Summary Generated Successfully!</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadSummary}
                      className="border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                <Card className="border-2 border-purple-100 dark:border-purple-800 bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-900/20 shadow-xl">
                  <CardHeader className="border-b border-purple-100 dark:border-purple-800">
                    <CardTitle className="flex items-center space-x-2 text-purple-900 dark:text-purple-100">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <span>Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-purple-900 dark:prose-headings:text-purple-100 prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-strong:text-purple-800 dark:prose-strong:text-purple-300">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {summary}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 pb-8">
          <p>Powered by AI • Made with LangChain/LangGraph + Ollama</p>
          <p>Made by RajV95</p>
        </div>
      </div>
    </div>
  )
}

export default TranscriptionForm