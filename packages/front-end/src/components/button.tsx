import { MouseEventHandler } from 'react'

interface ButtonProps extends Props {
  fill?: boolean
  onClick?: (event: MouseEventHandler<HTMLButtonElement>) => void
}

export function Button(props: ButtonProps) {
  const { children } = props

  const classes =
    'xl:mx-1 xl:px-5 xl:py-1.5 font-medium xl:text-base xl:leading-6 rounded-lg bg-black text-white hover:bg-[#33383f] duration-200'

  const dynamicProps: DynamicProps = { className: classes }

  if ('onClick' in props) {
    dynamicProps['onclick'] = props.onClick!
  }

  if ('fill' in props) {
    dynamicProps['className'] = `${classes} w-full xl:py-3`
  }

  return <button {...dynamicProps}>{children}</button>
}
