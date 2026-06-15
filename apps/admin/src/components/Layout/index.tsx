import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { LayoutOuter, ContentColumn, Main } from './styledComponents';

export const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarWidth = collapsed ? 68 : 256;

  return (
    <LayoutOuter>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <ContentColumn $sidebarWidth={sidebarWidth}>
        <Header onMenuClick={() => setMobileOpen((o) => !o)} />
        <Main>
          <Outlet />
        </Main>
      </ContentColumn>
    </LayoutOuter>
  );
};
