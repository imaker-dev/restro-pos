import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sideabar";
import Header from "./Header";

function AppLayout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Define routes where sidebar and header should be hidden
  const hiddenLayoutRoutes = [
    "/conversations/conversation",

  ];

  // Check if current route should hide layout
  const shouldHideLayout = hiddenLayoutRoutes.includes(location.pathname);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sidebar-expanded");
      return stored !== null ? stored === "true" : true;
    }
    return true;
  });

  useEffect(() => {
    if (!isMobile && !shouldHideLayout) {
      localStorage.setItem("sidebar-expanded", sidebarExpanded);
    }

    const effectiveExpanded = isMobile ? true : sidebarExpanded;

    if (effectiveExpanded && !shouldHideLayout) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded, isMobile, shouldHideLayout]);

  // If layout should be hidden, render only children
  if (shouldHideLayout) {
    return (
      <div className="h-[100dvh] overflow-hidden">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarExpanded={sidebarExpanded}
        setSidebarExpanded={setSidebarExpanded}
      />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

        <main className="grow bg-gray-100">
          <div className="p-4 sm:p-6 w-full container  max-w-10xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;