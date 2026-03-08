'use client';

import React, { useState } from 'react';
import { Pencil, Trash2, Plus, Save, X, FileText } from 'lucide-react';
import { format } from 'date-fns';

type Note = {
  id: string;
  text: string;
  lastEdited: Date;
};

export default function AdminNotesCard() {
  // EXPLICIT EXCEPTION: 
  // Per the design spec, the Dashboard is strictly read-only. 
  // This Admin Notes widget is the ONLY explicit exception to that rule,
  // allowed here for quick, persistent operational jotting.

  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      text: 'Follow up with maintenance about HVAC issue in Studio 2 before the evening classes.',
      lastEdited: new Date(Date.now() - 3600000 * 24),
    }
  ]);
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftText, setDraftText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = () => {
    if (!draftText.trim()) return;

    if (editingId) {
      setNotes(notes.map(n => n.id === editingId ? { ...n, text: draftText, lastEdited: new Date() } : n));
      setEditingId(null);
    } else {
      const newNote: Note = {
        id: Math.random().toString(36).substring(7),
        text: draftText,
        lastEdited: new Date(),
      };
      setNotes([newNote, ...notes]);
    }

    setDraftText('');
    setIsDrafting(false);
  };

  const handleEdit = (note: Note) => {
    setDraftText(note.text);
    setEditingId(note.id);
    setIsDrafting(true);
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const handleCancel = () => {
    setDraftText('');
    setEditingId(null);
    setIsDrafting(false);
  };

  return (
    <div className="bg-gradient-to-b from-[#1a2030] to-[#161b27] border border-[#1e2a3a] rounded-2xl p-5 flex flex-col h-[380px] shadow-lg shadow-black/20">
      <div className="flex justify-between items-start mb-5 shrink-0">
        <h3 className="font-bold text-slate-200 flex items-center gap-2">
          <div className="bg-indigo-500/20 p-1.5 rounded-lg text-indigo-400">
            <FileText size={16} />
          </div>
          Admin Notes
        </h3>
        {!isDrafting && (
          <button
            onClick={() => setIsDrafting(true)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 transition-colors text-[10px] font-bold uppercase tracking-wider"
          >
            <Plus size={12} /> New Note
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
        {isDrafting && (
          <div className="bg-[#0d1117] border border-indigo-500/30 rounded-lg p-3 shrink-0">
            <textarea
              autoFocus
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              placeholder="Draft a new note..."
              className="w-full bg-transparent border-none text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none resize-none min-h-[80px]"
            />
            <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-[#1e2a3a]">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-[#1e2a3a] text-xs font-bold transition-colors flex items-center gap-1"
              >
                <X size={14} /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!draftText.trim()}
                className="px-3 py-1.5 rounded-md bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Save size={14} /> Save
              </button>
            </div>
          </div>
        )}

        {notes.length === 0 && !isDrafting ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-3 min-h-[120px] bg-[#0d1117]/50 rounded-xl border border-dashed border-[#1e2a3a]">
            <div className="w-12 h-12 rounded-full bg-[#1e2a3a]/50 flex items-center justify-center mb-1">
              <Pencil size={20} className="text-slate-600" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">No active notes</p>
          </div>
        ) : (
          notes.map(note => (
            <div key={note.id} className="bg-[#0d1117] border border-[#1e2a3a] hover:border-indigo-500/30 rounded-xl p-4 group transition-all shrink-0 hover:shadow-md hover:shadow-indigo-500/5 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-sm text-slate-300 leading-relaxed mb-4 break-words pl-1">{note.text}</p>

              <div className="flex justify-between items-center mt-auto border-t border-[#1e2a3a] pt-3">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pl-1">
                  {format(note.lastEdited, 'MMM d, h:mm a')}
                </span>
                <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(note)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
