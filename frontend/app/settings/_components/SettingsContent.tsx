"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { ProfileAvatar } from "@/src/shared/ui";
import {
  changeCurrentUserPassword,
  deleteCurrentUserAccount,
  deleteCurrentUserAvatar,
  fetchCurrentUser,
  type CurrentUser,
  updateCurrentUserProfile,
  uploadCurrentUserAvatar,
} from "@/src/shared/api";

type SettingsContentProps = {
  fallbackName: string;
  fallbackEmail: string;
  fallbackImage: string | null;
  tab: "profile" | "password" | "withdrawal";
};

const allowedAvatarTypes = ["image/jpeg", "image/png", "image/webp"];
const maxAvatarFileSize = 2 * 1024 * 1024;

function isStrongPassword(password: string): boolean {
  if (password.length < 10) return false;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const categoryCount = [hasLetter, hasDigit, hasSpecial].filter(Boolean).length;
  return categoryCount >= 2;
}

export default function SettingsContent({ fallbackName, fallbackEmail, fallbackImage, tab }: SettingsContentProps) {
  const router = useRouter();
  const { update } = useSession();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [nameInput, setNameInput] = useState(fallbackName);
  const [emailInput, setEmailInput] = useState(fallbackEmail);
  const [avatarImage, setAvatarImage] = useState<string | null>(fallbackImage);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [withdrawalEmail, setWithdrawalEmail] = useState("");
  const [withdrawalPassword, setWithdrawalPassword] = useState("");

  const closeWithdrawalModal = useCallback(() => {
    if (isDeletingAccount) return;
    setIsWithdrawalModalOpen(false);
    setWithdrawalEmail("");
    setWithdrawalPassword("");
  }, [isDeletingAccount]);

  const openWithdrawalModal = useCallback(() => {
    if (!user) return;
    setWithdrawalEmail(user.email);
    setWithdrawalPassword("");
    setDeleteError("");
    setIsWithdrawalModalOpen(true);
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setProfileError("");
      setDeleteError("");
      setPasswordError("");
      const result = await fetchCurrentUser();

      if (!isMounted) return;

      if (!result.ok) {
        if (tab === "profile") {
          setProfileError(result.error);
        } else if (tab === "password") {
          setPasswordError(result.error);
        } else {
          setDeleteError(result.error);
        }
        setIsLoading(false);
        return;
      }

      setUser(result.user);
      setNameInput(result.user.name ?? "");
      setEmailInput(result.user.email);
      setAvatarImage(result.user.image ?? null);
      setIsLoading(false);
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, [tab]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isWithdrawalModalOpen && !isDeletingAccount) {
        closeWithdrawalModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeWithdrawalModal, isDeletingAccount, isWithdrawalModalOpen]);

  const isProfileDirty = useMemo(() => {
    if (!user) return false;
    return nameInput !== (user.name ?? "");
  }, [nameInput, user]);

  const onSaveProfile = async () => {
    if (!user) return;

    setIsSavingProfile(true);
    setProfileError("");

    const result = await updateCurrentUserProfile({
      name: nameInput.trim() ? nameInput.trim() : null,
    });

    if (!result.ok) {
      setProfileError(result.error);
      setIsSavingProfile(false);
      return;
    }

    setUser(result.user);
    setNameInput(result.user.name ?? "");
    setEmailInput(result.user.email);
    setAvatarImage(result.user.image ?? null);
    await update({
      user: {
        name: result.user.name,
        email: result.user.email,
        image: result.user.image,
      },
    });
    toast.success("프로필이 저장되었습니다.");
    setIsSavingProfile(false);
    router.refresh();
  };

  const confirmWithdrawal = async () => {
    if (!user || isDeletingAccount) return;

    const normalizedEmail = withdrawalEmail.trim();
    const normalizedPassword = withdrawalPassword.trim();
    if (!normalizedEmail) {
      toast.error("확인용 이메일을 입력하세요.");
      return;
    }
    if (!normalizedPassword) {
      toast.error("현재 비밀번호를 입력하세요.");
      return;
    }

    setIsDeletingAccount(true);
    setDeleteError("");

    const result = await deleteCurrentUserAccount({
      confirmation_email: normalizedEmail,
      current_password: normalizedPassword,
    });

    if (!result.ok) {
      setDeleteError(result.error);
      setIsDeletingAccount(false);
      return;
    }

    setIsDeletingAccount(false);
    closeWithdrawalModal();
    await signOut({ callbackUrl: "/" });
  };

  const onChangePassword = async () => {
    if (isChangingPassword) return;

    const trimmedCurrentPassword = currentPassword.trim();
    const trimmedNewPassword = newPassword.trim();
    const trimmedNewPasswordConfirm = newPasswordConfirm.trim();

    if (!trimmedCurrentPassword) {
      setPasswordError("현재 비밀번호를 입력하세요.");
      return;
    }
    if (!isStrongPassword(trimmedNewPassword)) {
      setPasswordError("새 비밀번호는 10자 이상이며 문자/숫자/특수문자 중 2종 이상을 포함해야 합니다.");
      return;
    }
    if (trimmedNewPassword !== trimmedNewPasswordConfirm) {
      setPasswordError("새 비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    if (trimmedCurrentPassword === trimmedNewPassword) {
      setPasswordError("현재 비밀번호와 다른 새 비밀번호를 입력하세요.");
      return;
    }

    setIsChangingPassword(true);
    setPasswordError("");

    const result = await changeCurrentUserPassword({
      current_password: trimmedCurrentPassword,
      new_password: trimmedNewPassword,
    });

    if (!result.ok) {
      setPasswordError(result.error);
      setIsChangingPassword(false);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordConfirm("");
    toast.success(result.message);
    setIsChangingPassword(false);
    await signOut({ callbackUrl: "/login?reason=password-changed" });
  };

  const onUploadAvatar = async (file: File) => {
    if (!allowedAvatarTypes.includes(file.type)) {
      setProfileError("JPG, PNG, WebP 파일만 업로드할 수 있습니다.");
      return;
    }
    if (file.size > maxAvatarFileSize) {
      setProfileError("프로필 썸네일은 2MB 이하만 업로드할 수 있습니다.");
      return;
    }

    setIsUploadingAvatar(true);
    setProfileError("");
    const result = await uploadCurrentUserAvatar(file);

    if (!result.ok) {
      setProfileError(result.error);
      setIsUploadingAvatar(false);
      return;
    }

    setUser(result.user);
    setAvatarImage(result.user.image ?? null);
    await update({
      user: {
        image: result.user.image,
      },
    });
    toast.success("프로필 썸네일을 저장했습니다.");
    setIsUploadingAvatar(false);
    router.refresh();
  };

  const onDeleteAvatar = async () => {
    if (!user || !avatarImage) return;

    setIsDeletingAvatar(true);
    setProfileError("");
    const result = await deleteCurrentUserAvatar();

    if (!result.ok) {
      setProfileError(result.error);
      setIsDeletingAvatar(false);
      return;
    }

    setUser(result.user);
    setAvatarImage(result.user.image ?? null);
    await update({
      user: {
        image: result.user.image,
      },
    });
    toast.success("프로필 썸네일을 삭제했습니다.");
    setIsDeletingAvatar(false);
    router.refresh();
  };

  return (
    <section className="mx-auto w-full max-w-3xl">
      {tab === "profile" ? (
        <>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">프로필정보</h1>
          <p className="mt-2 text-lg text-slate-600">이름 수정과 프로필 썸네일 등록/삭제를 할 수 있으며 이메일은 읽기 전용입니다.</p>
          {profileError ? <p className="mt-6 text-sm text-rose-600">{profileError}</p> : null}

          <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="grid grid-cols-[320px_1fr] border-b border-slate-200 px-4 py-4">
              <p className="text-sm font-semibold text-slate-700">프로필 썸네일</p>
              <div className="flex items-center gap-3">
                <ProfileAvatar
                  name={nameInput.trim() || fallbackName}
                  image={avatarImage}
                  size={56}
                  className="h-14 w-14 border-slate-300"
                  iconClassName="h-6 w-6"
                />
                <label className="inline-flex h-9 cursor-pointer items-center rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={isUploadingAvatar || isDeletingAvatar || isLoading}
                    onChange={(event) => {
                      const selectedFile = event.target.files?.[0];
                      if (selectedFile) {
                        void onUploadAvatar(selectedFile);
                      }
                      event.currentTarget.value = "";
                    }}
                  />
                  {isUploadingAvatar ? "업로드 중..." : "파일 선택"}
                </label>
                <button
                  type="button"
                  onClick={onDeleteAvatar}
                  disabled={!avatarImage || isUploadingAvatar || isDeletingAvatar || isLoading}
                  className="inline-flex h-9 items-center rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  {isDeletingAvatar ? "삭제 중..." : "삭제"}
                </button>
                <p className="text-xs text-slate-500">JPG/PNG/WebP, 최대 2MB</p>
              </div>
            </div>
            <div className="grid grid-cols-[320px_1fr] border-b border-slate-200 px-4 py-4">
              <p className="text-sm font-semibold text-slate-700">이름 (name)</p>
              <input
                type="text"
                value={nameInput}
                onChange={(event) => setNameInput(event.target.value)}
                placeholder="이름"
                disabled={isLoading}
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-primary disabled:bg-slate-50"
              />
            </div>
            <div className="grid grid-cols-[320px_1fr] border-b border-slate-200 px-4 py-4">
              <p className="text-sm font-semibold text-slate-700">이메일 (email)</p>
              <input
                type="email"
                value={emailInput}
                placeholder="이메일"
                readOnly
                className="h-10 rounded-md border border-slate-300 bg-slate-50 px-3 text-sm text-slate-600 outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 px-4 py-3">
              <button
                type="button"
                onClick={() => {
                  if (!user) return;
                  setNameInput(user.name ?? "");
                  setEmailInput(user.email);
                  setProfileError("");
                }}
                disabled={!isProfileDirty || isSavingProfile || isLoading}
                className="inline-flex h-8 items-center rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
              >
                취소
              </button>
              <button
                type="button"
                onClick={onSaveProfile}
                disabled={!isProfileDirty || isSavingProfile || isLoading}
                className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                {isSavingProfile ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </>
      ) : tab === "password" ? (
        <>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">비밀번호변경</h1>
          <p className="mt-2 text-lg text-slate-600">현재 비밀번호를 확인한 뒤 새 비밀번호로 변경합니다.</p>
          {passwordError ? <p className="mt-6 text-sm text-rose-600">{passwordError}</p> : null}

          <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="grid grid-cols-[320px_1fr] border-b border-slate-200 px-4 py-4">
              <p className="text-sm font-semibold text-slate-700">현재 비밀번호</p>
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="현재 비밀번호"
                autoComplete="current-password"
                disabled={isChangingPassword || isLoading}
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-primary disabled:bg-slate-50"
              />
            </div>
            <div className="grid grid-cols-[320px_1fr] border-b border-slate-200 px-4 py-4">
              <p className="text-sm font-semibold text-slate-700">새 비밀번호</p>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="새 비밀번호"
                autoComplete="new-password"
                disabled={isChangingPassword || isLoading}
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-primary disabled:bg-slate-50"
              />
            </div>
            <div className="grid grid-cols-[320px_1fr] border-b border-slate-200 px-4 py-4">
              <p className="text-sm font-semibold text-slate-700">새 비밀번호 확인</p>
              <input
                type="password"
                value={newPasswordConfirm}
                onChange={(event) => setNewPasswordConfirm(event.target.value)}
                placeholder="새 비밀번호 확인"
                autoComplete="new-password"
                disabled={isChangingPassword || isLoading}
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-primary disabled:bg-slate-50"
              />
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-xs text-slate-500">10자 이상, 문자/숫자/특수문자 중 2종 이상을 포함해야 합니다.</p>
              <button
                type="button"
                onClick={onChangePassword}
                disabled={isChangingPassword || isLoading}
                className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                {isChangingPassword ? "변경 중..." : "비밀번호 변경"}
              </button>
            </div>
          </section>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">회원탈퇴</h1>
          <p className="mt-2 text-lg text-slate-600">탈퇴 신청 시 계정은 소프트 삭제 처리됩니다.</p>
          {deleteError ? <p className="mt-6 text-sm text-rose-600">{deleteError}</p> : null}

          <section className="mt-8 rounded-xl border border-rose-200 bg-rose-50/40 px-4 py-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md bg-rose-600/90 text-white">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="text-xl font-semibold text-slate-900">계정 삭제 요청</p>
                <p className="mt-2 text-base leading-7 text-slate-600">
                  탈퇴 신청은 되돌릴 수 없습니다. 계정은 소프트 삭제 처리되며, 탈퇴 이력은 별도 보관됩니다.
                </p>
                <button
                  type="button"
                  onClick={openWithdrawalModal}
                  disabled={isDeletingAccount || isLoading}
                  className="mt-4 inline-flex h-9 items-center rounded-md border border-rose-300 bg-white px-3.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  탈퇴 신청
                </button>
              </div>
            </div>
          </section>
        </>
      )}
      {isWithdrawalModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          role="dialog"
          aria-modal="true"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeWithdrawalModal();
            }
          }}
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">탈퇴 신청 확인</h2>
                <p className="text-sm text-slate-500">입력한 이메일과 비밀번호로 탈퇴 신청을 확인합니다.</p>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              {deleteError ? <p className="text-xs text-rose-600">{deleteError}</p> : null}
              <label className="flex flex-col text-sm text-slate-600">
                확인용 이메일
                <input
                  type="email"
                  value={withdrawalEmail}
                  onChange={(event) => setWithdrawalEmail(event.target.value)}
                  disabled={isDeletingAccount}
                  className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                />
              </label>
              <label className="flex flex-col text-sm text-slate-600">
                현재 비밀번호
                <input
                  type="password"
                  value={withdrawalPassword}
                  onChange={(event) => setWithdrawalPassword(event.target.value)}
                  disabled={isDeletingAccount}
                  className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                />
              </label>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeWithdrawalModal}
                disabled={isDeletingAccount}
                className="inline-flex h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100"
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmWithdrawal}
                disabled={isDeletingAccount}
                className="inline-flex h-9 items-center justify-center rounded-md bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-slate-200"
              >
                {isDeletingAccount ? "삭제 중..." : "탈퇴 신청 계속"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
