'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { Banner } from '__components/banner'
import { CallToAction } from '__components/call-to-action'
import { Footer } from '__components/footer'
import { Navigation } from '__components/navigation'
import { Pagination } from '__components/pagination'
import { InstructorBox } from '__components/instructor-box'
import { useInstructors } from '__hooks/instructors'
import { usePagination } from '__hooks/pagination'

export default function Instructors() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [page, setPage] = useState<number>()
  const { data: instructorList, refetch: updateInstructorList } = useInstructors(page)
  const { data: pagination } = usePagination('instructors')

  useEffect(() => {
    const page = searchParams.get('page')

    if (!page) {
      router.push('/instructors?page=1')
      return
    }

    setPage(parseInt(page))
  }, [updateInstructorList, router, searchParams, instructorList])

  useEffect(() => {
    updateInstructorList()
  }, [page, updateInstructorList])

  const handlePageChange = useCallback(
    (newPage: number) => {
      router.push(`/instructors?page=${newPage}`)
    },
    [router],
  )

  return (
    <div>
      <Navigation />
      <Banner>All Instructors</Banner>

      <main className="w-full xl:py-20">
        <div className="w-full xl:max-w-[1230px] xl:min-h-[30px] mx-auto xl:px-[50px]">
          <div className="w-full grid grid-cols-3 xl:gap-x-12 xl:gap-y-8">
            {instructorList?.map((instructor) => (
              <InstructorBox key={instructor.id} {...instructor} />
            ))}
          </div>
        </div>

        <Pagination
          currentPage={page || 1}
          numberOfPages={pagination}
          updatePage={handlePageChange}
        />
      </main>

      <CallToAction />
      <Footer />
    </div>
  )
}
