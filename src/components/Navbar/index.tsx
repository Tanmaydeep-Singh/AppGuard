import Link from 'next/link';
import React from 'react';

function Navbar() {
  return (
    <nav className="bg-[#4A5568] p-4 text-white flex justify-between items-center">
      <div className="text-xl font-bold">AppGuard</div>
      <div className="space-x-6">
        <Link href="/" className="hover:text-gray-300">Home</Link>
        <Link href="/About" className="hover:text-gray-300">About</Link>
      </div>
    </nav>
  );
}

export default Navbar;
