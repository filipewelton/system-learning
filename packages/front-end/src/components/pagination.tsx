interface PaginationProps {
  numberOfPages: number
  currentPage: number
  updatePage: (page: number) => void
}

export function Pagination(props: PaginationProps) {
  const { currentPage, numberOfPages, updatePage } = props
  const array = [...new Array(numberOfPages)].map((_, index) => index + 1)

  return (
    <div className="w-full flex justify-center xl:mt-10">
      <div className="join">
        {array.map((val) => {
          if (val === currentPage) {
            return (
              <button
                key={val}
                className="join-item btn bg-[#0ba360] hover:bg-[#0ba360] text-white"
              >
                {val}
              </button>
            )
          }

          return (
            <button
              key={val}
              className="join-item btn bg-[#1d1d1d] text-white"
              onClick={() => updatePage(val)}
            >
              {val}
            </button>
          )
        })}
      </div>
    </div>
  )
}
