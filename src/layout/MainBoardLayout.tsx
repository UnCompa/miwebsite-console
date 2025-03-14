import { ReactNode } from "react";
import Navigation from "../components/home/Navigation";

export default function MainBoardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="min-h-screen bg-black text-white flex font-RedHatDisplay">
        <section>
          <div className="p-4 ">
            <h2 className="text-center text-2xl font-black">UnCompa.<span className="bg-clip-text text-transparent from-blue-500 to-teal-600 bg-gradient-to-l">Dev</span></h2>
          </div>
          <Navigation />
        </section>
        <section className="p-4 w-full">
          <div className="bg-gradient-to-tl from-zinc-950 to-neutral-900 rounded-xl h-full w-full p-4 shadow-2xl">
            {children}
          </div>
        </section>
      </main>
    </>
  )
}
