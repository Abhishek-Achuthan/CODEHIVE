export const RouteLoadingFallback = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-zinc-900">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-zinc-400 text-sm">Loading...</p>
            </div>
        </div>
    );
};
