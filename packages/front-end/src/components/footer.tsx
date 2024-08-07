import Image from 'next/image'
import Link from 'next/link'

interface FooterLinksContainerProps extends Props {
  title: string
}

interface FooterLinkProps extends Props {
  href: string
}

function FooterLinksContainer(props: FooterLinksContainerProps) {
  const { children, title } = props

  return (
    <div className="flex flex-col">
      <h5 className="xl:mb-3 font-semibold xl:text-[13px] xl:leading-[1.5em] text-[#99a4af]">
        {title}
      </h5>

      {children}
    </div>
  )
}

function FooterLink(props: FooterLinkProps) {
  const { children, href } = props

  return (
    <Link
      href={href}
      className="xl:py-[5px] xl:text-[15px] xl:leading-[20px] text-[#626a72]"
    >
      {children}
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="w-full xl:py-6">
      <div className="w-full xl:max-w-[1230px] xl:px-[50px] xl:py-10 mx-auto">
        <div className="w-full grid grid-flow-col xl:gap-4">
          <div className="xl:max-w-[650px] flex flex-col">
            <Image
              src="logo.svg"
              alt="Logo"
              width={176}
              height={0}
              className="xl:mb-4"
            />

            <p className="xl:text-sm xl:leading-[1.4em] xl:mb-[22px] text-[#626a72]">
              <b className="text-[#1d1d1d]">Built By</b> Filipe Welton
              <br />
              <b className="text-[#1d1d1d]">Powered By</b> Gatsby
            </p>

            <p className="text-[#1d1d1d] xl:text-sm xl:leading-[1.4em]">
              © 2022 System Learning. All Rights Reserved.
            </p>
          </div>

          <FooterLinksContainer title="Website">
            <FooterLink href="">Home</FooterLink>
            <FooterLink href="">Courses</FooterLink>
            <FooterLink href="">Instructors</FooterLink>
            <FooterLink href="">Pricing</FooterLink>
          </FooterLinksContainer>

          <FooterLinksContainer title="Users">
            <FooterLink href="">Sign In</FooterLink>
            <FooterLink href="">Sign Up</FooterLink>
            <FooterLink href="">Reset Password</FooterLink>
          </FooterLinksContainer>
        </div>
      </div>
    </footer>
  )
}
