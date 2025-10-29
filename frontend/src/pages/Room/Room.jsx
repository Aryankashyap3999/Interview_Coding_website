import React, { useContext, useEffect, useState } from "react";
import VideoSocketContext from "@/context/VideoContext";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import UserFeedPlayer from "@/components/molecules/UserFeedPlayer/UserFeedPlayer";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorStop,
  LogOut,
  BadgePlus
} from "lucide-react";
import { LocalPreview } from "@/components/atoms/LocalPreview/LocalPreview";
import { useCreateProjectModal } from "@/hooks/context/useCreateProjectModal";
import { CreateProjectModal } from "@/components/organisms/Modals/CreateProjectModal";



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

  const {openCreateProjectModal, setOpenCreateProject, isClicked} = useCreateProjectModal();

  // when closing/leaving
  function handleCloseTab() {
    socket.emit("delete-user", { roomId: id, peerId: user?._id });
    navigate("/home");
  }

  function handleProjectCreation () {
    setOpenCreateProject(true);
    console.log("CreateProjectModal is: ", openCreateProjectModal);
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
  const mainFeedId = peerIds.find((id) => peers[id].isScreenSharing) || peerIds[0];
  const otherFeeds = peerIds.filter((id) => id !== mainFeedId);

  const isSolo = participantCount === 1;

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        console.log("Stopped camera and microphone after leaving the room");
      }
    };
  }, [stream]);

  return (
    <>
     <CreateProjectModal
      openCreateProjectModal={openCreateProjectModal}
      setOpenCreateProject={setOpenCreateProject}
      isClicked={isClicked}
      setIsClicked={isClicked}
     />
    
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
      <div className="flex-1 relative p-4 flex flex-col gap-4 md:flex-row items-center justify-center">
        {isSolo ? (
          // 👤 Solo Full Screen View
          <motion.div
            key="solo"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full max-w-5xl max-h-[80vh] rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl bg-slate-800/80 flex items-center justify-center"
          >
            <UserFeedPlayer stream={stream} />
            <div className="absolute bottom-3 left-3 bg-slate-900/70 text-xs px-3 py-1 rounded-md">
              You
            </div>
          </motion.div>
        ) : (
          // 👥 Multi-user layout
          <>
            {/* Main feed */}
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

            {/* Other feeds */}
            <div className="flex md:flex-col flex-wrap gap-3 justify-center md:w-1/4">
              <AnimatePresence>
                {otherFeeds.map((peerId) => (
                  <motion.div
                    key={peerId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="w-40 h-28 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg bg-slate-800 relative"
                  >
                    <UserFeedPlayer stream={peers[peerId].stream} />
                    <div className="absolute bottom-1 left-2 bg-slate-900/70 text-xs px-2 py-0.5 rounded-md">
                      {peerId.slice(0, 6)}...
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      {/* Local Preview */}
      {!isSolo && <LocalPreview stream={stream} isSharingScreen={isSharingScreen} />}

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

        <button
          onClick={handleProjectCreation}
          className="p-3 rounded-full bg-green-600 hover:bg-green-700 transition-all duration-200"
        >
          <BadgePlus size={22} />
        </button>
      </div>
    </div>
    </>
  );
};

export default Room;
