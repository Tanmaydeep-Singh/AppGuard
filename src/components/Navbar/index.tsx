import Link from 'next/link'
import React from 'react'

function Navbar() {
  return (
    <nav className="bg-[#B17457] p-4 text-white flex justify-between items-center">
      <div className="text-lg font-semibold">AppGuard</div>
      <div className="space-x-4">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/About" className="hover:underline">About</Link>
      </div>
    </nav>
  )
}

export default Navbar;
