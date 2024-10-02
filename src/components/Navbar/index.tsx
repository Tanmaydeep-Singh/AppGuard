import Link from 'next/link';
import React from 'react';

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-[#2D3748] to-[#4A5568] p-4 text-white shadow-lg flex justify-between items-center">
      <div className="text-2xl font-bold ">AppGuard</div>
      <div className="space-x-6">
        <Link href="/" className="hover:text-gray-300 transition duration-300">Home</Link>
        <Link href="/About" className="hover:text-gray-300 transition duration-300">About</Link>
      </div>
    </nav>
  );
}

export default Navbar;
