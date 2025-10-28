import React, { useContext, useEffect } from "react";
import VideoSocketContext from "@/context/VideoContext";
import { useNavigate, useParams } from "react-router-dom";
import UserFeedPlayer from "@/components/molecules/UserFeedPlayer/UserFeedPlayer";

const Room = () => {
  const { id } = useParams();
  const { socket, user, stream, peers, handleScreenShare, isSharingScreen } = useContext(VideoSocketContext);
  const navigate = useNavigate();

  function handleCloseTab() {
    socket.emit("delete-user", {
      roomId: id,
      peerId: user._id,
    });
    navigate("/home");
  }

  useEffect(() => {
    if (user) socket.emit("joined-room", { roomId: id, peerId: user._id });
  }, [id, user, socket]);

  const participantCount = Object.keys(peers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 flex items-center justify-center">
      <div className="max-w-7xl w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between bg-slate-800/60 rounded-xl p-5 border border-slate-700/50">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Video Conference</h1>
              <p className="text-slate-400 text-sm">
                Room ID: <span className="font-mono text-slate-300">{id}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleScreenShare}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isSharingScreen
                    ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isSharingScreen ? "Stop Sharing" : "Share Screen"}
              </button>
              <button
                onClick={handleCloseTab}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm px-5 py-2.5"
              >
                Leave Room
              </button>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Object.keys(peers).map((peerId) => (
            <div key={peerId} className="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700">
              <UserFeedPlayer stream={peers[peerId].stream} />
            </div>
          ))}
          <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700">
            <UserFeedPlayer stream={stream} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
