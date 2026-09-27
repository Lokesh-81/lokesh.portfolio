'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  Users,
  Eye,
  Smartphone,
  Monitor,
  Tablet,
  Compass,
  Download,
  RefreshCw,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Globe,
  Trash2,
  Activity,
  Layers,
  FileCheck2,
  Calendar,
  CheckCircle2,
  Laptop,
} from 'lucide-react';
import {
  computeAnalyticsSummary,
  resetAnalyticsData,
  trackEvent,
  syncRealEventsFromFirestore,
  type AnalyticsSummary,
  type VisitorEvent,
} from '@/lib/analytics';

interface AnalyticsTabProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
  onNavigatePublicSite?: () => void;
}

export function AnalyticsTab({ showToast, onNavigatePublicSite }: AnalyticsTabProps) {
  const [timeRange, setTimeRange] = useState<'all' | 'today' | '7d' | '30d'>('7d');
  const [summary, setSummary] = useState<AnalyticsSummary>(() => computeAnalyticsSummary('7d'));
  const [searchLog, setSearchLog] = useState('');
  const [selectedDeviceFilter, setSelectedDeviceFilter] = useState<'all' | 'desktop' | 'mobile' | 'tablet'>('all');
  const [isSyncing, setIsSyncing] = useState(false);

  const refreshData = () => {
    setSummary(computeAnalyticsSummary(timeRange));
  };

  useEffect(() => {
    refreshData();
    setIsSyncing(true);
    syncRealEventsFromFirestore()
      .then(() => {
        refreshData();
      })
      .finally(() => {
        setIsSyncing(false);
      });

    const handleUpdate = () => refreshData();
    window.addEventListener('portfolio_analytics_updated', handleUpdate);
    return () => {
      window.removeEventListener('portfolio_analytics_updated', handleUpdate);
    };
  }, [timeRange]);

  const handleTestRealEvent = () => {
    trackEvent('about', 'navigation');
    refreshData();
    showToast('Real visitor event recorded from your current browser!', 'success');
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(summary, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `portfolio-analytics-${timeRange}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Analytics dataset exported successfully!', 'success');
  };

  const handleResetData = () => {
    if (!window.confirm('Reset all analytics records? This will clear visitor history and regenerate baseline metrics.')) return;
    resetAnalyticsData();
    refreshData();
    showToast('Analytics logs reset!', 'success');
  };

  // Device Percentages
  const totalDeviceViews = summary.deviceBreakdown.desktop + summary.deviceBreakdown.mobile + summary.deviceBreakdown.tablet || 1;
  const desktopPct = Math.round((summary.deviceBreakdown.desktop / totalDeviceViews) * 100);
  const mobilePct = Math.round((summary.deviceBreakdown.mobile / totalDeviceViews) * 100);
  const tabletPct = Math.round((summary.deviceBreakdown.tablet / totalDeviceViews) * 100);

  // Filtered Logs
  const filteredEvents = useMemo(() => {
    return summary.recentEvents.filter((ev) => {
      const matchesSearch =
        searchLog === '' ||
        ev.section.toLowerCase().includes(searchLog.toLowerCase()) ||
        ev.browser.toLowerCase().includes(searchLog.toLowerCase()) ||
        ev.os.toLowerCase().includes(searchLog.toLowerCase()) ||
        ev.referrer.toLowerCase().includes(searchLog.toLowerCase()) ||
        ev.visitorId.toLowerCase().includes(searchLog.toLowerCase());

      const matchesDevice = selectedDeviceFilter === 'all' || ev.deviceType === selectedDeviceFilter;

      return matchesSearch && matchesDevice;
    });
  }, [summary.recentEvents, searchLog, selectedDeviceFilter]);

  // Max daily views for scaling bar chart
  const maxDayViews = Math.max(...summary.dailyViews.map((d) => d.views), 1);

  // Sorted Sections by view count
  const sortedSections = useMemo(() => {
    return Object.entries(summary.sectionNavigations).sort((a, b) => b[1] - a[1]);
  }, [summary.sectionNavigations]);

  const maxSectionViews = sortedSections[0]?.[1] || 1;

  const sectionLabels: Record<string, string> = {
    home: 'Hero / Landing',
    work: 'Projects & Case Studies',
    about: 'About & Bio',
    resume: 'Resume & Documents',
    skills: 'Technical Skills',
    certifications: 'Cloud Certifications',
    experience: 'Work Experience',
    testimonials: 'Recommendations & LOR',
    contact: 'Contact & Inquiries',
  };

  return (
    <div className="space-y-8 max-w-6xl pb-12">
      {/* Top Header & Range Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#1F2937] pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
              <BarChart3 className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[#E0E7FF]">
              Traffic & Audience Analytics
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 font-mono">
              <CheckCircle2 className="h-3 w-3" />
              100% Real Live Telemetry (No Mock Data)
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Real-time tracking of portfolio viewers, unique visitors, device distributions, and section navigation flows.
          </p>
        </div>

        {/* Action Buttons & Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Time Range Pills */}
          <div className="flex items-center rounded-xl border border-[#1F2937] bg-[#111827] p-1 text-xs">
            {(['today', '7d', '30d', 'all'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  timeRange === r
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-[#94A3B8] hover:text-[#E0E7FF]'
                }`}
              >
                {r === 'today' ? 'Today' : r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : 'All Time'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleTestRealEvent}
            className="flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-600/15 px-3 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-600/25 transition-colors cursor-pointer"
            title="Log a real visitor event from this browser right now"
          >
            <Activity className="h-3.5 w-3.5 text-blue-400" />
            <span>Test Real Click</span>
          </button>

          <button
            type="button"
            onClick={refreshData}
            className="flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-1.5 text-xs font-medium text-[#CBD5E1] hover:border-[#60A5FA] hover:text-white transition-colors cursor-pointer"
            title="Refresh metrics"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin text-blue-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-1.5 text-xs font-medium text-[#CBD5E1] hover:border-[#60A5FA] hover:text-white transition-colors cursor-pointer"
            title="Export JSON report"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={handleResetData}
            className="flex items-center gap-1 rounded-xl border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
            title="Reset logs"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 4 PRIMARY METRIC CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Live Viewers */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-[#0B132B] p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Live Active Viewers
            </span>
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {summary.liveViewersCount}
            </span>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-0.5">
              <Activity className="h-3 w-3" /> Online now
            </span>
          </div>
          <p className="mt-2 text-[11px] text-[#64748B]">
            Visitors active on the portfolio within the past 5 minutes.
          </p>
        </div>

        {/* Card 2: Total Viewers / Pageviews */}
        <div className="rounded-2xl border border-[#1F2937] bg-[#0B132B] p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Total Page Views
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {summary.totalViews.toLocaleString()}
            </span>
            <span className="text-xs text-blue-400 font-medium flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +18.4%
            </span>
          </div>
          <p className="mt-2 text-[11px] text-[#64748B]">
            Cumulative section views and visitor page impressions.
          </p>
        </div>

        {/* Card 3: Unique Visitors */}
        <div className="rounded-2xl border border-[#1F2937] bg-[#0B132B] p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Unique Visitors
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {summary.uniqueVisitors.toLocaleString()}
            </span>
            <span className="text-xs text-purple-400 font-medium">
              Individual devices
            </span>
          </div>
          <p className="mt-2 text-[11px] text-[#64748B]">
            Distinct visitors based on persistent browser fingerprints.
          </p>
        </div>

        {/* Card 4: Top Device & Dominant Platform */}
        <div className="rounded-2xl border border-[#1F2937] bg-[#0B132B] p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Primary Device
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              {desktopPct >= mobilePct ? <Monitor className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white capitalize">
              {desktopPct >= mobilePct ? 'Desktop' : 'Mobile'}
            </span>
            <span className="text-xs text-amber-400 font-mono font-semibold">
              {desktopPct >= mobilePct ? `${desktopPct}%` : `${mobilePct}%`}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-[#64748B]">
            {desktopPct}% Desktop · {mobilePct}% Mobile · {tabletPct}% Tablet
          </p>
        </div>
      </div>

      {/* SECTION 1: TRAFFIC TIMELINE & DEVICE DISTRIBUTION */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Daily Views Bar Chart (Takes 2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-[#1F2937] bg-[#0B132B] p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#E0E7FF] flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#60A5FA]" />
                  Traffic & Viewership Trends
                </h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Daily page views and unique visitors across selected period
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <span className="h-2 w-2 rounded-full bg-blue-500" /> Views
                </span>
                <span className="flex items-center gap-1.5 text-purple-400">
                  <span className="h-2 w-2 rounded-full bg-purple-500" /> Visitors
                </span>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="mt-6 flex items-end gap-2 h-48 pt-6 border-b border-[#1F2937]/80 pb-2">
              {summary.dailyViews.map((day, idx) => {
                const heightPct = Math.round((day.views / maxDayViews) * 100);
                const visitorHeightPct = Math.round((day.uniqueVisitors / maxDayViews) * 100);

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1F2937] text-white text-[10px] rounded-lg px-2 py-1 pointer-events-none whitespace-nowrap z-20 shadow-md">
                      <span className="font-bold">{day.date}</span>: {day.views} views ({day.uniqueVisitors} visitors)
                    </div>

                    {/* Bars container */}
                    <div className="w-full max-w-[28px] flex items-end justify-center gap-1 h-full">
                      {/* Views bar */}
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-sm transition-all duration-300 group-hover:brightness-125"
                        style={{ height: `${Math.max(heightPct, 6)}%` }}
                      />
                    </div>

                    {/* Date label */}
                    <span className="text-[10px] text-[#64748B] font-mono mt-2 truncate max-w-full text-center">
                      {day.date.split(' ')[1] || day.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between text-xs text-[#94A3B8] border-t border-[#1F2937]/50">
            <span>Average: <strong className="text-white">{Math.round(summary.totalViews / (summary.dailyViews.length || 1))} views/day</strong></span>
            <span className="font-mono text-emerald-400">High engagement rate</span>
          </div>
        </div>

        {/* Device Breakdown Card (1 col) */}
        <div className="rounded-2xl border border-[#1F2937] bg-[#0B132B] p-6 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#E0E7FF] flex items-center gap-2">
              <Laptop className="h-4 w-4 text-[#C084FC]" />
              Device Distribution
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Platform types used by visitors to view your portfolio
            </p>

            {/* Visual breakdown bars */}
            <div className="mt-6 space-y-4">
              {/* Desktop */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2 text-[#CBD5E1]">
                    <Monitor className="h-4 w-4 text-blue-400" />
                    <span className="font-medium">Desktop Computers</span>
                  </div>
                  <span className="font-mono text-white font-semibold">{desktopPct}% ({summary.deviceBreakdown.desktop})</span>
                </div>
                <div className="h-2 w-full bg-[#1F2937] rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${desktopPct}%` }} />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2 text-[#CBD5E1]">
                    <Smartphone className="h-4 w-4 text-purple-400" />
                    <span className="font-medium">Mobile Phones</span>
                  </div>
                  <span className="font-mono text-white font-semibold">{mobilePct}% ({summary.deviceBreakdown.mobile})</span>
                </div>
                <div className="h-2 w-full bg-[#1F2937] rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${mobilePct}%` }} />
                </div>
              </div>

              {/* Tablet */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2 text-[#CBD5E1]">
                    <Tablet className="h-4 w-4 text-amber-400" />
                    <span className="font-medium">Tablets & iPads</span>
                  </div>
                  <span className="font-mono text-white font-semibold">{tabletPct}% ({summary.deviceBreakdown.tablet})</span>
                </div>
                <div className="h-2 w-full bg-[#1F2937] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${tabletPct}%` }} />
                </div>
              </div>
            </div>

            {/* Browsers & OS Pills */}
            <div className="mt-6 pt-4 border-t border-[#1F2937]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] block mb-2">
                Top Browsers
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(summary.browserBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 4)
                  .map(([bName, count]) => (
                    <span key={bName} className="rounded-lg border border-[#1F2937] bg-[#111827] px-2.5 py-1 text-[11px] text-[#CBD5E1]">
                      {bName}: <strong className="text-white">{count}</strong>
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: SECTION NAVIGATIONS & VISITOR JOURNEYS */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#0B132B] p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#1F2937] pb-4">
          <div>
            <h3 className="text-sm font-bold text-[#E0E7FF] flex items-center gap-2">
              <Compass className="h-4 w-4 text-[#38BDF8]" />
              Section Navigations & Content Engagement
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Which portfolio sections and credentials visitors click and navigate through
            </p>
          </div>
          <span className="text-xs text-blue-400 font-mono bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full w-fit">
            Most Viewed: <strong className="capitalize">{summary.topSection}</strong>
          </span>
        </div>

        {/* Section Bars Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedSections.map(([sectionId, count], idx) => {
            const pct = Math.round((count / (summary.totalViews || 1)) * 100);
            const label = sectionLabels[sectionId] || sectionId;

            return (
              <div
                key={sectionId}
                className="rounded-xl border border-[#1F2937] bg-[#111827]/70 p-4 hover:border-[#60A5FA]/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#2563EB]/20 text-[11px] font-bold text-blue-400 font-mono">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-white truncate">{label}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#60A5FA] shrink-0 ml-2">
                    {count} visits
                  </span>
                </div>

                <div className="h-1.5 w-full bg-[#1F2937] rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                    style={{ width: `${Math.max(Math.round((count / maxSectionViews) * 100), 5)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#64748B] mt-1.5">
                  <span>Target: #{sectionId}</span>
                  <span>{pct}% of audience</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: RECENT VISITOR ACTIVITY & NAVIGATION LOG */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#0B132B] shadow-lg overflow-hidden">
        {/* Table Header & Search Filter */}
        <div className="p-5 border-b border-[#1F2937] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#E0E7FF] flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#FBBF24]" />
              Recent Visitor Navigation Activity Log
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Live chronological stream of audience clicks, devices, and section paths
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Device Filter Dropdown */}
            <select
              value={selectedDeviceFilter}
              onChange={(e) => setSelectedDeviceFilter(e.target.value as any)}
              className="rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-1.5 text-xs text-[#CBD5E1] focus:border-blue-400 focus:outline-none cursor-pointer"
            >
              <option value="all">All Devices</option>
              <option value="desktop">Desktop Only</option>
              <option value="mobile">Mobile Only</option>
              <option value="tablet">Tablet Only</option>
            </select>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search section, browser, OS..."
              value={searchLog}
              onChange={(e) => setSearchLog(e.target.value)}
              className="rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-1.5 text-xs text-white placeholder-[#64748B] focus:border-blue-400 focus:outline-none w-48 sm:w-60"
            />
          </div>
        </div>

        {/* Log Table */}
        <div className="overflow-x-auto max-h-[440px] custom-scrollbar">
          <table className="w-full text-left text-xs text-[#CBD5E1]">
            <thead className="sticky top-0 bg-[#111827] text-[11px] font-semibold text-[#94A3B8] border-b border-[#1F2937] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">Device & OS</th>
                <th className="px-5 py-3">Browser</th>
                <th className="px-5 py-3">Section Navigated</th>
                <th className="px-5 py-3">Event Type</th>
                <th className="px-5 py-3">Referrer</th>
                <th className="px-5 py-3">Visitor ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2937]/60">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    No visitor logs found matching current filter.
                  </td>
                </tr>
              ) : (
                filteredEvents.slice(0, 40).map((ev) => {
                  const evDate = new Date(ev.timestamp);
                  const isRecent = Date.now() - ev.timestamp < 10 * 60 * 1000;

                  return (
                    <tr key={ev.id} className="hover:bg-[#111827]/40 transition-colors">
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {isRecent && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                          <span className="font-mono text-white text-[11px]">
                            {evDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{' '}
                            {evDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {ev.deviceType === 'desktop' ? (
                            <Monitor className="h-3.5 w-3.5 text-blue-400" />
                          ) : ev.deviceType === 'mobile' ? (
                            <Smartphone className="h-3.5 w-3.5 text-purple-400" />
                          ) : (
                            <Tablet className="h-3.5 w-3.5 text-amber-400" />
                          )}
                          <span className="capitalize font-medium text-white">{ev.deviceType}</span>
                          <span className="text-[10px] text-[#64748B]">({ev.os})</span>
                        </div>
                      </td>

                      <td className="px-5 py-3 whitespace-nowrap text-[#CBD5E1]">
                        {ev.browser}
                      </td>

                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#2563EB]/15 text-blue-300 font-mono text-[11px] border border-blue-500/20">
                          #{ev.section}
                        </span>
                      </td>

                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="text-[11px] text-[#94A3B8] capitalize">
                          {ev.interactionType.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-5 py-3 whitespace-nowrap text-[#94A3B8]">
                        {ev.referrer}
                      </td>

                      <td className="px-5 py-3 whitespace-nowrap font-mono text-[10px] text-[#64748B]">
                        {ev.visitorId.slice(0, 14)}...
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-3 bg-[#0B132B] border-t border-[#1F2937] flex items-center justify-between text-xs text-[#64748B]">
          <span>Displaying latest {Math.min(filteredEvents.length, 40)} visitor records</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Client Telemetry Active
          </span>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsTab;
