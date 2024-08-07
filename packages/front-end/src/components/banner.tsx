export function Banner(props: Props) {
  return (
    <section className="w-full xl:pt-24 xl:pb-8 bg-gradient-to-r from-[#0ba360] to-[#3cba92]">
      <h1 className="mx-auto w-full xl:max-w-[1230px] xl:min-h-[30px] xl:px-[50px] xl:pb-4 font-semibold xl:text-[64px] xl:leading-[1.15em] text-white">
        {props.children}
      </h1>
    </section>
  )
}
