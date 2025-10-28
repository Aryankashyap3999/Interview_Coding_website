import React, { useContext, useEffect, useState } from "react";
import VideoSocketContext from "@/context/VideoContext";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import UserFeedPlayer from "@/components/molecules/UserFeedPlayer/UserFeedPlayer";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorStop,
  LogOut,
} from "lucide-react";

const LocalPreview = ({ stream, isSharingScreen }) => (
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

const Room = () => {
  const { id } = useParams();
  const {
    socket,
    user,
    stream,
    peers,
    handleScreenShare,
    isSharingScreen,
  } = useContext(VideoSocketContext);
  const navigate = useNavigate();
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  function handleCloseTab() {
    socket.emit("delete-user", { roomId: id, peerId: user?._id });
    navigate("/home");
  }

  useEffect(() => {
    if (user) socket.emit("joined-room", { roomId: id, peerId: user._id });
  }, [id, user, socket]);

  const participantCount = Object.keys(peers).length + 1;

  const toggleMic = () => {
    if (!stream) return;
    stream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    setMicOn(!micOn);
  };

  const toggleCam = () => {
    if (!stream) return;
    stream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    setCamOn(!camOn);
  };

  const peerIds = Object.keys(peers);
  const mainFeedId = peerIds.find((id) => peers[id].isScreenSharing) || peerIds[0]; // screen share first
  const otherFeeds = peerIds.filter((id) => id !== mainFeedId);

  return (
    <div className="relative flex flex-col min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-slate-800/60 backdrop-blur-lg border-b border-slate-700/50">
        <div>
          <h1 className="text-xl font-semibold tracking-wide">Video Call Room</h1>
          <p className="text-slate-400 text-sm">
            Room ID: <span className="font-mono text-slate-300">{id}</span>
          </p>
        </div>
        <div className="text-slate-400 text-sm">
          👥 {participantCount} participant{participantCount > 1 ? "s" : ""}
        </div>
      </div>

      {/* Main Display */}
      <div className="flex-1 relative p-4 flex flex-col gap-4 md:flex-row">
        {/* Main feed (large) */}
        {mainFeedId && (
          <motion.div
            layout
            key={mainFeedId}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex-1 rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl bg-slate-800/80 relative"
          >
            <UserFeedPlayer stream={peers[mainFeedId].stream} />
            <div className="absolute bottom-2 left-2 bg-slate-900/70 text-xs px-2 py-1 rounded-md">
              {mainFeedId.slice(0, 6)}...
            </div>
          </motion.div>
        )}

        {/* Other participants (small side column) */}
        <div className="flex md:flex-col flex-wrap gap-3 justify-center md:w-1/4">
          <AnimatePresence>
            {otherFeeds.map((peerId) => (
              <motion.div
                key={peerId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="w-40 h-28 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg bg-slate-800"
              >
                <UserFeedPlayer stream={peers[peerId].stream} />
                <div className="absolute bottom-1 left-2 bg-slate-900/70 text-xs px-2 py-0.5 rounded-md">
                  {peerId.slice(0, 6)}...
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Local Preview */}
      <LocalPreview stream={stream} isSharingScreen={isSharingScreen} />

      {/* Control Bar */}
      <div className="flex justify-center items-center gap-6 py-4 bg-slate-800/60 backdrop-blur-lg border-t border-slate-700/50">
        <button
          onClick={toggleMic}
          className={`p-3 rounded-full ${
            micOn ? "bg-slate-700 hover:bg-slate-600" : "bg-red-600 hover:bg-red-700"
          } transition-all duration-200`}
        >
          {micOn ? <Mic size={22} /> : <MicOff size={22} />}
        </button>

        <button
          onClick={toggleCam}
          className={`p-3 rounded-full ${
            camOn ? "bg-slate-700 hover:bg-slate-600" : "bg-red-600 hover:bg-red-700"
          } transition-all duration-200`}
        >
          {camOn ? <Video size={22} /> : <VideoOff size={22} />}
        </button>

        <button
          onClick={handleScreenShare}
          className={`p-3 rounded-full ${
            isSharingScreen
              ? "bg-yellow-500 text-black hover:bg-yellow-600"
              : "bg-slate-700 hover:bg-slate-600"
          } transition-all duration-200`}
        >
          {isSharingScreen ? <MonitorStop size={22} /> : <Monitor size={22} />}
        </button>

        <button
          onClick={handleCloseTab}
          className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-200"
        >
          <LogOut size={22} />
        </button>
      </div>
    </div>
  );
};

export default Room;
