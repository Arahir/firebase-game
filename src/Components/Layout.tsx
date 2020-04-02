import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Header from './Header';

interface LayoutProps {
  children?: ReactNode;
}

const Page = styled.div`
  background: teal;
  height: 100vh;
`;

const Layout: React.FC<LayoutProps> = ({ children, ...props }) => {
  return (
    <Page>
      <Header />
      {children}
    </Page>
  );
};

export default Layout;
