import Header from "@/components/header"
import ShaderBackground from "@/components/shader-background"
import Footer from "@/components/footer"

export default function PortfolioShell({
  children,
  className = "",
  fullHeight = false,
  hideFooter = false,
  noScroll = false
}: {
  children: React.ReactNode
  className?: string
  fullHeight?: boolean
  hideFooter?: boolean
  noScroll?: boolean
}) {
  const shouldHideFooter = hideFooter || noScroll

  return (
    <ShaderBackground>
      <div
        className={`flex flex-col justify-between ${
          noScroll
            ? "h-screen max-h-screen overflow-hidden"
            : "min-h-screen"
        }`}
      >
        <Header />
        <main
          className={`relative z-10 mx-auto w-full max-w-7xl flex-1 px-6 md:px-10 ${
            shouldHideFooter ? "pb-6" : "pb-16"
          } ${fullHeight || noScroll ? "flex items-center" : ""} ${className}`}
        >
          {children}
        </main>
        {!shouldHideFooter && <Footer />}
      </div>
    </ShaderBackground>
  )
}
