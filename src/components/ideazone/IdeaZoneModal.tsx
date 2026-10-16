import React, { useState, useEffect, useMemo } from 'react';
import { IdeaNote, IdeaCategory, CodeLanguage } from '../../types';
import { sound } from '../../utils/audio';
import { CatFace } from '../common/CatFace';
import {
  Lightbulb,
  X,
  Search,
  Plus,
  Pin,
  Trash2,
  Copy,
  Check,
  Code2,
  Terminal,
  Play,
  Download,
  Tag,
  Clock,
  Sparkles,
  FileText,
  Bookmark
} from 'lucide-react';

interface Props {
  onClose: () => void;
  onOpenCodeZone: (snippet?: string, lang?: CodeLanguage) => void;
  seedNote?: {
    title: string;
    content: string;
    codeSnippet?: string;
    codeLanguage?: CodeLanguage;
  };
}

const STORAGE_KEY = 'coderbhai_ideazone_notes_v2';

const DEFAULT_NOTES: IdeaNote[] = [
  {
    id: 'note-1',
    title: '🚀 Building a Fast CLI Shell in Pure C',
    content: 'Plan: Use <stdio.h>, malloc(), and free() to build a minimal command parser. Remember: in C, argv is an array of pointers (char* argv[]), and strings must terminate with \\0! Lin recommends testing buffer bounds with sizeof().',
    category: 'idea',
    codeSnippet: `#include <stdio.h>
#include <string.h>

int main(int argc, char* argv[]) {
    printf("CoderBhai Shell initialized. Arguments: %d\\n", argc);
    return 0;
}`,
    codeLanguage: 'c',
    pinned: true,
    tags: ['project-idea', 'pure-c', 'system-tool'],
    createdAt: '2026-10-16T12:00:00.000Z',
    updatedAt: '2026-10-16T12:00:00.000Z',
  },
  {
    id: 'note-2',
    title: '🧠 Memory Address Mental Model (& vs *)',
    content: "Lin's Golden Rule of RAM:\n• &variable = The address on the envelope (where the box lives in RAM).\n• int* ptr = The pointer variable holding that address.\n• *ptr = Opening the front door to read or change the furniture inside!",
    category: 'dsa',
    codeSnippet: `int x = 42;
int* ptr = &x; // stores address of x
*ptr = 99;     // updates x to 99!
printf("x is now %d\\n", x);`,
    codeLanguage: 'c',
    pinned: true,
    tags: ['mental-model', 'pointers', 'cs-foundations'],
    createdAt: '2026-10-16T12:30:00.000Z',
    updatedAt: '2026-10-16T12:30:00.000Z',
  },
  {
    id: 'note-3',
    title: '🐛 Classic C scanf & Bug to Never Repeat',
    content: 'Always pass &variable to scanf() for primitive types! If you forget &, scanf treats the uninitialized variable as an address and crashes with a Segmentation Fault.',
    category: 'bug',
    codeSnippet: `int score = 0;
printf("Enter score: ");
scanf("%d", &score); // Never forget &!
printf("Saved score: %d\\n", score);`,
    codeLanguage: 'c',
    pinned: false,
    tags: ['bug-tracker', 'scanf', 'debugging'],
    createdAt: '2026-10-16T13:00:00.000Z',
    updatedAt: '2026-10-16T13:00:00.000Z',
  }
];

export const IdeaZoneModal: React.FC<Props> = ({ onClose, onOpenCodeZone, seedNote }) => {
  const [notes, setNotes] = useState<IdeaNote[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_NOTES;
  });

  const [activeNoteId, setActiveNoteId] = useState<string>(() => notes[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState<IdeaCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState<string>('');
  const [isSavedRecently, setIsSavedRecently] = useState<boolean>(false);

  // If seeded from CodeZone, create and focus note immediately
  useEffect(() => {
    if (seedNote) {
      const newNote: IdeaNote = {
        id: 'note-' + Date.now(),
        title: seedNote.title,
        content: seedNote.content,
        category: 'snippet',
        codeSnippet: seedNote.codeSnippet,
        codeLanguage: seedNote.codeLanguage || 'c',
        pinned: true,
        tags: ['from-codezone', seedNote.codeLanguage || 'snippet'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes(prev => [newNote, ...prev]);
      setActiveNoteId(newNote.id);
    }
  }, [seedNote]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      setIsSavedRecently(true);
      const timer = setTimeout(() => setIsSavedRecently(false), 1500);
      return () => clearTimeout(timer);
    } catch {
      // ignore
    }
  }, [notes]);

  const activeNote = useMemo(() => {
    return notes.find(n => n.id === activeNoteId) || notes[0];
  }, [notes, activeNoteId]);

  // Filtered notes
  const filteredNotes = useMemo(() => {
    return notes
      .filter(note => {
        const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          note.title.toLowerCase().includes(q) ||
          note.content.toLowerCase().includes(q) ||
          note.tags.some(t => t.toLowerCase().includes(q));
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [notes, selectedCategory, searchQuery]);

  // Create new note
  const handleCreateNote = () => {
    sound.playClick();
    const newNote: IdeaNote = {
      id: `note-${Date.now()}`,
      title: '💡 New Coding Idea',
      content: '',
      category: selectedCategory === 'all' ? 'idea' : selectedCategory,
      tags: [],
      pinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  };

  // Update active note fields
  const handleUpdateActiveNote = (updates: Partial<IdeaNote>) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === activeNote?.id
          ? {
              ...note,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    );
  };

  // Toggle pin
  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    setNotes(prev =>
      prev.map(note => (note.id === id ? { ...note, pinned: !note.pinned } : note))
    );
  };

  // Delete note
  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    if (notes.length <= 1) {
      // Keep at least one empty note
      const freshNote: IdeaNote = {
        id: `note-${Date.now()}`,
        title: 'Untitled Idea',
        content: '',
        category: 'idea',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes([freshNote]);
      setActiveNoteId(freshNote.id);
      return;
    }
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeNoteId === id) {
      const remaining = notes.filter(n => n.id !== id);
      setActiveNoteId(remaining[0]?.id || '');
    }
  };

  // Add tag
  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (!trimmed || !activeNote) return;
    if (!activeNote.tags.includes(trimmed)) {
      handleUpdateActiveNote({ tags: [...activeNote.tags, trimmed] });
    }
    setTagInput('');
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove: string) => {
    if (!activeNote) return;
    handleUpdateActiveNote({
      tags: activeNote.tags.filter(t => t !== tagToRemove),
    });
  };

  // Copy Note
  const handleCopyNote = () => {
    if (!activeNote) return;
    sound.playClick();
    const text = `# ${activeNote.title}\n\n${activeNote.content}\n\n${
      activeNote.codeSnippet
        ? `\`\`\`${activeNote.codeLanguage || ''}\n${activeNote.codeSnippet}\n\`\`\``
        : ''
    }`;
    navigator.clipboard.writeText(text);
    setCopiedId(activeNote.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Export all notes
  const handleExportAll = () => {
    sound.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(notes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `coderbhai_ideas_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Run in CodeZone
  const handleSendToCodeZone = () => {
    sound.playSuccess();
    const lang = (activeNote?.codeLanguage as CodeLanguage) || 'c';
    const code = activeNote?.codeSnippet || activeNote?.content || '';
    onClose();
    onOpenCodeZone(code, lang);
  };

  const categoryBadges: Record<string, { label: string; color: string; icon: string }> = {
    idea: { label: '💡 Idea', color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30', icon: '💡' },
    dsa: { label: '🧠 DSA Note', color: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30', icon: '🧠' },
    bug: { label: '🐛 Bug Fix', color: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30', icon: '🐛' },
    snippet: { label: '⚡ Snippet', color: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30', icon: '⚡' },
    general: { label: '📝 Note', color: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30', icon: '📝' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md animate-fade">
      <div className="w-full max-w-5xl h-[92vh] max-h-[850px] bg-white dark:bg-[#0D131F] border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-slate-100">
        {/* Top Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-[#111827]/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0 shadow-inner">
              <Lightbulb className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                  IdeaZone
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    Notepad & Vault
                  </span>
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Jot down project concepts, debugging discoveries, and algorithm tricks. Auto-saved locally!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCreateNote}
              className="btn-3d btn-3d-gold px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md text-amber-950"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">New Idea</span>
            </button>

            <button
              type="button"
              onClick={handleExportAll}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Export all ideas to JSON"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close IdeaZone"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills & Search */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0E1524] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {(['all', 'idea', 'dsa', 'bug', 'snippet', 'general'] as IdeaCategory[]).map(cat => {
              const isSelected = selectedCategory === cat;
              const labels: Record<string, string> = {
                all: 'All',
                idea: '💡 Ideas',
                dsa: '🧠 DSA Notes',
                bug: '🐛 Bugs',
                snippet: '⚡ Snippets',
                general: '📝 General',
              };
              const count = cat === 'all' ? notes.length : notes.filter(n => n.category === cat).length;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedCategory(cat);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500 text-amber-950 shadow-md font-extrabold'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold'
                  }`}
                >
                  <span>{labels[cat]}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-amber-950/20 text-amber-950' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-56 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search ideas or #tags..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:border-amber-500 font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Main Split Layout: Left Notes List + Right Active Note Editor */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Notes List Sidebar */}
          <div className="w-full md:w-80 border-r-0 md:border-r border-b md:border-b-0 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0B101C] overflow-y-auto shrink-0 max-h-48 md:max-h-none p-2 space-y-1.5">
            {filteredNotes.length === 0 ? (
              <div className="p-6 text-center text-slate-400 flex flex-col items-center gap-2">
                <FileText className="w-8 h-8 opacity-40" />
                <span className="text-xs font-bold">No matching ideas found</span>
                <button
                  type="button"
                  onClick={handleCreateNote}
                  className="text-xs text-amber-500 font-black hover:underline cursor-pointer"
                >
                  Create one now!
                </button>
              </div>
            ) : (
              filteredNotes.map(note => {
                const isActive = note.id === activeNote?.id;
                const badge = categoryBadges[note.category] || categoryBadges.idea;

                return (
                  <div
                    key={note.id}
                    onClick={() => {
                      sound.playClick();
                      setActiveNoteId(note.id);
                    }}
                    className={`p-3 rounded-2xl transition-all cursor-pointer border text-left relative group ${
                      isActive
                        ? 'bg-white dark:bg-[#162032] border-amber-500/50 dark:border-amber-500/40 shadow-md ring-2 ring-amber-500/10'
                        : 'bg-white/80 dark:bg-[#101726]/80 border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-[#131C2D]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${badge.color}`}
                      >
                        {badge.label}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={e => handleTogglePin(note.id, e)}
                          className={`p-1 rounded-md transition-colors ${
                            note.pinned
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-slate-300 dark:text-slate-600 hover:text-slate-500'
                          }`}
                          title={note.pinned ? 'Unpin' : 'Pin to top'}
                        >
                          <Pin className={`w-3.5 h-3.5 ${note.pinned ? 'fill-current' : ''}`} />
                        </button>

                        <button
                          type="button"
                          onClick={e => handleDeleteNote(note.id, e)}
                          className="p-1 rounded-md text-slate-300 dark:text-slate-600 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 line-clamp-1">
                      {note.title || 'Untitled Note'}
                    </h4>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 font-medium leading-relaxed">
                      {note.content || (note.codeSnippet ? '// Code snippet attached' : 'Empty note...')}
                    </p>

                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {note.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="text-[9px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Active Note Editor Panel */}
          {activeNote ? (
            <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* Note Top Bar: Title & Category & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={e => handleUpdateActiveNote({ title: e.target.value })}
                  placeholder="Note Title..."
                  className="text-lg sm:text-xl font-black bg-transparent border-none focus:outline-none text-slate-900 dark:text-white placeholder-slate-400 w-full"
                />

                <div className="flex items-center gap-2 shrink-0">
                  {/* Category Picker */}
                  <select
                    value={activeNote.category}
                    onChange={e =>
                      handleUpdateActiveNote({
                        category: e.target.value as IdeaNote['category'],
                      })
                    }
                    className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="idea">💡 Project Idea</option>
                    <option value="dsa">🧠 DSA Note</option>
                    <option value="bug">🐛 Bug Fix</option>
                    <option value="snippet">⚡ Code Snippet</option>
                    <option value="general">📝 General Note</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleCopyNote}
                    className="p-2 rounded-xl text-xs font-black bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1 transition-all"
                    title="Copy note markdown"
                  >
                    {copiedId === activeNote.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">
                      {copiedId === activeNote.id ? 'Copied!' : 'Copy'}
                    </span>
                  </button>

                  {/* Send to CodeZone Button */}
                  <button
                    type="button"
                    onClick={handleSendToCodeZone}
                    className="btn-3d btn-3d-green px-3 py-1.5 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 text-white cursor-pointer shadow-sm"
                    title="Open this code in the live CodeZone runner"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span className="hidden sm:inline">Run in CodeZone</span>
                  </button>
                </div>
              </div>

              {/* Tags Section */}
              <div className="flex items-center flex-wrap gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {activeNote.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs font-bold px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-rose-500 ml-0.5 cursor-pointer text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <div className="flex items-center">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="+ Add #tag and press Enter"
                    className="text-xs bg-transparent border-none focus:outline-none text-slate-600 dark:text-slate-300 placeholder-slate-400 w-36 px-1"
                  />
                </div>
              </div>

              {/* Main Content Area */}
              <textarea
                value={activeNote.content}
                onChange={e => handleUpdateActiveNote({ content: e.target.value })}
                placeholder="Write down your thoughts, mental models, interview tips, or project plans here..."
                rows={6}
                className="w-full bg-slate-50/50 dark:bg-[#121929]/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 resize-none leading-relaxed"
              />

              {/* Attached Code Snippet Box */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#0A0E17] text-slate-200 overflow-hidden shadow-inner flex flex-col">
                <div className="px-3.5 py-2 border-b border-slate-800 bg-[#101624] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-brand-green" />
                    <span className="font-bold text-slate-300">Code Snippet</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={activeNote.codeLanguage || 'c'}
                      onChange={e =>
                        handleUpdateActiveNote({ codeLanguage: e.target.value })
                      }
                      className="bg-slate-800 text-slate-300 rounded-lg px-2 py-0.5 text-xs font-mono border border-slate-700 focus:outline-none cursor-pointer"
                    >
                      <option value="c">Pure C</option>
                      <option value="cpp">Modern C++</option>
                      <option value="python">Python</option>
                      <option value="javascript">JavaScript</option>
                    </select>

                    <button
                      type="button"
                      onClick={handleSendToCodeZone}
                      className="text-[11px] font-black text-brand-green hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Test in Runner
                    </button>
                  </div>
                </div>

                <textarea
                  value={activeNote.codeSnippet || ''}
                  onChange={e => handleUpdateActiveNote({ codeSnippet: e.target.value })}
                  placeholder="// Paste or write C / C++ / Python code here to test in CodeZone..."
                  rows={8}
                  className="w-full bg-transparent p-3.5 font-mono text-xs sm:text-sm text-emerald-300 placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
                  spellCheck={false}
                />
              </div>

              {/* Status Footer */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 font-medium">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    Updated {new Date(activeNote.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isSavedRecently && (
                    <span className="text-emerald-500 font-bold ml-1 animate-pulse flex items-center gap-1">
                      <Check className="w-3 h-3" /> Saved to browser
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-slate-500">
                  <CatFace size="xs" mood="happy" />
                  <span>Bhai: "Ideas become code!"</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <Lightbulb className="w-12 h-12 text-amber-500/40 mb-2" />
              <h3 className="text-sm font-black text-slate-700 dark:text-slate-300">
                No note selected
              </h3>
              <p className="text-xs mt-1">Select an idea from the left or create a new one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
