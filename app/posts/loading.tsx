export default function PostsLoading() {
  return (
    <div className="min-h-screen pb-24 bg-page-gradient">
      
      <div className="border-b border-slate-100 dark:border-slate-800/50 py-16 bg-hero-gradient">
        <div className="w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-[768px]">
            <div className="h-14 w-40 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-xl mb-6"></div>
            <div className="h-6 w-full bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-lg mb-2"></div>
            <div className="h-6 w-4/5 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-lg"></div>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-surface/50 dark:bg-slate-900/40 rounded-2xl overflow-hidden shadow-sm h-full flex flex-col border border-slate-100 dark:border-slate-800/50">
              
              <div className="w-full aspect-[16/10] bg-slate-200 dark:bg-slate-800 animate-shimmer"></div>
              
              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <div className="h-7 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-lg w-full mb-2"></div>
                <div className="h-7 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-lg w-3/4 mb-4"></div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-md"></div>
                  <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-md"></div>
                </div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-md w-full mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-md w-full mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-shimmer rounded-md w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
