export const VideoRapper = ({ children }) => {
    return (
        <div 
            className="min-h-[100vh] flex items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-4"
        >
            <div className="w-full max-w-[150vh] h-auto bg-slate-800/90 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-slate-700/50 transition-all duration-300 hover:shadow-xl">
                {children}
            </div>
        </div>
    );
};