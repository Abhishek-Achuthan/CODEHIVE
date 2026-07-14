import Footer from "../../../shared/ui/Footer";
import Header from "../../../shared/ui/Header";
import Sidebar from "./SideBar";
export function QuesDetailPageSkelton() {
    
return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 w-full max-w-7xl p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="mb-8 flex gap-6">
                <div className="flex flex-col items-center gap-4 py-2 opacity-50">
                  <div className="w-8 h-8 rounded-full border border-zinc-800 animate-pulse bg-[#121214]" />
                  <div className="w-6 h-5 rounded bg-zinc-800 animate-pulse" />
                  <div className="w-8 h-8 rounded-full border border-zinc-800 animate-pulse bg-[#121214]" />
                  <div className="w-8 h-8 rounded-full border border-zinc-800 animate-pulse bg-[#121214] mt-2" />
                </div>

                <div className="flex-1">
                  <div className="h-8 w-3/4 bg-zinc-800/70 rounded mb-4 animate-pulse" />
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-800/50">
                    <div className="h-4 w-24 bg-zinc-800/70 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-zinc-800/70 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-zinc-800/70 rounded animate-pulse" />
                  </div>

                  <div className="mb-6 space-y-3">
                    <div className="h-3 w-full bg-zinc-800/50 rounded animate-pulse" />
                    <div className="h-3 w-full bg-zinc-800/50 rounded animate-pulse" />
                    <div className="h-3 w-5/6 bg-zinc-800/50 rounded animate-pulse" />
                    <div className="h-3 w-2/3 bg-zinc-800/50 rounded animate-pulse" />
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-6 w-16 rounded-md bg-[#121214] border border-zinc-800 animate-pulse"
                      />
                    ))}
                  </div>

                  <div className="flex justify-between items-end mt-8 pt-4 border-t border-zinc-800/50">
                    <div className="flex gap-2">
                       <div className="h-8 w-16 bg-[#121214] rounded-md border border-zinc-800 animate-pulse" />
                       <div className="h-8 w-16 bg-[#121214] rounded-md border border-zinc-800 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800/70 animate-pulse" />
                      <div className="space-y-1">
                        <div className="h-3 w-24 bg-zinc-800/70 rounded animate-pulse" />
                        <div className="h-3 w-20 bg-zinc-800/70 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8 mt-12">
                <div className="h-6 w-32 bg-zinc-800/70 rounded mb-4 animate-pulse" />
                <div className="h-[250px] w-full bg-[#121214] border border-zinc-800 rounded-xl animate-pulse" />
              </div>
            </div>

            <aside className="w-full lg:w-80 shrink-0">
              <div className="sticky top-6">
                <div className="h-4 w-32 bg-zinc-800/70 rounded mb-4 animate-pulse" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-[#121214] border border-zinc-800"
                    >
                      <div className="h-4 w-3/4 bg-zinc-800/70 rounded mb-3 animate-pulse" />
                      <div className="h-3 w-1/2 bg-zinc-800/70 rounded mb-3 animate-pulse" />
                      <div className="flex gap-2 mt-2">
                        <div className="h-4 w-12 bg-zinc-800/50 rounded animate-pulse" />
                        <div className="h-4 w-12 bg-zinc-800/50 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

