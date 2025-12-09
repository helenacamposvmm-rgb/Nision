import React, { useState } from "react";
import { 
  LayoutDashboard, 
  PenTool, 
  Settings,
  FolderOpen,
  FileText,
  MapPin,
  MessageSquare,
  GraduationCap
} from "lucide-react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/Sidebar";
import { cn } from "../lib/utils";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { AppDock } from "./AppDock";
import { ThemeToggle } from "./ui/theme-toggle";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Criar Site",
      href: "/create-site",
      icon: <PenTool className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Meus Projetos",
      href: "/my-projects",
      icon: <FolderOpen className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Criar Contratos",
      href: "/create-contracts",
      icon: <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Encontrar Clientes",
      href: "/find-clients",
      icon: <MapPin className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Gerar Abordagem",
      href: "/generate-approach",
      icon: <MessageSquare className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Academy AI",
      href: "/academy",
      icon: <GraduationCap className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Configurações",
      href: "/settings",
      icon: <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-100 dark:bg-background w-full flex-1 mx-auto border-neutral-200 dark:border-neutral-700 overflow-hidden h-screen font-sans text-foreground"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
             <SidebarLink
              link={{
                label: "Admin User",
                href: "/settings",
                icon: (
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex flex-1 overflow-auto relative">
        <div className="absolute top-6 right-6 z-50">
           <ThemeToggle />
        </div>
        <div className="p-4 md:p-10 w-full max-w-7xl mx-auto pb-32">
            {children}
        </div>
        {/* Dock at the bottom - Visible only on mobile */}
        <AppDock />
      </main>
    </div>
  );
};

export const Logo = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-6 w-6 bg-gradient-to-tr from-primary to-blue-600 rounded-md flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold text-black dark:text-white whitespace-pre"
      >
        PROMPT PRONTO
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-6 w-6 bg-gradient-to-tr from-primary to-blue-600 rounded-md flex-shrink-0" />
    </Link>
  );
};

export default Layout;