// components/Layout.tsx
import React, { ReactNode } from 'react';
import Navbar from './Navbar';


interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

  return (
   <main>
    <Navbar/>     
      {children}

    </main>
  );
};

export default Layout;