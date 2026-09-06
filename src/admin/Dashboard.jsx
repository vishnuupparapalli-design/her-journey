import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { chapters } from '../data/chapters';
import { questions } from '../data/questions';
import { Link } from 'react-router-dom';

export default function Dashboard({ onLogout }) {
  const [answers, setAnswers] = useState([]);
  const [respondents, setRespondents] = useState([]);
  const [selectedRespondent, setSelectedRespondent] = useState('all');
  const [selectedChapter, setSelectedChapter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch all answers
      const { data: answersData, error: answersError } = await supabase
        .from('answers')
        .select('*')
        .order('created_at', { ascending: true });

      if (answersError) throw answersError;

      // 2. Fetch all respondents
      const { data: respondentsData } = await supabase
        .from('respondents')
        .select('*');

      setAnswers(answersData || []);
      setRespondents(respondentsData || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get question text by question_id
  const getQuestion = (qId) => {
    return questions.find((q) => q.id === qId) || { text: qId, subtext: '' };
  };

  // Helper to get chapter name
  const getChapterName = (cId) => {
    const ch = chapters.find((c) => c.id === cId);
    return ch ? `Ch ${ch.order}: ${ch.title}` : cId;
  };

  // Format value for display
  const formatAnswerValue = (val) => {
    if (val === null || val === undefined) return 'Skipped / Empty';
    if (typeof val === 'object') {
      if (Array.isArray(val)) return val.join(', ');
      return JSON.stringify(val);
    }
    return String(val);
  };

  // Filtering
  const filteredAnswers = answers.filter((ans) => {
    // Respondent filter
    if (selectedRespondent !== 'all' && ans.respondent_id !== selectedRespondent) return false;

    // Chapter filter
    if (selectedChapter !== 'all' && ans.chapter_id !== selectedChapter) return false;

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const q = getQuestion(ans.question_id);
      const textMatch = q.text.toLowerCase().includes(query);
      const valMatch = formatAnswerValue(ans.answer_value).toLowerCase().includes(query);
      return textMatch || valMatch;
    }

    return true;
  });

  // Export to CSV (Excel readable)
  const exportToCSV = () => {
    if (filteredAnswers.length === 0) return;

    const headers = ['Chapter', 'Question ID', 'Question Text', 'Her Answer', 'Answered At'];
    const rows = filteredAnswers.map((ans) => {
      const q = getQuestion(ans.question_id);
      return [
        `"${getChapterName(ans.chapter_id)}"`,
        `"${ans.question_id}"`,
        `"${q.text.replace(/"/g, '""')}"`,
        `"${formatAnswerValue(ans.answer_value).replace(/"/g, '""')}"`,
        `"${new Date(ans.updated_at).toLocaleString()}"`,
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `her_journey_answers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const exportToJSON = () => {
    const blob = new Blob([JSON.stringify(filteredAnswers, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `her_journey_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-[#0B0E1A] text-[#EDEAE0] p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EDEAE0]/10 pb-6">
          <div>
            <span className="text-xs font-mono text-[#E8A857] uppercase tracking-widest">
              Private Dashboard
            </span>
            <h1 className="text-3xl font-serif text-[#EDEAE0] font-light">
              Her Journey Explorer
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 rounded-lg bg-[#EDEAE0]/10 hover:bg-[#EDEAE0]/20 text-xs font-mono text-[#EDEAE0] transition-colors cursor-pointer"
            >
              Export CSV (Excel)
            </button>
            <button
              onClick={exportToJSON}
              className="px-4 py-2 rounded-lg bg-[#EDEAE0]/10 hover:bg-[#EDEAE0]/20 text-xs font-mono text-[#EDEAE0] transition-colors cursor-pointer"
            >
              Export JSON
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-xs font-mono text-red-300 border border-red-800/40 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Summary Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#1B1F3B]/50 border border-[#EDEAE0]/10">
            <p className="text-xs text-[#EDEAE0]/50 font-mono">TOTAL RESPONSES</p>
            <p className="text-2xl font-serif text-[#E8A857] mt-1">{answers.length}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#1B1F3B]/50 border border-[#EDEAE0]/10">
            <p className="text-xs text-[#EDEAE0]/50 font-mono">TRAVELERS</p>
            <p className="text-2xl font-serif text-[#8FB39B] mt-1">{respondents.length}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#1B1F3B]/50 border border-[#EDEAE0]/10">
            <p className="text-xs text-[#EDEAE0]/50 font-mono">FILTERED RESULTS</p>
            <p className="text-2xl font-serif text-[#7FA7C4] mt-1">{filteredAnswers.length}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#1B1F3B]/50 border border-[#EDEAE0]/10">
            <p className="text-xs text-[#EDEAE0]/50 font-mono">LATEST ACTIVITY</p>
            <p className="text-xs font-mono text-[#EDEAE0]/80 mt-2 truncate">
              {answers.length > 0
                ? new Date(answers[answers.length - 1].updated_at).toLocaleDateString()
                : 'None yet'}
            </p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across questions or her answers..."
              className="w-full p-3 rounded-xl bg-[#1B1F3B]/60 border border-[#EDEAE0]/15 text-xs text-[#EDEAE0] placeholder-[#EDEAE0]/30 focus:outline-none focus:border-[#E8A857]"
            />
          </div>

          {/* Chapter Filter Dropdown */}
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="p-3 rounded-xl bg-[#1B1F3B]/80 border border-[#EDEAE0]/15 text-xs text-[#EDEAE0] focus:outline-none focus:border-[#E8A857] cursor-pointer"
          >
            <option value="all">All 14 Chapters</option>
            {chapters.map((c) => (
              <option key={c.id} value={c.id}>
                Chapter {c.order}: {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Dense, Ultra-Readable Table View */}
        <div className="rounded-2xl border border-[#EDEAE0]/10 bg-[#1B1F3B]/30 overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-xs text-[#EDEAE0]/40 font-mono">
              Loading records from Supabase...
            </p>
          ) : filteredAnswers.length === 0 ? (
            <p className="p-8 text-center text-xs text-[#EDEAE0]/40 font-mono">
              No matching answers found.
            </p>
          ) : (
            <div className="divide-y divide-[#EDEAE0]/10">
              {filteredAnswers.map((ans) => {
                const q = getQuestion(ans.question_id);
                const isExpanded = expandedId === ans.id;

                return (
                  <div
                    key={ans.id}
                    onClick={() => setExpandedId(isExpanded ? null : ans.id)}
                    className="p-4 md:p-5 hover:bg-[#1B1F3B]/60 transition-colors cursor-pointer space-y-2"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 text-xs">
                      <span className="font-mono text-[#E8A857] text-[11px]">
                        {getChapterName(ans.chapter_id)} · {ans.question_id}
                      </span>
                      <span className="text-[11px] font-mono text-[#EDEAE0]/40">
                        {new Date(ans.updated_at).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-sm font-serif text-[#EDEAE0] font-normal">
                      {q.text}
                    </p>

                    <div className="p-3 rounded-xl bg-[#0B0E1A]/80 border border-[#EDEAE0]/10">
                      <p className="text-xs md:text-sm font-mono text-[#8FB39B] whitespace-pre-wrap">
                        {formatAnswerValue(ans.answer_value)}
                      </p>
                    </div>

                    {/* Expandable details on click */}
                    {isExpanded && (
                      <div className="pt-2 text-[11px] font-mono text-[#EDEAE0]/50 space-y-1 border-t border-[#EDEAE0]/5 mt-2">
                        <p>Answer Type: {ans.answer_type}</p>
                        <p>Respondent ID: {ans.respondent_id}</p>
                        <p>Unique Row ID: {ans.id}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Link */}
        <div className="pt-4 text-center">
          <Link to="/" className="text-xs text-[#EDEAE0]/40 hover:text-[#EDEAE0] transition-colors">
            ← Return to Journey Experience
          </Link>
        </div>
      </div>
    </main>
  );
}