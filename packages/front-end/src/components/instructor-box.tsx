import Image from 'next/image'
import Link from 'next/link'

export function InstructorBox(props: Instructor) {
  const { bio, name } = props
  const avatar = 'default-avatar.svg'

  return (
    <Link href="">
      <div className="w-full rounded-xl overflow-hidden hover:-translate-y-2 duration-300">
        <div className="xl:mb-1.5 w-full xl:h-[448px] flex items-center justify-center rounded-xl bg-[#1d1d1d]">
          <Image src={avatar} alt="Hat" width={128} height={0} />
        </div>

        <p className="xl:mb-1.5 xl:text-xl xl:leading-[1.4em] font-medium text-black">
          {name}
        </p>

        <p className="xl:pb-1.5 xl:text-base">{bio}</p>
      </div>
    </Link>
  )
}
