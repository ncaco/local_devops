export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="marketing-shell">{children}</div>;
}
