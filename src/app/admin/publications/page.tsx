"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit3, Trash2, Eye, FileText, CheckCircle, Clock, Archive } from "lucide-react";

interface PublicationItem {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  publishedAt: string | null;
  category?: { name: string };
  authors: { name: string }[];
  pdfUrl?: string;
}

export default function AdminPublicationsPage() {
  const [publications, setPublications] = useState<PublicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchPublications = async () => {
    setLoading(true);
    try {
      let url = `/api/publications?admin=true&limit=50`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (typeFilter !== "ALL") url += `&type=${typeFilter}`;
      if (statusFilter !== "ALL") url += `&status=${statusFilter}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.publications) {
        setPublications(data.publications);
      }
    } catch (e) {
      console.error("Failed to load publications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, [search, typeFilter, statusFilter]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/publications/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPublications();
      }
    } catch (e) {
      alert("Failed to delete publication");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-sans font-semibold uppercase tracking-wider flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Published
          </span>
        );
      case "DRAFT":
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-sans font-semibold uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3" /> Draft
          </span>
        );
      case "UNDER_REVIEW":
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-sans font-semibold uppercase tracking-wider flex items-center gap-1">
            Under Review
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-gray-200 text-gray-700 text-[10px] font-sans font-semibold uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-8 rounded-2xl border border-[#0A192F]/10 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#0D1B2A] font-normal">
            Research Publications CMS
          </h1>
          <p className="text-xs font-sans text-[#5C6470] mt-1 font-light">
            Manage peer-reviewed papers, policy briefs, reports, and journal issues for AIPP.
          </p>
        </div>

        <Link
          href="/admin/publications/new"
          className="px-6 py-3 rounded-full bg-[#0A192F] text-white text-xs font-sans font-semibold hover:bg-[#172E54] transition-colors flex items-center justify-center gap-2 shadow-md w-full sm:w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Publication</span>
        </Link>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#0A192F]/10 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#5C6470] absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by title, author, abstract..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#0A192F]/10 text-sm sm:text-xs font-sans text-[#0D1B2A] focus:outline-none focus:border-[#0A192F]"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#0A192F]/10 text-sm sm:text-xs font-sans text-[#0D1B2A] focus:outline-none focus:border-[#0A192F]"
            >
              <option value="ALL">All Publication Types</option>
              <option value="RESEARCH_PAPER">Research Paper</option>
              <option value="POLICY_BRIEF">Policy Brief</option>
              <option value="REPORT">Report</option>
              <option value="JOURNAL">Journal Article</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#0A192F]/10 text-sm sm:text-xs font-sans text-[#0D1B2A] focus:outline-none focus:border-[#0A192F]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published Only</option>
              <option value="DRAFT">Draft Only</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#0A192F]/10 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs font-sans text-[#5C6470]">
            Loading publication records...
          </div>
        ) : publications.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <FileText className="w-10 h-10 text-[#0A192F]/30 mx-auto" />
            <p className="text-sm font-serif text-[#0D1B2A]">No publications found matching your filters.</p>
            <Link
              href="/admin/publications/new"
              className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-[#0A192F] hover:underline"
            >
              Create your first publication →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F6F2] border-b border-[#0A192F]/10 text-[10px] font-sans uppercase tracking-wider text-[#0A192F]">
                  <th className="p-4 pl-6">Title & Category</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Author(s)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0A192F]/10 text-xs font-sans">
                {publications.map((pub) => (
                  <tr key={pub.id} className="hover:bg-[#F7F6F2]/70 transition-colors">
                    <td className="p-4 pl-6 space-y-1">
                      <span className="font-serif text-sm text-[#0D1B2A] font-semibold block line-clamp-1">
                        {pub.title}
                      </span>
                      <span className="text-[10px] font-sans text-[#5C6470] block">
                        {pub.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-[#0A192F]">
                      {pub.type}
                    </td>
                    <td className="p-4 text-[#5C6470]">
                      {pub.authors.map((a) => a.name).join(", ") || "No author"}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(pub.status)}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {pub.status === "PUBLISHED" && (
                          <Link
                            href={`/research/${pub.slug}`}
                            target="_blank"
                            className="p-2 rounded-lg hover:bg-[#0A192F]/10 text-[#0A192F]"
                            title="View Public Page"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/publications/${pub.id}/edit`}
                          className="p-2 rounded-lg hover:bg-[#0A192F]/10 text-[#0A192F]"
                          title="Edit Publication"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(pub.id, pub.title)}
                          className="p-2 rounded-lg hover:bg-rose-100 text-rose-700"
                          title="Delete Publication"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
