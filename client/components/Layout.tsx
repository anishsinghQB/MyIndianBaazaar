import { ReactNode } from "react";
import Header from "./Header";
import CategoryNavbar from "./CategoryNavbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CategoryNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
