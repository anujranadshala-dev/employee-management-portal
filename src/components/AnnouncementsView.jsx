/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Megaphone, Bell, Plus, Calendar, User, FileText, CheckCircle2 } from 'lucide-react';

export default function AnnouncementsView({ announcements, userRole, onPostAnnouncement }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [important, setImportant] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert('Please fill out all announcement fields');
      return;
    }

    setIsSubmitting(true);
    await onPostAnnouncement({ title, content, important });
    setIsSubmitting(false);

    setTitle('');
    setContent('');
    setImportant(false);
    setPostSuccess(true);
    setTimeout(() => setPostSuccess(false), 3000);
  };

  return (
    <div className="space-y-6" id="announcements-root">
      
      {/* Header section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-indigo-500" />
            Corporate Communications
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Broadcast department-wide memos, policy updates, and critical team notifications.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Post announcement (Admin only) */}
        {userRole === 'Admin' ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <Plus className="h-4 w-4 text-slate-500" />
              Publish Memo
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Announcement Title *</label>
                <input
                  id="ann-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q3 Benefits Renewal Program"
                  className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Memo Content *</label>
                <textarea
                  id="ann-content"
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Detail the update fully here..."
                  className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  required
                />
              </div>

              {/* Checkbox for priority */}
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase cursor-pointer py-1 select-none">
                <input
                  id="ann-important"
                  type="checkbox"
                  checked={important}
                  onChange={(e) => setImportant(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                />
                <span className="text-rose-600 flex items-center gap-1 font-bold">
                  Mark as High-Priority Critical Update
                </span>
              </label>

              {postSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                  <span className="font-semibold text-[11px]">Announcement published successfully!</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                id="btn-post-announcement"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Megaphone className="h-3.5 w-3.5" />
                {isSubmitting ? 'Publishing memo...' : 'Publish Announcement'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-center">
            <Bell className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-900 text-sm">Read-Only Memos</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Employees can read announcements. Only admins can publish new company memos.
            </p>
          </div>
        )}

        {/* Announcements display (Right column) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
            <Bell className="h-4 w-4 text-slate-500" />
            Company News & Bulletins ({announcements.length})
          </h3>

          <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
            {announcements.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                No bulletins published yet.
              </div>
            ) : (
              announcements.map(ann => (
                <div 
                  key={ann.id} 
                  id={`ann-bulletin-${ann.id}`}
                  className={`p-5 rounded-xl border transition-colors ${
                    ann.important 
                      ? 'bg-rose-500/5 border-rose-200 hover:border-rose-300' 
                      : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="space-y-2.5">
                    
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {ann.important && (
                            <span className="text-[9px] font-bold font-mono tracking-wider uppercase bg-rose-600 text-white px-2 py-0.5 rounded-full shrink-0">
                              Urgent
                            </span>
                          )}
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">
                            {ann.title}
                          </h4>
                        </div>

                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                          <span className="flex items-center gap-1 font-mono">
                            <Calendar className="h-3 w-3" /> {ann.date}
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            <User className="h-3 w-3" /> By: {ann.author}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed bg-white/70 backdrop-blur-xs p-3.5 rounded-lg border border-slate-200/50 flex items-start gap-2">
                      <FileText className="h-4.5 w-4.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{ann.content}</span>
                    </p>

                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
