// components/Layout.tsx
import React, { ReactNode } from 'react';


interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

  return (
    <main className='bg-gradient-to-r from-black via-gray-900 to-black shadow-md backdrop-blur-md bg-opacity-30 '>


     
      {children}

    </main>
  );
};

export default Layout;