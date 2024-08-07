declare interface Props {
  children: React.ReactNode
}

declare interface DynamicProps {
  [key: string]: unknown
}

declare interface Instructor {
  id: string
  name: string
  email: string
  avatar: string
  bio: string
}
