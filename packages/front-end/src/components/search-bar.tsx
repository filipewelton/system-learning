import { IoSearch } from 'react-icons/io5'

interface SearchBarProps {
  placeholder?: string
  name?: string
}

export function SearchBar(props: SearchBarProps) {
  const { placeholder, name } = props

  return (
    <label
      htmlFor={`${name}-input`}
      className="xl:h-[36px] xl:pr-1 rounded-md border-[#f5f6f7] border-[1px] bg-[#f5f6f7]"
    >
      <div className="xl:w-[280px] xl:px-3 xl:py-[7px] flex items-center justify-between">
        <IoSearch className="text-[#838383] xl:text-lg" />

        <input
          type="text"
          id={`${name}-input`}
          placeholder={placeholder}
          className="bg-transparent outline-none text-[#838383] placeholder:text-[#8e8e8e]"
        />
      </div>
    </label>
  )
}
