import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard | Home Service SaaS",
    description: "Manage your home service business",
};

export default function AppRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
