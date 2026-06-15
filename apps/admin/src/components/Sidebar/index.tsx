import React, { useState } from 'react';
import {
  LayoutDashboard, Store, Tag, FolderOpen, ShoppingBag,
  Users, Bike, Handshake, CreditCard, HeadphonesIcon,
  LogOut, ChevronLeft, ChevronRight, Shield, BookOpen, ArrowRight,
} from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../Auth/Providers/AuthProvider';
import { Modal } from '../Modal';
import { Button } from '../Button';
import {
  SidebarOuter, SidebarBackdrop, LogoBlock, LogoMark, LogoTitle, LogoSubtitle,
  Nav, NavLinkItem, ActiveIndicator, NavLabel, IconSlot, BottomBlock, BottomButton,
  UserProfileCard, UserAvatar, UserInfo, UserProfileName, UserEmail,
  NavSectionTitle, HelpCard, HelpCardTitle, HelpCardSubtitle, HelpCardButton,
} from './styledComponents';

const NAV_SECTIONS = [
  {
    title: 'Main',
    items: [
      { to: '/',              icon: LayoutDashboard, label: 'Dashboard' },
    ]
  },
  {
    title: 'Catalog',
    items: [
      { to: '/stores',        icon: Store,           label: 'Stores' },
      { to: '/shop-types',    icon: Tag,             label: 'Shop Types' },
      { to: '/categories',   icon: FolderOpen,      label: 'Categories' },
    ]
  },
  {
    title: 'Sales',
    items: [
      { to: '/orders',        icon: ShoppingBag,     label: 'Orders' },
    ]
  },
  {
    title: 'Users',
    items: [
      { to: '/customers',     icon: Users,           label: 'Customers' },
      { to: '/delivery',      icon: Bike,            label: 'Delivery Partners' },
    ]
  },
  {
    title: 'Settings',
    items: [
      { to: '/bargaining',    icon: Handshake,       label: 'Bargaining' },
      { to: '/payments',      icon: CreditCard,      label: 'Payments' },
      { to: '/support',       icon: HeadphonesIcon,  label: 'Support' },
    ]
  }
];

export interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogoutConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await authStore.logout();
      setConfirmOpen(false);
      navigate('/login', { replace: true });
    } catch {
      setError('Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SidebarBackdrop $visible={mobileOpen} onClick={onMobileClose} />
      <SidebarOuter $collapsed={collapsed} $mobileOpen={mobileOpen}>
        <LogoBlock $collapsed={collapsed}>
          <LogoMark $collapsed={collapsed}>
            <Shield size={18} strokeWidth={2.5} />
          </LogoMark>
          {!collapsed && (
            <div>
              <LogoTitle>HyperAdmin</LogoTitle>
              <LogoSubtitle>Super Admin Panel</LogoSubtitle>
            </div>
          )}
        </LogoBlock>

        <Nav>
          {NAV_SECTIONS.map(section => (
            <React.Fragment key={section.title}>
              <NavSectionTitle $collapsed={collapsed}>{section.title}</NavSectionTitle>
              {section.items.map(({ to, icon: Icon, label }) => {
                const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
                return (
                  <NavLink key={to} to={to} style={{ textDecoration: 'none' }} onClick={onMobileClose}>
                    <NavLinkItem $active={active} $collapsed={collapsed}>
                      {active && <ActiveIndicator />}
                      <IconSlot><Icon size={17} strokeWidth={active ? 2.5 : 2} /></IconSlot>
                      {!collapsed && <NavLabel>{label}</NavLabel>}
                    </NavLinkItem>
                  </NavLink>
                );
              })}
            </React.Fragment>
          ))}
          {!collapsed && (
            <HelpCard style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <BookOpen size={15} color="#10B981" />
                <HelpCardTitle>Need help?</HelpCardTitle>
              </div>
              <HelpCardSubtitle>Check our documentation and user guides.</HelpCardSubtitle>
              <HelpCardButton onClick={() => window.open('https://docs.hyperadmin.com', '_blank')}>
                Documentation
                <ArrowRight size={11} />
              </HelpCardButton>
            </HelpCard>
          )}
        </Nav>

        <BottomBlock>

          {collapsed ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <UserAvatar>A</UserAvatar>
            </div>
          ) : (
            <UserProfileCard>
              <UserAvatar>A</UserAvatar>
              <UserInfo>
                <UserProfileName>Admin User</UserProfileName>
                <UserEmail>admin@hyperadmin.com</UserEmail>
              </UserInfo>
            </UserProfileCard>
          )}

          <BottomButton $collapsed={collapsed} onClick={onToggle}>
            {collapsed ? <ChevronRight size={17} /> : <><ChevronLeft size={17} /><span>Collapse</span></>}
          </BottomButton>
          <BottomButton $collapsed={collapsed} $danger onClick={() => setConfirmOpen(true)}>
            <LogOut size={17} />
            {!collapsed && <span>Logout</span>}
          </BottomButton>
        </BottomBlock>
      </SidebarOuter>

      <Modal
        open={confirmOpen}
        onClose={() => !loading && setConfirmOpen(false)}
        title="Confirm Logout"
        width={380}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>
            Are you sure you want to log out?
          </p>
          {error && (
            <p style={{ fontSize: 13, color: '#EF4444', margin: 0 }}>{error}</p>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button
              variant="outline"
              size="md"
              onClick={() => setConfirmOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              loading={loading}
              onClick={handleLogoutConfirm}
            >
              Logout
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
