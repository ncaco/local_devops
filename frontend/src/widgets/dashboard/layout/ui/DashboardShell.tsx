import AccountShell from "@/src/widgets/account/layout/ui/AccountShell";

type DashboardShellProps = {
  children: React.ReactNode;
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
  userRole?: string | null;
};

export default function DashboardShell({ children, userName, userEmail, userImage, userRole }: DashboardShellProps) {
  return (
    <AccountShell userName={userName} userEmail={userEmail} userImage={userImage} userRole={userRole}>
      {children}
    </AccountShell>
  );
}
