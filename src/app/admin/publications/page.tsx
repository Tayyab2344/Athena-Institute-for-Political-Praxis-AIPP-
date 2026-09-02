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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FAF8F5] p-8 rounded-2xl border border-[#4A121A]/10 shadow-sm">
        <div>
          <h1 className="font-serif text-3xl text-[#1A1817] font-normal">
            Research Publications CMS
          </h1>
          <p className="text-xs font-sans text-[#5C5755] mt-1 font-light">
            Manage peer-reviewed papers, policy briefs, reports, and journal issues for AIPP.
          </p>
        </div>

        <Link
          href="/admin/publications/new"
          className="px-6 py-3 rounded-full bg-[#4A121A] text-[#FAF8F5] text-xs font-sans font-semibold hover:bg-[#6A1B27] transition-colors flex items-center gap-2 shadow-md w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Publication</span>
        </Link>
      </div>

      <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#4A121A]/10 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#5C5755] absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by title, author, abstract..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 text-xs font-sans text-[#1A1817] focus:outline-none focus:border-[#4A121A]"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 text-xs font-sans text-[#1A1817] focus:outline-none focus:border-[#4A121A]"
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
              className="w-full px-4 py-2.5 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 text-xs font-sans text-[#1A1817] focus:outline-none focus:border-[#4A121A]"
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

      <div className="bg-[#FAF8F5] rounded-2xl border border-[#4A121A]/10 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs font-sans text-[#5C5755]">
            Loading publication records...
          </div>
        ) : publications.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <FileText className="w-10 h-10 text-[#4A121A]/30 mx-auto" />
            <p className="text-sm font-serif text-[#1A1817]">No publications found matching your filters.</p>
            <Link
              href="/admin/publications/new"
              className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-[#4A121A] hover:underline"
            >
              Create your first publication →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#EFECE6] border-b border-[#4A121A]/10 text-[10px] font-sans uppercase tracking-wider text-[#4A121A]">
                  <th className="p-4 pl-6">Title & Category</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Author(s)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4A121A]/10 text-xs font-sans">
                {publications.map((pub) => (
                  <tr key={pub.id} className="hover:bg-[#EFECE6]/50 transition-colors">
                    <td className="p-4 pl-6 space-y-1">
                      <span className="font-serif text-sm text-[#1A1817] font-semibold block line-clamp-1">
                        {pub.title}
                      </span>
                      <span className="text-[10px] font-sans text-[#5C5755] block">
                        {pub.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-[#4A121A]">
                      {pub.type}
                    </td>
                    <td className="p-4 text-[#5C5755]">
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
                            className="p-2 rounded-lg hover:bg-[#4A121A]/10 text-[#4A121A]"
                            title="View Public Page"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/publications/${pub.id}/edit`}
                          className="p-2 rounded-lg hover:bg-[#4A121A]/10 text-[#4A121A]"
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
