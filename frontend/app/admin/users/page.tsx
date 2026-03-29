"use client";

import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, KeyRound, Search, ShieldCheck, UserCog, Users, X } from "lucide-react";
import {
  fetchAdminUsers,
  updateAdminUserPassword,
  updateAdminUserRole,
  type AdminUser,
  type AdminUserRoleFilter,
  type AdminUserSearchField,
} from "@/src/shared/api/admin-users";
import { appToast } from "@/src/shared/lib";
import type { UserRole } from "@/src/entities/user/model/types";

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

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const [items, setItems] = useState<AdminUser[]>([]);
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
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [passwordTargetUser, setPasswordTargetUser] = useState<AdminUser | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminCurrentPassword, setAdminCurrentPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

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

    const loadUsers = async () => {
      setIsLoading(true);
      const result = await fetchAdminUsers({ page, size, search, searchField, role: roleFilter });
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

    void loadUsers();
    return () => {
      isMounted = false;
    };
  }, [page, roleFilter, search, searchField, size]);

  const onRoleChange = async (user: AdminUser, role: UserRole) => {
    if (user.role === role) return;

    const confirmed = window.confirm(`${user.email} 사용자의 권한을 ${role}(으)로 변경하시겠습니까?`);
    if (!confirmed) {
      return;
    }

    setUpdatingUserId(user.id);
    const result = await updateAdminUserRole({ userId: user.id, role });
    setUpdatingUserId(null);

    if (!result.ok) {
      appToast.error(result.error);
      return;
    }

    setItems((prev) => prev.map((item) => (item.id === user.id ? { ...item, role: result.user.role } : item)));
    const prevRole = user.role;
    const nextRole = result.user.role;
    if (prevRole !== nextRole) {
      if (prevRole === "ADMIN" && nextRole === "USER") {
        setTotalAdmin((prev) => Math.max(0, prev - 1));
        setTotalUser((prev) => prev + 1);
      } else if (prevRole === "USER" && nextRole === "ADMIN") {
        setTotalUser((prev) => Math.max(0, prev - 1));
        setTotalAdmin((prev) => prev + 1);
      }
    }
    appToast.success("사용자 권한이 변경되었습니다.");
  };

  const openPasswordModal = (user: AdminUser) => {
    setPasswordTargetUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setAdminCurrentPassword("");
  };

  const closePasswordModal = () => {
    if (isUpdatingPassword) return;
    setPasswordTargetUser(null);
    setNewPassword("");
    setConfirmPassword("");
    setAdminCurrentPassword("");
  };

  const onPasswordUpdate = async () => {
    if (!passwordTargetUser) return;

    const normalizedNewPassword = newPassword.trim();
    const normalizedConfirmPassword = confirmPassword.trim();

    if (!normalizedNewPassword || !normalizedConfirmPassword || !adminCurrentPassword.trim()) {
      appToast.error("신규 비밀번호, 비밀번호 확인, 관리자 비밀번호를 모두 입력하세요.");
      return;
    }

    if (normalizedNewPassword.length < 8) {
      appToast.error("신규 비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    if (normalizedNewPassword !== normalizedConfirmPassword) {
      appToast.error("신규 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    setIsUpdatingPassword(true);
    const result = await updateAdminUserPassword({
      userId: passwordTargetUser.id,
      adminCurrentPassword: adminCurrentPassword.trim(),
      newPassword: normalizedNewPassword,
    });
    setIsUpdatingPassword(false);

    if (!result.ok) {
      appToast.error(result.error);
      return;
    }

    appToast.success("사용자 비밀번호가 변경되었습니다.");
    closePasswordModal();
  };

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">사용자 관리</h1>
          <p className="text-sm text-slate-600">사용자 조회, 검색, 권한 변경을 한 화면에서 관리합니다.</p>
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
                <th className="border-b border-r border-slate-200 bg-slate-50 px-3 py-3 text-center font-semibold">변경</th>
                <th className="border-b border-r border-slate-200 bg-slate-50 px-3 py-3 text-center font-semibold">내조직수</th>
                <th className="border-b border-r border-slate-200 bg-slate-50 px-3 py-3 text-center font-semibold">내프로젝트수</th>
                <th className="border-b border-r border-slate-200 bg-slate-50 px-3 py-3 text-center font-semibold">가입일</th>
                <th className="border-b border-r border-slate-200 bg-slate-50 px-3 py-3 text-center font-semibold">비고</th>
                <th className="border-b border-slate-200 bg-slate-50 px-3 py-3 text-center font-semibold">비밀번호</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr className="animate-pulse">
                  <td colSpan={10} className="border-b border-slate-200 px-3 py-8 text-center text-slate-500">
                    사용자 목록을 불러오는 중입니다...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={10} className="border-b border-slate-200 px-3 py-8 text-center text-slate-500">
                    조회된 사용자가 없습니다.
                  </td>
                </tr>
              ) : (
                items.map((user, index) => {
                  const isSelf = currentUserId === user.id;
                  const isUpdating = updatingUserId === user.id;
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
                      <td className="border-b border-r border-slate-200 px-3 py-3 text-center align-middle">
                        <select
                          value={user.role}
                          disabled={isSelf || isUpdating}
                          onChange={(event) => void onRoleChange(user, event.target.value as UserRole)}
                          className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100"
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td className="border-b border-r border-slate-200 px-3 py-3 text-center align-middle">{user.organization_count}개</td>
                      <td className="border-b border-r border-slate-200 px-3 py-3 text-center align-middle">{user.project_count}개</td>
                      <td className="border-b border-r border-slate-200 px-3 py-3 text-center align-middle">{formatDate(user.created_at)}</td>
                      <td className="border-b border-r border-slate-200 px-3 py-3 text-center text-xs text-slate-500 align-middle">
                        {isSelf ? "본인 변경 불가" : isUpdating ? "변경 중..." : "-"}
                      </td>
                      <td className="border-b border-slate-200 px-3 py-3 text-center align-middle">
                        <button
                          type="button"
                          onClick={() => openPasswordModal(user)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                          aria-label={`${user.email} 비밀번호 변경`}
                        >
                          <KeyRound className="h-4 w-4" />
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

      {passwordTargetUser ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePasswordModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-user-password-modal-title"
            className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 id="admin-user-password-modal-title" className="text-lg font-semibold text-slate-900">
                비밀번호 변경
              </h2>
              <button
                type="button"
                onClick={closePasswordModal}
                className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="비밀번호 변경 모달 닫기"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-4">
              <p className="text-sm text-slate-600">{passwordTargetUser.email}</p>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">신규 비밀번호</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">비밀번호 확인</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">관리자 비밀번호 확인</label>
                <input
                  type="password"
                  value={adminCurrentPassword}
                  onChange={(event) => setAdminCurrentPassword(event.target.value)}
                  className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={closePasswordModal}
                disabled={isUpdatingPassword}
                className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => void onPasswordUpdate()}
                disabled={isUpdatingPassword}
                className="inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
              >
                {isUpdatingPassword ? "변경 중..." : "변경"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
