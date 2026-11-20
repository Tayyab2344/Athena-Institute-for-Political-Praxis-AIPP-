"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Users,
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Send,
  Eye,
  X,
  FileCheck2,
  History,
  AlertTriangle,
} from "lucide-react";

interface SubscriberStats {
  total: number;
  active: number;
  pending: number;
  unsubscribed: number;
  suppressed: number;
}

interface SubscriberItem {
  id: string;
  email: string;
  status: "ACTIVE" | "PENDING_VERIFICATION" | "UNSUBSCRIBED" | "SUPPRESSED";
  source: string;
  subscribedAt: string;
  verifiedAt: string | null;
  unsubscribedAt: string | null;
  suppressedAt: string | null;
  suppressionReason: string | null;
  createdAt: string;
  latestActivity: {
    action: string;
    createdAt: string;
  } | null;
}

interface ConsentRecord {
  id: string;
  consentType: string;
  consentText: string;
  policyVersion: string;
  ipHash: string | null;
  userAgent: string | null;
  sourceUrl: string | null;
  createdAt: string;
}

interface ActivityRecord {
  id: string;
  action: string;
  details: string | null;
  createdAt: string;
  adminUser: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

interface SubscriberDetail extends SubscriberItem {
  updatedAt: string;
  consents: ConsentRecord[];
  activities: ActivityRecord[];
  tokens: {
    id: string;
    type: string;
    expiresAt: string;
    usedAt: string | null;
    createdAt: string;
  }[];
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [stats, setStats] = useState<SubscriberStats>({
    total: 0,
    active: 0,
    pending: 0,
    unsubscribed: 0,
    suppressed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [subDetail, setSubDetail] = useState<SubscriberDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailTab, setDetailTab] = useState<"overview" | "consents" | "activities">("overview");

  const [suppressSubId, setSuppressSubId] = useState<string | null>(null);
  const [suppressReason, setSuppressReason] = useState("");
  const [suppressSubmitting, setSuppressSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const [resendingId, setResendingId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refreshData = useCallback(() => {
    setLoading(true);
    setActionError("");
    setActionSuccess("");
    setReloadKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "15",
          status: statusFilter,
        });
        if (search.trim()) {
          params.set("search", search.trim());
        }

        const res = await fetch(`/api/admin/subscribers?${params.toString()}`);
        if (!isMounted) return;

        if (res.status === 403) {
          setPermissionDenied(true);
          setLoading(false);
          return;
        }
        if (!res.ok) {
          throw new Error("Failed to load subscriber records.");
        }

        const data = await res.json();
        if (!isMounted) return;

        setStats(data.stats);
        setSubscribers(data.subscribers);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.total);
      } catch {
        if (!isMounted) return;
        setActionError("Unable to retrieve subscriber data. Please verify your connection.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [page, statusFilter, search, reloadKey]);

  const fetchSubscriberDetail = async (id: string) => {
    setSelectedSubId(id);
    setDetailLoading(true);
    setDetailTab("overview");

    try {
      const res = await fetch(`/api/admin/subscribers/${id}`);
      if (!res.ok) throw new Error("Failed to load details.");
      const data = await res.json();
      setSubDetail(data.subscriber);
    } catch {
      setActionError("Failed to fetch subscriber details.");
      setSelectedSubId(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSuppress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suppressSubId || !suppressReason.trim()) return;

    setSuppressSubmitting(true);
    setActionError("");

    try {
      const res = await fetch(`/api/admin/subscribers/${suppressSubId}/suppress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: suppressReason.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to suppress subscriber.");
      }

      setSuppressSubId(null);
      setSuppressReason("");
      setActionSuccess("Subscriber suppressed successfully.");
      refreshData();
      if (selectedSubId === suppressSubId) {
        fetchSubscriberDetail(suppressSubId);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Error suppressing subscriber.";
      setActionError(errorMsg);
    } finally {
      setSuppressSubmitting(false);
    }
  };

  const handleResendVerification = async (id: string) => {
    setResendingId(id);
    setActionError("");
    setActionSuccess("");

    try {
      const res = await fetch(`/api/admin/subscribers/${id}/resend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to resend verification.");
      }

      setActionSuccess("Verification email enqueued successfully.");
      refreshData();
      if (selectedSubId === id) {
        fetchSubscriberDetail(id);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Error resending verification email.";
      setActionError(errorMsg);
    } finally {
      setResendingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            Active
          </span>
        );
      case "PENDING_VERIFICATION":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            Pending
          </span>
        );
      case "UNSUBSCRIBED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            Unsubscribed
          </span>
        );
      case "SUPPRESSED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            Suppressed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (permissionDenied) {
    return (
      <div className="bg-white rounded-xl shadow-xs border border-rose-200 p-8 text-center max-w-lg mx-auto mt-12">
        <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
        <p className="text-sm text-gray-600 mb-4">
          Your administrative role does not have authorization to view or manage newsletter subscriber records.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#081D2E] tracking-tight">
            Newsletter Subscribers
          </h1>
          <p className="text-xs font-sans text-slate-500 mt-1">
            Institutional audience roster, consent audit trails, and double opt-in lifecycle management.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refreshData()}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button type="button" onClick={() => setActionSuccess("")} className="text-emerald-600 hover:text-emerald-900">
            ✕
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center justify-between">
          <span>{actionError}</span>
          <button type="button" onClick={() => setActionError("")} className="text-rose-600 hover:text-rose-900">
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-sans uppercase tracking-wider text-slate-500 font-semibold">Total Audience</p>
          <p className="text-2xl font-bold text-[#081D2E] mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs">
          <p className="text-[11px] font-sans uppercase tracking-wider text-emerald-700 font-semibold">Active</p>
          <p className="text-2xl font-bold text-emerald-800 mt-1">{stats.active}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
          <p className="text-[11px] font-sans uppercase tracking-wider text-amber-700 font-semibold">Pending</p>
          <p className="text-2xl font-bold text-amber-800 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-sans uppercase tracking-wider text-slate-600 font-semibold">Unsubscribed</p>
          <p className="text-2xl font-bold text-slate-700 mt-1">{stats.unsubscribed}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-2xs col-span-2 sm:col-span-1">
          <p className="text-[11px] font-sans uppercase tracking-wider text-rose-700 font-semibold">Suppressed</p>
          <p className="text-2xl font-bold text-rose-800 mt-1">{stats.suppressed}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by subscriber email..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#B09C4B] focus:border-transparent text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="text-xs font-sans text-slate-500 font-medium">
              Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#B09C4B]"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING_VERIFICATION">Pending Verification</option>
              <option value="UNSUBSCRIBED">Unsubscribed</option>
              <option value="SUPPRESSED">Suppressed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Subscribed</th>
                <th className="py-3 px-4">Verified</th>
                <th className="py-3 px-4">Latest Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-slate-300 border-t-[#B09C4B] rounded-full animate-spin mb-2" />
                    <p>Loading subscribers...</p>
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-slate-600">No subscribers found</p>
                    <p className="text-[11px] mt-1">Try adjusting your search criteria or status filter.</p>
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-900">{sub.email}</td>
                    <td className="py-3 px-4">{getStatusBadge(sub.status)}</td>
                    <td className="py-3 px-4 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                      {sub.source}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(sub.subscribedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {sub.verifiedAt ? new Date(sub.verifiedAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {sub.latestActivity ? (
                        <span title={new Date(sub.latestActivity.createdAt).toLocaleString()}>
                          {sub.latestActivity.action.replace(/_/g, " ")}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => fetchSubscriberDetail(sub.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                        title="View Full Profile & Consent Audit"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </button>

                      {sub.status === "PENDING_VERIFICATION" && (
                        <button
                          type="button"
                          onClick={() => handleResendVerification(sub.id)}
                          disabled={resendingId === sub.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
                          title="Resend Verification Link"
                        >
                          <Send className="w-3.5 h-3.5" />
                          {resendingId === sub.id ? "Sending..." : "Resend"}
                        </button>
                      )}

                      {sub.status !== "SUPPRESSED" && (
                        <button
                          type="button"
                          onClick={() => {
                            setSuppressSubId(sub.id);
                            setSuppressReason("");
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-medium transition-colors cursor-pointer"
                          title="Manually Suppress Subscriber"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Suppress
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {subscribers.length} of {totalCount} subscribers
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-md border border-slate-300 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-md border border-slate-300 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {selectedSubId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#B09C4B]" />
                <h3 className="font-bold text-sm text-[#081D2E]">Subscriber Details & Audit Evidence</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedSubId(null);
                  setSubDetail(null);
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex border-b border-slate-200 bg-white px-4 text-xs">
              <button
                type="button"
                onClick={() => setDetailTab("overview")}
                className={`py-3 px-4 font-semibold border-b-2 cursor-pointer transition-colors ${
                  detailTab === "overview"
                    ? "border-[#B09C4B] text-[#081D2E]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setDetailTab("consents")}
                className={`py-3 px-4 font-semibold border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
                  detailTab === "consents"
                    ? "border-[#B09C4B] text-[#081D2E]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                Consent Evidence ({subDetail?.consents?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setDetailTab("activities")}
                className={`py-3 px-4 font-semibold border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
                  detailTab === "activities"
                    ? "border-[#B09C4B] text-[#081D2E]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <History className="w-3.5 h-3.5" />
                Lifecycle Audit ({subDetail?.activities?.length || 0})
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 text-xs">
              {detailLoading || !subDetail ? (
                <div className="py-12 text-center text-slate-400">
                  <div className="inline-block w-6 h-6 border-2 border-slate-300 border-t-[#B09C4B] rounded-full animate-spin mb-2" />
                  <p>Loading profile evidence...</p>
                </div>
              ) : detailTab === "overview" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500">Email Address</p>
                      <p className="font-mono text-sm font-bold text-slate-900 mt-0.5">{subDetail.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500">Current Status</p>
                      <div className="mt-1">{getStatusBadge(subDetail.status)}</div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500">Intake Source</p>
                      <p className="font-semibold text-slate-700 mt-0.5 uppercase">{subDetail.source}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500">Subscribed At</p>
                      <p className="text-slate-700 mt-0.5">{new Date(subDetail.subscribedAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500">Verified At</p>
                      <p className="text-slate-700 mt-0.5">
                        {subDetail.verifiedAt ? new Date(subDetail.verifiedAt).toLocaleString() : "Unverified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500">Unsubscribed At</p>
                      <p className="text-slate-700 mt-0.5">
                        {subDetail.unsubscribedAt ? new Date(subDetail.unsubscribedAt).toLocaleString() : "Active"}
                      </p>
                    </div>
                  </div>

                  {subDetail.status === "SUPPRESSED" && (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-900">
                      <p className="text-xs font-bold uppercase tracking-wider mb-1">Manual Suppression Active</p>
                      <p className="text-xs">
                        <strong>Reason:</strong> {subDetail.suppressionReason || "Administrative decision"}
                      </p>
                      <p className="text-[11px] text-rose-700 mt-1">
                        Suppressed on: {subDetail.suppressedAt ? new Date(subDetail.suppressedAt).toLocaleString() : "—"}
                      </p>
                    </div>
                  )}

                  <div className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                      Verification Tokens History
                    </h4>
                    {subDetail.tokens.length === 0 ? (
                      <p className="text-slate-400">No token records generated.</p>
                    ) : (
                      <div className="space-y-2">
                        {subDetail.tokens.map((t) => (
                          <div key={t.id} className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-slate-700 uppercase">{t.type}</span>
                              <span className="text-slate-400 ml-2">Expires: {new Date(t.expiresAt).toLocaleString()}</span>
                            </div>
                            <span className={t.usedAt ? "text-emerald-700 font-medium" : "text-amber-700 font-medium"}>
                              {t.usedAt ? `Used (${new Date(t.usedAt).toLocaleDateString()})` : "Unused"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : detailTab === "consents" ? (
                <div className="space-y-3">
                  {subDetail.consents.length === 0 ? (
                    <p className="text-slate-400 py-6 text-center">No explicit consent records recorded.</p>
                  ) : (
                    subDetail.consents.map((c) => (
                      <div key={c.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                          <span className="font-bold text-slate-800 text-[11px]">{c.consentType}</span>
                          <span className="text-[11px] text-slate-500 font-mono">Policy {c.policyVersion}</span>
                        </div>
                        <p className="text-slate-700 italic bg-white p-2.5 rounded border border-slate-200 font-serif">
                          &ldquo;{c.consentText}&rdquo;
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 pt-1 font-mono">
                          <div>Timestamp: {new Date(c.createdAt).toLocaleString()}</div>
                          <div>IP Hash: {c.ipHash ? `${c.ipHash.slice(0, 16)}...` : "None"}</div>
                          {c.sourceUrl && <div className="col-span-2">Source URL: {c.sourceUrl}</div>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {subDetail.activities.length === 0 ? (
                    <p className="text-slate-400 py-6 text-center">No lifecycle activities logged.</p>
                  ) : (
                    subDetail.activities.map((a) => (
                      <div key={a.id} className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800 text-[11px] font-mono">
                            {a.action}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(a.createdAt).toLocaleString()}
                          </span>
                        </div>
                        {a.adminUser && (
                          <p className="text-[10px] text-slate-500">
                            Executed by: <span className="font-semibold text-slate-700">{a.adminUser.name}</span> ({a.adminUser.email})
                          </p>
                        )}
                        {a.details && (
                          <pre className="text-[10px] bg-slate-50 p-2 rounded border border-slate-100 overflow-x-auto text-slate-600 font-mono">
                            {a.details}
                          </pre>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-slate-200 bg-slate-50 text-right">
              <button
                type="button"
                onClick={() => {
                  setSelectedSubId(null);
                  setSubDetail(null);
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {suppressSubId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 text-rose-700 mb-3">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sm text-[#081D2E]">Confirm Subscriber Suppression</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Suppressing this subscriber immediately terminates all active newsletter tokens, stops publications, and prevents double opt-in reactivation. Please provide an administrative reason.
            </p>
            <form onSubmit={handleSuppress} className="space-y-4">
              <div>
                <label htmlFor="suppress-reason" className="block text-xs font-semibold text-slate-700 mb-1">
                  Suppression Reason (Required)
                </label>
                <textarea
                  id="suppress-reason"
                  rows={3}
                  required
                  value={suppressReason}
                  onChange={(e) => setSuppressReason(e.target.value)}
                  placeholder="e.g., Requested removal via institutional legal counsel / excessive hard bounces..."
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500 text-slate-900 placeholder-slate-400"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSuppressSubId(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={suppressSubmitting || suppressReason.trim().length < 3}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  {suppressSubmitting ? "Suppressing..." : "Suppress Subscriber"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
