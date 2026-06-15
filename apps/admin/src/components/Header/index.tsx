import React from 'react';
import { Bell, Search, ChevronDown, Menu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { theme } from '@/UI/theme';
import {
  HeaderOuter, MenuButton, TitleBlock, PageTitle, PageSubtitle, RightActions,
  SearchBox, SearchInput, IconButton, NotificationDot,
  UserBlock, Avatar, UserName, UserDetails, UserRole,
  BreadcrumbsContainer, BreadcrumbLink, BreadcrumbActive, BreadcrumbSeparator,
} from './styledComponents';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/':              { title: 'Dashboard',          subtitle: 'Platform overview & key metrics' },
  '/stores':        { title: 'Store Management',   subtitle: 'Approve, manage & configure stores' },
  '/orders':        { title: 'Orders & Disputes',  subtitle: 'Monitor orders and resolve disputes' },
  '/customers':     { title: 'Customers',          subtitle: 'Manage customer accounts & bargaining' },
  '/delivery':      { title: 'Delivery Partners',  subtitle: 'Track DPs and delivery activity' },
  '/bargaining':    { title: 'Bargaining Center',  subtitle: 'Configure fines and review negotiations' },
  '/payments':      { title: 'Payments & Payouts', subtitle: 'Reconciliation and payout management' },
  '/notifications': { title: 'Notifications',      subtitle: 'Push, SMS and email campaigns' },
  '/support':       { title: 'Support Tickets',    subtitle: 'SLA monitoring and ticket resolution' },
  '/analytics':     { title: 'Analytics',          subtitle: 'MAU, GMV and platform performance' },
  '/settings':      { title: 'Platform Settings',  subtitle: 'Commission, fees and configurations' },
  '/shop-types':    { title: 'Shop Types',         subtitle: 'Manage and organize all store business categories across the platform' },
};

export interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const page = PAGE_TITLES[pathname] ?? PAGE_TITLES['/'];
  
  const pathSegments = pathname.split('/').filter(Boolean);

  return (
    <HeaderOuter>
      <MenuButton onClick={onMenuClick} aria-label="Toggle menu">
        <Menu size={20} />
      </MenuButton>

      <TitleBlock>
        <BreadcrumbsContainer>
          <BreadcrumbLink onClick={() => navigate('/')}>Dashboard</BreadcrumbLink>
          {pathSegments.map((segment, index) => {
            const path = '/' + pathSegments.slice(0, index + 1).join('/');
            const isLast = index === pathSegments.length - 1;
            const displayLabel = PAGE_TITLES[path]?.title || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
            return (
              <React.Fragment key={path}>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                {isLast ? (
                  <BreadcrumbActive>{displayLabel}</BreadcrumbActive>
                ) : (
                  <BreadcrumbLink onClick={() => navigate(path)}>{displayLabel}</BreadcrumbLink>
                )}
              </React.Fragment>
            );
          })}
        </BreadcrumbsContainer>
        <PageTitle>{page.title}</PageTitle>
        <PageSubtitle>{page.subtitle}</PageSubtitle>
      </TitleBlock>

      <RightActions>
        <SearchBox>
          <Search size={14} color={theme.colors.textMuted} />
          <SearchInput placeholder="Search anything..." />
        </SearchBox>

        <IconButton>
          <Bell size={16} />
          <NotificationDot />
        </IconButton>

        <UserBlock>
          <Avatar>A</Avatar>
          <UserDetails>
            <UserName>Admin</UserName>
            <UserRole>Super Admin</UserRole>
          </UserDetails>
          <ChevronDown size={14} color={theme.colors.textMuted} />
        </UserBlock>
      </RightActions>
    </HeaderOuter>
  );
};
