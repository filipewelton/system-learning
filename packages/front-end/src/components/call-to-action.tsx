import { Button } from './button'

export function CallToAction() {
  return (
    <section className="w-full xl:py-20 flex justify-center items-center bg-gradient-to-r from-[#0ba360] to-[#3cba92]">
      <div className="xl:max-w-[550px] xl:px-[50px]">
        <h2 className="xl:mb-4 font-semibold xl:text-3xl xl:leading-[1.3em] text-white text-center">
          Get more great resources
        </h2>

        <p className="xl:mb-8 text-white text-center">
          Get the latest design resources from across the web. Straight to your
          inbox.
        </p>

        <div className="w-full grid grid-flow-col xl:gap-3">
          <input
            type="text"
            placeholder="Enter your email"
            className="xl:px-3 xl:py-[19px] xl:h-11 xl:min-w-[120px] bg-[#f5f6f7] xl:text-[15px] xl:leading-[1.4em] text-black rounded-lg border-[1px] border-[#e7ecf0]"
          />

          <Button>Subscribe</Button>
        </div>
      </div>
    </section>
  )
}
