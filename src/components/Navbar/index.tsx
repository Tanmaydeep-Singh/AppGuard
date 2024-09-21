import Link from 'next/link'
import React from 'react'

function Navbar() {
  return (<>
    <div>Navbar</div>
    <Link href={'/'} >Home</Link>
    <Link href={'/About'} >About</Link>

    </>
  )
}

export default Navbar