import UserFeedPlayer from "@/components/molecules/UserFeedPlayer/UserFeedPlayer";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";


export const LocalPreview = ({ stream, isSharingScreen }) => (
  <motion.div
    drag
    dragMomentum={false}
    dragElastic={0.1}
    initial={{ opacity: 0, y: 30, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="fixed bottom-24 right-8 z-50 cursor-grab active:cursor-grabbing"
  >
    <Card className="relative w-48 h-32 sm:w-56 sm:h-36 md:w-64 md:h-40 overflow-hidden rounded-xl border border-slate-700/50 shadow-2xl bg-slate-900/90 backdrop-blur-md hover:shadow-slate-800/50">
      <UserFeedPlayer stream={stream} />
      <div className="absolute bottom-1.5 left-2 bg-slate-900/80 backdrop-blur-md text-xs text-white font-medium px-2 py-0.5 rounded-md flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
        You
      </div>

      {isSharingScreen && (
        <div className="absolute top-1.5 right-2 bg-yellow-400/90 text-[10px] text-black font-bold px-2 py-0.5 rounded-md shadow-md">
          Sharing Screen
        </div>
      )}
    </Card>
  </motion.div>
);