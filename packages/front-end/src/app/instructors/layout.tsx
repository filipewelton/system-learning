import { Metadata } from 'next'

import { InstructorProvider } from '__hooks/instructors'
import { PaginationProvider } from '__hooks/pagination'

export const metadata: Metadata = {
  title: 'Instructors',
  description: 'Instructor listing',
}

export default function Layout(props: Props) {
  return (
    <InstructorProvider>
      <PaginationProvider>{props.children}</PaginationProvider>
    </InstructorProvider>
  )
}
