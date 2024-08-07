import Image from 'next/image'
import Link from 'next/link'

import { SearchBar } from './search-bar'
import { Button } from './button'

interface NavLinkProps extends Props {
  href: string
}

function NavLink(props: NavLinkProps) {
  const { children, href } = props

  return (
    <Link
      href={href}
      className="text-black xl:mx-1 xl:px-2 xl:py-1.5 font-medium xl:text-base xl:leading-6"
    >
      {children}
    </Link>
  )
}

export function Navigation() {
  return (
    <header className="w-full flex items-center justify-between sticky bg-white">
      <div className="flex items-center justify-between m-auto xl:px-[50px] xl:py-[10px] xl:h-[70px] w-full xl:max-w-[1230px]">
        <Link href="/">
          <Image src="logo.svg" alt="Logo" width={176} height={0} />
        </Link>

        <div className="w-full flex items-center justify-between xl:ml-6">
          <SearchBar placeholder="Search by instructors" />

          <div className="flex items-center xl:gap-x-1.5">
            <NavLink href="">Courses</NavLink>
            <NavLink href="/instructors?page=1">Instructors</NavLink>
            <Button>Sign Up</Button>
          </div>
        </div>
      </div>
    </header>
  )
}
