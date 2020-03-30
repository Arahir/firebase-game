import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Header from './Header';

const Page = styled.div`
  height: 100vh;
  background-color: #333;
  font-family: 'Work Sans', sans-serif;
`;

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, ...props }) => {
  return (
    <Page>
      <Header />
      {children}
    </Page>
  );
};

export default Layout;
