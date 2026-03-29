"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, ShieldCheck, UserCog, Users, X } from "lucide-react";
import { appToast } from "@/src/shared/lib";
import {
  fetchAdminWithdrawnUsers,
  hardDeleteAdminWithdrawnUser,
  type AdminWithdrawnUser,
} from "@/src/shared/api/admin-withdrawn-users";
import type { AdminUserRoleFilter, AdminUserSearchField } from "@/src/shared/api/admin-users";

const PAGE_SIZE_OPTIONS = [20, 50, 100] as const;

function formatDate(value?: string | null): string {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

type DeletionModalState = {
  user: AdminWithdrawnUser;
  confirmationEmail: string;
};

export default function AdminWithdrawnUsersPage() {
  const [items, setItems] = useState<AdminWithdrawnUser[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(20);
  const [total, setTotal] = useState(0);
  const [totalAll, setTotalAll] = useState(0);
  const [totalAdmin, setTotalAdmin] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState<AdminUserSearchField>("name");
  const [roleFilter, setRoleFilter] = useState<AdminUserRoleFilter>("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingUserId, setIsDeletingUserId] = useState<string | null>(null);
  const [isModalSubmitting, setIsModalSubmitting] = useState(false);
  const [deletionModal, setDeletionModal] = useState<DeletionModalState | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / size)), [size, total]);
  const pageWindowStart = useMemo(() => Math.floor((page - 1) / 10) * 10 + 1, [page]);
  const pageWindowEnd = useMemo(() => Math.min(totalPages, pageWindowStart + 9), [pageWindowStart, totalPages]);
  const visiblePages = useMemo(
    () => Array.from({ length: pageWindowEnd - pageWindowStart + 1 }, (_, index) => pageWindowStart + index),
    [pageWindowEnd, pageWindowStart],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let isMounted = true;

    const loadWithdrawn = async () => {
      setIsLoading(true);
      const result = await fetchAdminWithdrawnUsers({ page, size, search, searchField, role: roleFilter });
      if (!isMounted) return;

      if (!result.ok) {
        appToast.error(result.error);
        setIsLoading(false);
        return;
      }

      setItems(result.data.items);
      setTotal(result.data.total);
      setTotalAll(result.data.total_all);
      setTotalAdmin(result.data.total_admin);
      setTotalUser(result.data.total_user);
      setIsLoading(false);
    };

    void loadWithdrawn();
    return () => {
      isMounted = false;
    };
  }, [page, size, search, searchField, roleFilter, reloadToken]);

  const openDeletionModal = (user: AdminWithdrawnUser) => {
    if (isDeletingUserId) return;
    setDeletionModal({
      user,
      confirmationEmail: user.email,
    });
  };

  const closeDeletionModal = () => {
    if (isModalSubmitting) return;
    setDeletionModal(null);
  };

  const confirmDeletion = async () => {
    if (!deletionModal) return;
    const normalizedEmail = deletionModal.confirmationEmail.trim();
    if (!normalizedEmail) {
      appToast.error("이메일을 입력해야 합니다.");
      return;
    }

    setIsDeletingUserId(deletionModal.user.id);
    setIsModalSubmitting(true);
    const result = await hardDeleteAdminWithdrawnUser({
      targetUserId: deletionModal.user.id,
      confirmationEmail: normalizedEmail,
    });
    setIsModalSubmitting(false);
    setIsDeletingUserId(null);

    if (!result.ok) {
      appToast.error(result.error);
      return;
    }

    setDeletionModal(null);
    setPage(1);
    setReloadToken((prev) => prev + 1);
    appToast.success(result.message);
  };

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">탈퇴회원 관리</h1>
          <p className="text-sm text-slate-600">탈퇴 처리된 계정을 확인하고 필요 시 영구 삭제를 진행합니다.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Users className="h-4 w-4" />
            Total
          </p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{totalAll.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <ShieldCheck className="h-4 w-4" />
            Admin
          </p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{totalAdmin.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <UserCog className="h-4 w-4" />
            User
          </p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{totalUser.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex w-full items-center gap-2 sm:max-w-md">
            <select
              value={searchField}
              onChange={(event) => {
                setSearchField(event.target.value as AdminUserSearchField);
                setPage(1);
              }}
              className="h-10 shrink-0 rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-300"
            >
              <option value="name">이름</option>
              <option value="email">이메일</option>
            </select>
            <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 transition focus-within:border-slate-300">
              <Search className="h-4 w-4" />
              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder={searchField === "name" ? "이름 검색" : "이메일 검색"}
                className="w-full border-none bg-transparent text-sm text-slate-800 outline-none"
              />
              {searchInput ? (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="rounded p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  aria-label="검색어 지우기"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </label>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={roleFilter}
              onChange={(event) => {
                setRoleFilter(event.target.value as AdminUserRoleFilter);
                setPage(1);
              }}
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-300"
            >
              <option value="ALL">전체 역할</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <select
              value={String(size)}
              onChange={(event) => {
                setSize(Number(event.target.value) as (typeof PAGE_SIZE_OPTIONS)[number]);
                setPage(1);
              }}
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-300"
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}개
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border border-slate-200 text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="border-b border-r border-slate-200 bg-slate-50 px-3 py-3 text-center font-semibold">No</th>
                <th className="border-b border-r border-slate-200 bg-slate-50 px-3 py-3 text-center font-semibold">이름</th>
                <th className="border-b border-r border-slate-200 bg-slate-50 px-3 py-3 text-center font-semibold">이메일</th>
                <th className="border-b border-r border-slate-200 bg-slate-50 px-3 py-3 text-center font-semibold">현재 역할</th>
                <th className="border-b border-r border-slate-200 bg-slate-50 px-3 py-3 text-center font-semibold">내조직수</th>
                <th className="border-b border-r border-slate-200 bg-slate-50 px-3 py-3 text-center font-semibold">내프로젝트수</th>
                <th className="border-b border-r border-slate-200 bg-slate-50 px-3 py-3 text-center font-semibold">탈퇴신청일</th>
                <th className="border-b border-slate-200 bg-slate-50 px-3 py-3 text-center font-semibold">영구 삭제</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr className="animate-pulse">
                  <td colSpan={8} className="border-b border-slate-200 px-3 py-8 text-center text-slate-500">
                    탈퇴회원 목록을 불러오는 중입니다...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="border-b border-slate-200 px-3 py-8 text-center text-slate-500">
                    조회된 탈퇴회원이 없습니다.
                  </td>
                </tr>
              ) : (
                items.map((user, index) => {
                  const isDeleting = isDeletingUserId === user.id;
                  const reverseNo = total - ((page - 1) * size + index);
                  const roleBadgeClass =
                    user.role === "ADMIN"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-slate-100 text-slate-700";

                  return (
                    <tr key={user.id} className="text-slate-700 transition hover:bg-slate-50/70">
                      <td className="border-b border-r border-slate-200 px-3 py-3 text-center font-medium align-middle">{reverseNo}</td>
                      <td className="border-b border-r border-slate-200 px-3 py-3 text-center font-medium align-middle">{user.name ?? "-"}</td>
                      <td className="border-b border-r border-slate-200 px-3 py-3 text-center align-middle">{user.email}</td>
                      <td className="border-b border-r border-slate-200 px-3 py-3 text-center align-middle">
                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${roleBadgeClass}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="border-b border-r border-slate-200 px-3 py-3 text-center align-middle">{user.organization_count}개</td>
                      <td className="border-b border-r border-slate-200 px-3 py-3 text-center align-middle">{user.project_count}개</td>
                      <td className="border-b border-r border-slate-200 px-3 py-3 text-center align-middle">{formatDate(user.deleted_at)}</td>
                      <td className="border-b border-slate-200 px-3 py-3 text-center align-middle">
                        <button
                          type="button"
                          onClick={() => openDeletionModal(user)}
                          disabled={isDeleting || isLoading}
                          className="inline-flex h-8 items-center justify-center rounded-md border border-rose-200 bg-white px-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                        >
                          {isDeleting ? "삭제 중..." : "삭제"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <button
              type="button"
              onClick={() => setPage(1)}
              disabled={page <= 1 || isLoading}
              aria-label="맨앞 페이지로 이동"
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1 || isLoading}
              aria-label="이전 페이지로 이동"
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {visiblePages.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                disabled={isLoading}
                className={`h-9 min-w-9 rounded-md border px-3 text-sm transition ${
                  pageNumber === page
                    ? "border-slate-800 bg-slate-900 font-semibold text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages || isLoading}
              aria-label="다음 페이지로 이동"
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage(totalPages)}
              disabled={page >= totalPages || isLoading}
              aria-label="맨뒤 페이지로 이동"
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {deletionModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          aria-modal="true"
          role="dialog"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeDeletionModal();
            }
          }}
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-900">탈퇴회원 영구 삭제</h2>
            <p className="mt-2 text-sm text-slate-600">
              {deletionModal.user.email}의 계정을 영구 삭제하시려면 아래 이메일을 입력하고 확인하세요.
            </p>
            <label className="mt-4 flex flex-col text-sm text-slate-600">
              확인용 이메일
              <input
                type="email"
                value={deletionModal.confirmationEmail}
                onChange={(event) =>
                  setDeletionModal((prev) =>
                    prev ? { ...prev, confirmationEmail: event.target.value } : prev,
                  )
                }
                className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                disabled={isModalSubmitting}
              />
            </label>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeDeletionModal}
                disabled={isModalSubmitting}
                className="inline-flex h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100"
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmDeletion}
                disabled={isModalSubmitting}
                className="inline-flex h-9 items-center justify-center rounded-md bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-slate-200"
              >
                {isModalSubmitting ? "삭제 중..." : "영구 삭제"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
