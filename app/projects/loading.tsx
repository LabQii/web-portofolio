export default function ProjectsLoading() {
  return (
    <div className="min-h-screen pb-24 bg-page-gradient">
      
      <div className="border-b border-slate-100 dark:border-slate-800/50 py-16 bg-hero-gradient">
        <div className="w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-[768px]">
            <div className="h-14 w-64 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-xl mb-6"></div>
            <div className="h-6 w-full bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-lg mb-2"></div>
            <div className="h-6 w-4/5 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-lg"></div>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 mt-12">
        
        <div className="flex flex-wrap gap-2 mb-12 border-b border-slate-200 pb-1">
          {[1, 2, 3, 4, 5].map((i) => (
             <div key={i} className="h-10 w-24 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-t-lg"></div>
          ))}
        </div>

        <div className="flex flex-col gap-8 bg-surface/50 dark:bg-slate-900/40 p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/50">
          {[1, 2, 3, 4].map((i) => (
             <div key={i} className="flex flex-col md:flex-row gap-6 md:gap-10 items-start w-full border-b border-slate-100 pb-10 pt-4">
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
    </div>
  );
}
