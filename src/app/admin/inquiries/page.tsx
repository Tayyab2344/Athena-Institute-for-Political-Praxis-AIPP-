"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Inbox,
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react";

interface Assignee {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface InquiryItem {
  id: string;
  referenceNumber: string;
  inquiryType: string;
  fullName: string;
  email: string;
  organization: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  sourceForm: string;
  status: "NEW" | "IN_PROGRESS" | "AWAITING_RESPONSE" | "RESOLVED" | "SPAM" | "ARCHIVED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  assignedTo: Assignee | null;
  createdAt: string;
  resolvedAt: string | null;
  _count?: {
    notes: number;
  };
}

interface StatusCounts {
  total: number;
  new: number;
  inProgress: number;
  awaitingResponse: number;
  resolved: number;
  spam: number;
  archived: number;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    total: 0,
    new: 0,
    inProgress: 0,
    awaitingResponse: 0,
    resolved: 0,
    spam: 0,
    archived: 0,
  });

  // Filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [assignedFilter, setAssignedFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch assignees once
  useEffect(() => {
    async function loadAssignees() {
      try {
        const res = await fetch("/api/inquiries/assignees");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.assignees)) setAssignees(data.assignees);
        }
      } catch (err) {
        console.error("Failed to load assignees", err);
      }
    }
    loadAssignees();
  }, []);

  // Fetch inquiries list
  useEffect(() => {
    let ignore = false;
    async function loadInquiries() {
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (statusFilter !== "ALL") params.set("status", statusFilter);
        if (typeFilter !== "ALL") params.set("inquiryType", typeFilter);
        if (priorityFilter !== "ALL") params.set("priority", priorityFilter);
        if (assignedFilter !== "ALL") params.set("assignedTo", assignedFilter);
        if (dateFrom) params.set("dateFrom", dateFrom);
        if (dateTo) params.set("dateTo", dateTo);
        params.set("sort", sortOrder);
        params.set("page", String(page));
        params.set("limit", "15");

        const res = await fetch(`/api/inquiries?${params.toString()}`);
        if (!ignore && res.status === 403) {
          setPermissionDenied(true);
          return;
        }

        if (!ignore && res.ok) {
          const data = await res.json();
          setInquiries(data.inquiries || []);
          if (data.pagination) {
            setTotalPages(data.pagination.totalPages || 1);
            setTotalCount(data.pagination.total || 0);
          }
          if (data.statusCounts) {
            setStatusCounts(data.statusCounts);
          }
        }
      } catch (err) {
        console.error("Failed to fetch inquiries", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadInquiries();
    return () => {
      ignore = true;
    };
  }, [
    search,
    statusFilter,
    typeFilter,
    priorityFilter,
    assignedFilter,
    sortOrder,
    dateFrom,
    dateTo,
    page,
  ]);

  // Reset filters
  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setTypeFilter("ALL");
    setPriorityFilter("ALL");
    setAssignedFilter("ALL");
    setDateFrom("");
    setDateTo("");
    setSortOrder("newest");
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(search) ||
    statusFilter !== "ALL" ||
    typeFilter !== "ALL" ||
    priorityFilter !== "ALL" ||
    assignedFilter !== "ALL" ||
    Boolean(dateFrom) ||
    Boolean(dateTo);

  // CSV Export handler
  const handleExportCsv = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (typeFilter !== "ALL") params.set("inquiryType", typeFilter);
      if (priorityFilter !== "ALL") params.set("priority", priorityFilter);
      if (assignedFilter !== "ALL") params.set("assignedTo", assignedFilter);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      params.set("sort", sortOrder);

      const res = await fetch(`/api/inquiries/export?${params.toString()}`);
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aipp-inquiries-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Export error", err);
      alert("Failed to export inquiries. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-sans font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            New
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-sans font-semibold uppercase tracking-wider">
            In Progress
          </span>
        );
      case "AWAITING_RESPONSE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-sans font-semibold uppercase tracking-wider">
            Awaiting
          </span>
        );
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-sans font-semibold uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Resolved
          </span>
        );
      case "SPAM":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-sans font-semibold uppercase tracking-wider">
            Spam
          </span>
        );
      case "ARCHIVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-sans font-semibold uppercase tracking-wider">
            Archived
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
            Urgent
          </span>
        );
      case "HIGH":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
            High
          </span>
        );
      case "MEDIUM":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
            Medium
          </span>
        );
      case "LOW":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
            Low
          </span>
        );
      default:
        return <span>{priority}</span>;
    }
  };

  if (permissionDenied) {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-8 sm:p-12 text-center space-y-4 max-w-xl mx-auto my-12 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h2 className="font-serif text-2xl text-[#081D2E]">Access Restricted</h2>
          <p className="text-xs font-sans text-[#64717C] leading-relaxed">
            Your administrator role does not have authorization to view or manage Secretariat inquiries.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0D2C49] text-white text-xs font-semibold hover:bg-[#081D2E] transition-colors"
          >
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* 1. Header Card */}
      <div className="bg-white p-5 sm:p-7 rounded-2xl border border-[#D9DEE2] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.18em] text-[#B09C4B]">
              Secretariat Operations
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
              Phase 3 Active
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#081D2E] font-normal tracking-tight">
            Requests &amp; Inquiries Management
          </h1>
          <p className="text-xs font-sans text-[#64717C] font-light mt-1 max-w-2xl">
            Triage, assign, and manage inquiries received from public portal forms, partnership proposals, and diplomatic applications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={exporting || totalCount === 0}
            className="px-4 py-2.5 rounded-lg border border-[#D9DEE2] hover:border-[#0D2C49] text-[#081D2E] text-xs font-sans font-medium transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
            title="Export filtered inquiries as safe CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#0D2C49]" />
            <span>{exporting ? "Exporting..." : "Export CSV"}</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#D9DEE2] shadow-2xs">
          <p className="text-[10px] font-sans uppercase tracking-wider text-[#64717C] font-semibold">
            Total Submissions
          </p>
          <p className="font-serif text-2xl sm:text-3xl text-[#081D2E] font-normal mt-1">
            {statusCounts.total}
          </p>
          <span className="text-[10px] font-sans text-[#64717C] block mt-0.5">All received records</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-amber-200 shadow-2xs">
          <p className="text-[10px] font-sans uppercase tracking-wider text-amber-700 font-semibold">
            New / Pending
          </p>
          <p className="font-serif text-2xl sm:text-3xl text-amber-800 font-normal mt-1">
            {statusCounts.new}
          </p>
          <span className="text-[10px] font-sans text-amber-600 block mt-0.5">Requires triage</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-blue-200 shadow-2xs">
          <p className="text-[10px] font-sans uppercase tracking-wider text-blue-700 font-semibold">
            In Progress
          </p>
          <p className="font-serif text-2xl sm:text-3xl text-blue-800 font-normal mt-1">
            {statusCounts.inProgress}
          </p>
          <span className="text-[10px] font-sans text-blue-600 block mt-0.5">Under Secretariat review</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-emerald-200 shadow-2xs">
          <p className="text-[10px] font-sans uppercase tracking-wider text-emerald-700 font-semibold">
            Resolved
          </p>
          <p className="font-serif text-2xl sm:text-3xl text-emerald-800 font-normal mt-1">
            {statusCounts.resolved}
          </p>
          <span className="text-[10px] font-sans text-emerald-600 block mt-0.5">Complete inquiries</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-rose-200 shadow-2xs col-span-2 lg:col-span-1">
          <p className="text-[10px] font-sans uppercase tracking-wider text-rose-700 font-semibold">
            Flagged Spam
          </p>
          <p className="font-serif text-2xl sm:text-3xl text-rose-800 font-normal mt-1">
            {statusCounts.spam}
          </p>
          <span className="text-[10px] font-sans text-rose-600 block mt-0.5">Trapped by honeypot</span>
        </div>
      </div>

      {/* 3. Search and Multi-Faceted Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#D9DEE2] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#64717C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email, subject, or reference number..."
              className="w-full pl-9 pr-4 py-2 text-xs font-sans rounded-lg border border-[#D9DEE2] focus:outline-hidden focus:border-[#0D2C49] transition-all bg-[#FAF9F5]/40"
            />
          </div>

          {/* Quick Clear */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3.5 py-2 rounded-lg border border-[#D9DEE2] text-xs font-sans font-medium text-[#64717C] hover:text-[#081D2E] hover:border-[#0D2C49] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          {/* Status */}
          <div>
            <label className="text-[10px] uppercase font-semibold text-[#64717C] block mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs font-sans rounded-md border border-[#D9DEE2] bg-white text-[#081D2E] focus:outline-hidden focus:border-[#0D2C49]"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="AWAITING_RESPONSE">Awaiting Response</option>
              <option value="RESOLVED">Resolved</option>
              <option value="SPAM">Spam</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="text-[10px] uppercase font-semibold text-[#64717C] block mb-1">
              Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs font-sans rounded-md border border-[#D9DEE2] bg-white text-[#081D2E] focus:outline-hidden focus:border-[#0D2C49]"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Inquiry Type */}
          <div>
            <label className="text-[10px] uppercase font-semibold text-[#64717C] block mb-1">
              Inquiry Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs font-sans rounded-md border border-[#D9DEE2] bg-white text-[#081D2E] focus:outline-hidden focus:border-[#0D2C49]"
            >
              <option value="ALL">All Types</option>
              <option value="General Institutional Inquiry">General Institutional</option>
              <option value="Strategic Action & Simulation Wargames">Strategic Action</option>
              <option value="Policy Research & Journal Submissions">Policy Research</option>
              <option value="Diplomatic Programs & Fellowships">Diplomatic Programs</option>
              <option value="Institutional Partnership & Media">Partnership &amp; Media</option>
            </select>
          </div>

          {/* Assignee */}
          <div>
            <label className="text-[10px] uppercase font-semibold text-[#64717C] block mb-1">
              Assignee
            </label>
            <select
              value={assignedFilter}
              onChange={(e) => {
                setAssignedFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs font-sans rounded-md border border-[#D9DEE2] bg-white text-[#081D2E] focus:outline-hidden focus:border-[#0D2C49]"
            >
              <option value="ALL">All Assignees</option>
              <option value="UNASSIGNED">Unassigned</option>
              {assignees.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="text-[10px] uppercase font-semibold text-[#64717C] block mb-1">
              Date From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className="w-full px-2 py-1 text-xs font-sans rounded-md border border-[#D9DEE2] bg-white text-[#081D2E] focus:outline-hidden focus:border-[#0D2C49]"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="text-[10px] uppercase font-semibold text-[#64717C] block mb-1">
              Date To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              className="w-full px-2 py-1 text-xs font-sans rounded-md border border-[#D9DEE2] bg-white text-[#081D2E] focus:outline-hidden focus:border-[#0D2C49]"
            />
          </div>
        </div>
      </div>

      {/* 4. Inquiries Data Table */}
      <div className="bg-white rounded-2xl border border-[#D9DEE2] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#0D2C49] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-[#64717C] font-light">Loading inquiries registry...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="py-20 text-center space-y-3 max-w-sm mx-auto px-4">
            <div className="w-12 h-12 rounded-full bg-[#FAF9F5] border border-[#D9DEE2] flex items-center justify-center text-[#64717C] mx-auto">
              <Inbox className="w-6 h-6 text-[#B09C4B]" />
            </div>
            <h3 className="font-serif text-lg text-[#081D2E] font-normal">No Inquiries Found</h3>
            <p className="text-xs text-[#64717C] font-light">
              {hasActiveFilters
                ? "No submissions match your active filter criteria. Try resetting your search filters."
                : "No inquiries have been recorded yet. Submissions from website forms will appear here automatically."}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0D2C49] text-white text-xs font-semibold cursor-pointer"
              >
                <span>Clear All Filters</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D9DEE2] bg-[#FAF9F5]/70 text-[10px] font-sans font-semibold uppercase tracking-wider text-[#64717C]">
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Submitter</th>
                  <th className="py-3 px-4">Type / Subject</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assigned</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9DEE2] text-xs font-sans">
                {inquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    className="hover:bg-[#FAF9F5]/40 transition-colors group cursor-pointer"
                  >
                    {/* Reference Number */}
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/admin/inquiries/${inq.id}`}
                        className="font-mono text-[11px] font-semibold text-[#0D2C49] group-hover:text-[#B09C4B] transition-colors"
                      >
                        {inq.referenceNumber}
                      </Link>
                      <span className="block text-[10px] text-[#64717C] font-mono">
                        {inq.sourceForm.replace(/_/g, " ")}
                      </span>
                    </td>

                    {/* Submitter */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#081D2E] text-xs">{inq.fullName}</p>
                      <p className="text-[11px] text-[#64717C]">{inq.email}</p>
                      {inq.organization && (
                        <p className="text-[10px] text-[#64717C] italic truncate max-w-[180px]">
                          {inq.organization}
                        </p>
                      )}
                    </td>

                    {/* Type / Subject */}
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <p className="font-medium text-[#081D2E] truncate" title={inq.inquiryType}>
                        {inq.inquiryType}
                      </p>
                      {inq.subject && inq.subject !== inq.inquiryType && (
                        <p className="text-[11px] text-[#64717C] truncate" title={inq.subject}>
                          {inq.subject}
                        </p>
                      )}
                      {(inq._count?.notes ?? 0) > 0 && (
                        <span className="inline-block mt-0.5 text-[10px] text-[#B09C4B] font-semibold">
                          • {inq._count?.notes} internal note{inq._count?.notes === 1 ? "" : "s"}
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">{getStatusBadge(inq.status)}</td>

                    {/* Priority Badge */}
                    <td className="py-3.5 px-4">{getPriorityBadge(inq.priority)}</td>

                    {/* Assigned Administrator */}
                    <td className="py-3.5 px-4">
                      {inq.assignedTo ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-[#0D2C49] text-white flex items-center justify-center text-[10px] font-semibold">
                            {inq.assignedTo.name.charAt(0)}
                          </div>
                          <span className="text-xs text-[#081D2E] truncate max-w-[110px]">
                            {inq.assignedTo.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#64717C] italic">Unassigned</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-[#64717C]">
                      {new Date(inq.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/inquiries/${inq.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#D9DEE2] hover:border-[#0D2C49] hover:bg-white text-xs font-semibold text-[#0D2C49] transition-all"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#D9DEE2] flex items-center justify-between text-xs font-sans text-[#64717C] bg-[#FAF9F5]/40">
            <div>
              Showing page <span className="font-semibold text-[#081D2E]">{page}</span> of{" "}
              <span className="font-semibold text-[#081D2E]">{totalPages}</span> ({totalCount} total)
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded border border-[#D9DEE2] hover:border-[#0D2C49] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded border border-[#D9DEE2] hover:border-[#0D2C49] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
