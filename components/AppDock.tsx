import React from 'react';
import {
  LayoutDashboard,
  PenTool,
  FolderOpen,
  Settings,
  PlusCircle,
  MessageSquare,
  MapPin,
  GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dock } from './ui/dock-two';

export function AppDock() {
  const navigate = useNavigate();

  const data = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
    },
    {
      label: 'Criar Site',
      icon: PenTool,
      path: '/create-site',
    },
    {
        label: 'Contratos',
        icon: PlusCircle,
        path: '/create-contracts',
      },
    {
      label: 'Projetos',
      icon: FolderOpen,
      path: '/my-projects',
    },
    {
      label: 'Clientes',
      icon: MapPin,
      path: '/find-clients',
    },
    {
        label: 'Abordagem',
        icon: MessageSquare,
        path: '/generate-approach',
    },
    {
      label: 'Academy',
      icon: GraduationCap,
      path: '/academy',
    },
    {
      label: 'Config',
      icon: Settings,
      path: '/settings',
    },
  ];

  const items = data.map(item => ({
    icon: item.icon,
    label: item.label,
    onClick: () => navigate(item.path)
  }));

  return (
    <div className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50 block md:hidden w-full max-w-sm px-4'>
      <Dock items={items} />
    </div>
  );
}