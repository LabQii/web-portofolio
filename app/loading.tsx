export default function Loading() {
  return (
    <div className="flex flex-col animate-pulse">
      
      <div className="w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="h-12 md:h-20 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-2xl w-3/4 mb-6"></div>
        <div className="h-6 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-lg w-1/2 mb-4"></div>
        <div className="h-6 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-lg w-1/3 mb-10"></div>
        <div className="flex gap-4">
          <div className="h-12 w-40 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-xl"></div>
          <div className="h-12 w-40 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-xl"></div>
        </div>
      </div>

      <section className="py-16 md:py-24 bg-page-gradient">
        <div className="w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
             <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-lg"></div>
             <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-xl"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-surface/50 dark:bg-slate-900/50 rounded-2xl overflow-hidden shadow-sm h-full flex flex-col relative w-full border border-slate-100 dark:border-slate-800/50 p-6">
                <div className="w-full aspect-[16/10] bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-xl mb-6"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-lg w-full mb-4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-md w-1/2 mb-6"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-md w-full mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-md w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-hero-gradient">
        <div className="w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
             <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-lg"></div>
             <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-xl"></div>
          </div>
          <div className="flex flex-col gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col md:flex-row gap-6 md:gap-10 items-start w-full border-b border-slate-100 pb-10">
                <div className="w-full md:w-[45%] flex-shrink-0 relative aspect-[16/10] bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-xl"></div>
                <div className="flex-1 w-full pt-2">
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-lg w-3/4 mb-4"></div>
                  <div className="flex gap-2 mb-6">
                    <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-full"></div>
                    <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-full"></div>
                    <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-full"></div>
                  </div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-md w-full mb-3"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-md w-full mb-3"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-md w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
