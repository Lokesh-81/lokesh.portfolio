'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import { uploadMediaToSupabase } from '@/lib/supabase';
import type { CertificationItem, SkillBadgeItem } from '@/lib/portfolio-types';
import {
  Plus,
  Edit2,
  Trash2,
  Award,
  ExternalLink,
  Upload,
  X,
  Save,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface CertificationsTabProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export function CertificationsTab({ showToast }: CertificationsTabProps) {
  const {
    certifications,
    skillBadges,
    saveCertification,
    deleteCertification,
    saveSkillBadge,
    deleteSkillBadge,
  } = usePortfolio();

  const [activeSubTab, setActiveSubTab] = useState<'certifications' | 'badges'>('certifications');

  // Cert modal state
  const [editingCert, setEditingCert] = useState<Partial<CertificationItem> | null>(null);
  const [isUploadingCert, setIsUploadingCert] = useState(false);
  const [isSavingCert, setIsSavingCert] = useState(false);

  // Badge modal state
  const [editingBadge, setEditingBadge] = useState<Partial<SkillBadgeItem> | null>(null);
  const [isSavingBadge, setIsSavingBadge] = useState(false);

  // Cert handlers
  const handleOpenNewCert = () => {
    setEditingCert({
      id: `cert-${Date.now()}`,
      title: '',
      issuer: 'Google Cloud',
      issueDate: 'Sep 2023',
      expiryDate: 'Sep 2026',
      credentialId: '',
      credentialUrl: '',
      badgeUrl: '/professional-cloud-architect-certification.svg',
      skills: [],
      featured: true,
      sortOrder: certifications.length + 1,
    });
  };

  const handleEditCert = (c: CertificationItem) => {
    setEditingCert({ ...c });
  };

  const handleDeleteCert = async (id: string, title: string) => {
    if (!window.confirm(`Delete certification "${title}"?`)) return;
    try {
      await deleteCertification(id);
      showToast('Certification deleted', 'success');
      if (editingCert?.id === id) setEditingCert(null);
    } catch (err: any) {
      showToast('Failed to delete certification', 'error');
    }
  };

  const handleCertBadgeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCert) return;

    setIsUploadingCert(true);
    try {
      const res = await uploadMediaToSupabase(file, 'certifications');
      setEditingCert((prev) => ({ ...prev!, badgeUrl: res.url }));
      showToast('Badge asset uploaded!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setIsUploadingCert(false);
    }
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert || !editingCert.title?.trim() || !editingCert.issuer?.trim()) {
      showToast('Title and Issuer are required', 'error');
      return;
    }

    setIsSavingCert(true);
    try {
      await saveCertification(editingCert as CertificationItem);
      showToast('Certification saved successfully!', 'success');
      setEditingCert(null);
    } catch (err: any) {
      showToast('Failed to save certification', 'error');
    } finally {
      setIsSavingCert(false);
    }
  };

  // Badge handlers
  const handleOpenNewBadge = () => {
    setEditingBadge({
      id: `badge-${Date.now()}`,
      title: '',
      issuer: 'Google Cloud Skills Boost',
      category: 'Cloud Architecture & Infrastructure',
      date: '2024',
      url: '',
      sortOrder: skillBadges.length + 1,
    });
  };

  const handleEditBadge = (b: SkillBadgeItem) => {
    setEditingBadge({ ...b });
  };

  const handleDeleteBadge = async (id: string, title: string) => {
    if (!window.confirm(`Delete skill badge "${title}"?`)) return;
    try {
      await deleteSkillBadge(id);
      showToast('Skill badge deleted', 'success');
      if (editingBadge?.id === id) setEditingBadge(null);
    } catch (err: any) {
      showToast('Failed to delete skill badge', 'error');
    }
  };

  const handleSaveBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBadge || !editingBadge.title?.trim()) {
      showToast('Badge title is required', 'error');
      return;
    }

    setIsSavingBadge(true);
    try {
      await saveSkillBadge(editingBadge as SkillBadgeItem);
      showToast('Skill badge saved!', 'success');
      setEditingBadge(null);
    } catch (err: any) {
      showToast('Failed to save skill badge', 'error');
    } finally {
      setIsSavingBadge(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#1F2937] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#E0E7FF]">Certifications & Google Badges</h2>
          <p className="text-xs text-[#94A3B8]">
            Manage professional cloud credentials, accredited certificates, and Google Cloud Skill Boost completions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeSubTab === 'certifications' ? (
            <button
              onClick={handleOpenNewCert}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1D4ED8] transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Certification</span>
            </button>
          ) : (
            <button
              onClick={handleOpenNewBadge}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1D4ED8] transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Skill Badge</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-[#1F2937] pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab('certifications')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all cursor-pointer ${
            activeSubTab === 'certifications'
              ? 'bg-[#2563EB]/20 border border-[#60A5FA]/40 text-[#60A5FA]'
              : 'bg-[#111827] text-[#94A3B8] hover:text-[#E0E7FF]'
          }`}
        >
          <Award className="h-4 w-4" />
          <span>Professional Certifications ({certifications.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('badges')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all cursor-pointer ${
            activeSubTab === 'badges'
              ? 'bg-[#2563EB]/20 border border-[#60A5FA]/40 text-[#60A5FA]'
              : 'bg-[#111827] text-[#94A3B8] hover:text-[#E0E7FF]'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Google Cloud Skill Badges ({skillBadges.length})</span>
        </button>
      </div>

      {/* Certifications List */}
      {activeSubTab === 'certifications' && (
        <div className="space-y-3">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-4 hover:border-[#60A5FA]/40 transition-all shadow-xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0B132B] border border-[#1F2937] overflow-hidden p-1.5">
                  {cert.badgeUrl ? (
                    <img
                      src={cert.badgeUrl}
                      alt={cert.title}
                      className="h-full w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Award className="h-6 w-6 text-[#FBBF24]" />
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-[#E0E7FF]">{cert.title}</h3>
                    <span className="rounded-full bg-[#FBBF24]/20 text-[#FBBF24] px-2 py-0.5 text-[10px] font-medium">
                      {cert.issuer}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-[#94A3B8]">
                    Valid: {cert.issueDate || 'Sep 2023'} – {cert.expiryDate || 'Sep 2026'}
                    {cert.credentialId && ` • ID: ${cert.credentialId}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-[#64748B] hover:text-[#60A5FA]"
                    title="View Credential"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleEditCert(cert)}
                  className="p-2 text-[#64748B] hover:text-[#60A5FA] cursor-pointer"
                  title="Edit Certification"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCert(cert.id, cert.title)}
                  className="p-2 text-[#64748B] hover:text-red-400 cursor-pointer"
                  title="Delete Certification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Google Skill Badges List */}
      {activeSubTab === 'badges' && (
        <div className="grid gap-3 sm:grid-cols-2">
          {skillBadges.map((badge) => (
            <div
              key={badge.id}
              className="flex items-center justify-between rounded-xl border border-[#1F2937] bg-[#111827]/70 p-3 hover:border-[#60A5FA]/40 transition-all shadow-xs"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#60A5FA]">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-semibold text-[#E0E7FF] truncate">{badge.title}</h4>
                  <p className="text-[10px] text-[#94A3B8] truncate">
                    {badge.category} • {badge.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  type="button"
                  onClick={() => handleEditBadge(badge)}
                  className="p-1.5 text-[#64748B] hover:text-[#60A5FA] cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteBadge(badge.id, badge.title)}
                  className="p-1.5 text-[#64748B] hover:text-red-400 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certification Edit Modal */}
      {editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#1F2937] bg-[#111827] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-4 mb-5">
              <h3 className="text-base font-bold text-[#E0E7FF]">
                {editingCert.id?.startsWith('cert-') ? 'Add Certification' : 'Edit Certification'}
              </h3>
              <button
                onClick={() => setEditingCert(null)}
                className="p-1.5 text-[#64748B] hover:text-[#CBD5E1] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCert} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Certification Title *</label>
                <input
                  type="text"
                  required
                  value={editingCert.title || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                  placeholder="Google Cloud Certified Professional Cloud Architect"
                  className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Issuer *</label>
                  <input
                    type="text"
                    required
                    value={editingCert.issuer || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                    placeholder="Google Cloud"
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Expiry / Valid Until</label>
                  <input
                    type="text"
                    value={editingCert.expiryDate || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, expiryDate: e.target.value })}
                    placeholder="Sep 2026"
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Credential URL</label>
                <input
                  type="text"
                  value={editingCert.credentialUrl || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, credentialUrl: e.target.value })}
                  placeholder="https://www.credential.net/..."
                  className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Badge Image / Vector</label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 rounded-xl border border-[#1F2937] bg-[#0B132B] px-4 py-2 text-xs font-medium text-[#CBD5E1] hover:border-[#60A5FA] hover:text-[#60A5FA] cursor-pointer transition-all">
                    <Upload className="h-3.5 w-3.5" />
                    <span>{isUploadingCert ? 'Uploading...' : 'Upload Badge'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCertBadgeUpload}
                      className="hidden"
                      disabled={isUploadingCert}
                    />
                  </label>
                  <input
                    type="text"
                    value={editingCert.badgeUrl || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, badgeUrl: e.target.value })}
                    placeholder="/professional-cloud-architect-certification.svg"
                    className="flex-1 rounded-xl border border-[#1F2937] bg-[#0B132B] px-3 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1F2937]">
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
                  className="rounded-xl border border-[#1F2937] bg-[#0B132B] px-4 py-2.5 text-xs font-medium text-[#CBD5E1] hover:bg-[#1F2937] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCert}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1D4ED8] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSavingCert ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>Save Certification</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Badge Edit Modal */}
      {editingBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-[#1F2937] bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-4 mb-5">
              <h3 className="text-base font-bold text-[#E0E7FF]">
                {editingBadge.id?.startsWith('badge-') ? 'Add Skill Badge' : 'Edit Skill Badge'}
              </h3>
              <button
                onClick={() => setEditingBadge(null)}
                className="p-1.5 text-[#64748B] hover:text-[#CBD5E1] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBadge} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Badge Title *</label>
                <input
                  type="text"
                  required
                  value={editingBadge.title || ''}
                  onChange={(e) => setEditingBadge({ ...editingBadge, title: e.target.value })}
                  placeholder="Create and Manage Cloud Resources"
                  className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Category</label>
                <input
                  type="text"
                  value={editingBadge.category || ''}
                  onChange={(e) => setEditingBadge({ ...editingBadge, category: e.target.value })}
                  placeholder="Cloud Architecture & Infrastructure"
                  className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Year / Date</label>
                <input
                  type="text"
                  value={editingBadge.date || ''}
                  onChange={(e) => setEditingBadge({ ...editingBadge, date: e.target.value })}
                  placeholder="2024"
                  className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1F2937]">
                <button
                  type="button"
                  onClick={() => setEditingBadge(null)}
                  className="rounded-xl border border-[#1F2937] bg-[#0B132B] px-4 py-2.5 text-xs font-medium text-[#CBD5E1] hover:bg-[#1F2937] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingBadge}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1D4ED8] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSavingBadge ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>Save Badge</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
