'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import type { ContactMessage } from '@/lib/portfolio-types';
import {
  Inbox,
  Mail,
  Trash2,
  CheckCircle,
  Archive,
  Reply,
  Calendar,
  Search,
  Filter,
  Eye,
  AlertCircle,
} from 'lucide-react';

interface MessagesTabProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export function MessagesTab({ showToast }: MessagesTabProps) {
  const { messages, updateMessageStatus, deleteMessage } = usePortfolio();

  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const filteredMessages = messages.filter((m) => {
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.subject && m.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSelectMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status === 'new') {
      try {
        await updateMessageStatus(msg.id, 'read');
      } catch (e) {
        // silent
      }
    }
  };

  const handleToggleStatus = async (id: string, newStatus: 'new' | 'read' | 'archived') => {
    try {
      await updateMessageStatus(id, newStatus);
      showToast(`Message marked as ${newStatus}`, 'success');
      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this inquiry permanently?')) return;
    try {
      await deleteMessage(id);
      showToast('Message deleted', 'success');
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (err: any) {
      showToast('Failed to delete message', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#1F2937] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#E0E7FF]">Contact Inquiries & Messages</h2>
          <p className="text-xs text-[#94A3B8]">
            Review, reply, and manage direct messages received through the public portfolio contact form.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            {messages.filter((m) => m.status === 'new').length} New
          </span>
          <span>•</span>
          <span>{messages.length} Total</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5">
          {(['all', 'new', 'read', 'archived'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium capitalize transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-[#111827] text-[#94A3B8] hover:bg-[#1F2937]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#64748B]">
            <Search className="h-3.5 w-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inquiries..."
            className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] pl-9 pr-3 py-1.5 text-xs text-[#E0E7FF] placeholder-[#475569] focus:border-[#60A5FA] focus:outline-none"
          />
        </div>
      </div>

      {/* Messages Layout: Master & Detail */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr] items-start">
        {/* List of Messages */}
        <div className="space-y-2.5">
          {filteredMessages.map((msg) => {
            const isSelected = selectedMessage?.id === msg.id;
            return (
              <div
                key={msg.id}
                onClick={() => handleSelectMessage(msg)}
                className={`relative rounded-2xl border p-4 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#60A5FA] bg-[#1E293B]/80 shadow-[0_0_15px_rgba(96,165,250,0.15)]'
                    : 'border-[#1F2937] bg-[#111827]/70 hover:border-[#60A5FA]/40 hover:bg-[#111827]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    {msg.status === 'new' && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-red-400" />
                    )}
                    <span className="text-xs font-semibold text-[#E0E7FF] truncate">
                      {msg.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#64748B] shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="mt-1 text-xs text-[#60A5FA] truncate">
                  {msg.subject || 'Portfolio Inquiry'}
                </p>

                <p className="mt-1 text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                  {msg.message}
                </p>

                <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#64748B] border-t border-[#1F2937]/50 pt-2">
                  <span className="truncate">{msg.email}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded capitalize ${
                      msg.status === 'new'
                        ? 'bg-red-500/20 text-red-400'
                        : msg.status === 'read'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-[#1F2937] text-[#94A3B8]'
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredMessages.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#1F2937] p-8 text-center text-xs text-[#64748B]">
              <Inbox className="h-8 w-8 text-[#334155] mx-auto mb-2" />
              <span>No inquiries found in this view.</span>
            </div>
          )}
        </div>

        {/* Selected Message Detail Panel */}
        <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/90 p-6 backdrop-blur-xl min-h-[400px]">
          {selectedMessage ? (
            <div className="space-y-6">
              {/* Top Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1F2937] pb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      selectedMessage.status === 'new'
                        ? 'bg-red-500/20 text-red-400'
                        : selectedMessage.status === 'read'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-[#1F2937] text-[#94A3B8]'
                    }`}
                  >
                    {selectedMessage.status}
                  </span>
                  <span className="text-xs text-[#64748B]">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {selectedMessage.status !== 'read' && (
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(selectedMessage.id, 'read')}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#1F2937] bg-[#0B132B] px-2.5 py-1 text-[11px] text-[#CBD5E1] hover:text-[#60A5FA] cursor-pointer"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Mark Read</span>
                    </button>
                  )}
                  {selectedMessage.status !== 'new' && (
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(selectedMessage.id, 'new')}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#1F2937] bg-[#0B132B] px-2.5 py-1 text-[11px] text-[#CBD5E1] hover:text-[#60A5FA] cursor-pointer"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>Mark Unread</span>
                    </button>
                  )}
                  {selectedMessage.status !== 'archived' && (
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(selectedMessage.id, 'archived')}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#1F2937] bg-[#0B132B] px-2.5 py-1 text-[11px] text-[#CBD5E1] hover:text-amber-400 cursor-pointer"
                    >
                      <Archive className="h-3.5 w-3.5" />
                      <span>Archive</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-1.5 text-[#64748B] hover:text-red-400 cursor-pointer"
                    title="Delete permanently"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Sender info */}
              <div>
                <h3 className="text-base font-bold text-[#E0E7FF]">{selectedMessage.name}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#94A3B8]">
                  <span>Email: <a href={`mailto:${selectedMessage.email}`} className="text-[#60A5FA] hover:underline">{selectedMessage.email}</a></span>
                  {selectedMessage.phone && <span>Phone: {selectedMessage.phone}</span>}
                </div>
              </div>

              {/* Subject */}
              <div className="rounded-xl border border-[#1F2937] bg-[#0B132B] p-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] block mb-0.5">
                  Subject Line
                </span>
                <p className="text-xs font-semibold text-[#E0E7FF]">
                  {selectedMessage.subject || 'Portfolio Inquiry'}
                </p>
              </div>

              {/* Message Body */}
              <div className="rounded-xl border border-[#1F2937] bg-[#0B132B] p-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] block mb-2">
                  Message Content
                </span>
                <p className="text-xs leading-relaxed text-[#CBD5E1] whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              {/* Direct Reply Button */}
              <div className="pt-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                    `Re: ${selectedMessage.subject || 'Portfolio Inquiry'}`
                  )}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1D4ED8] transition-all"
                >
                  <Reply className="h-4 w-4" />
                  <span>Reply via Email Client</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[350px] text-center text-xs text-[#64748B]">
              <Mail className="h-10 w-10 text-[#334155] mb-3" />
              <p className="font-medium text-[#94A3B8]">Select a message to view details</p>
              <p className="text-[11px] text-[#64748B] mt-1">
                Choose an inquiry from the list on the left to read full contents and reply.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
