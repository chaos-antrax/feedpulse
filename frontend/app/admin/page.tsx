import LoginForm from "@/components/LoginForm"

const page = () => {
  return (
    <div className="grid p-4 xl:grid-cols-10">
      <div className="min-h-xl col-span-3 h-[96.66vh]">
        <div className="flex items-center justify-center xl:hidden">
          <div className="absolute top-14 flex h-28 w-28 items-center justify-center rounded-full bg-primary p-4 text-6xl text-white dark:bg-muted-foreground">
            FP
          </div>
        </div>
        <LoginForm />
      </div>
      <div className="col-span-7 hidden flex-col justify-center space-y-14 p-10 pl-24 xl:flex">
        <h1 className="text-8xl font-semibold text-primary xl:flex dark:text-muted-foreground">
          FeedPulse <br />
          Admin Portal
        </h1>
        <p className="text-2xl">
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
          faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
          pretium tellus duis convallis. Tempus leo eu aenean sed diam urna
          tempor.
        </p>
      </div>
    </div>
  )
}

export default page
