import { addPeerActions, removePeerActions } from "@/Actions/peerActions";
import { peerReducer } from "@/Reducer/peerReducer";
import Peer from "peerjs";
import { createContext, useEffect, useReducer, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SocketIoClient from "socket.io-client";
import { v4 as UUIDv4 } from "uuid";

const ws_server = import.meta.env.VITE_WS_Server;
const VideoSocketContext = createContext();
const socket = SocketIoClient(ws_server, { transports: ["websocket"] });

export const VideoSocketContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stream, setStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [peers, dispatch] = useReducer(peerReducer, {});

  // Get camera feed
  const fetchUserFeed = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(newStream);
    } catch (err) {
      console.error("Error accessing camera/mic:", err);
    }
  };

  // Handle screen sharing toggle
  const handleScreenShare = useCallback(async () => {
    if (isSharingScreen) {
      screenStream?.getTracks().forEach((t) => t.stop());
      setScreenStream(null);
      setIsSharingScreen(false);

      // revert to webcam
      Object.values(user.connections).forEach((connections) => {
        connections.forEach((conn) => {
          const sender = conn.peerConnection
            .getSenders()
            .find((s) => s.track?.kind === "video");
          if (sender) sender.replaceTrack(stream.getVideoTracks()[0]);
        });
      });
      return;
    }

    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
        audio: false,
      });

      const screenTrack = displayStream.getVideoTracks()[0];
      setScreenStream(displayStream);
      setIsSharingScreen(true);

      Object.values(user.connections).forEach((connections) => {
        connections.forEach((conn) => {
          const sender = conn.peerConnection
            .getSenders()
            .find((s) => s.track?.kind === "video");
          if (sender) sender.replaceTrack(screenTrack);
        });
      });

      // Automatically stop when user clicks "Stop Sharing"
      screenTrack.onended = () => handleScreenShare();
    } catch (err) {
      console.error("Error during screen sharing:", err);
    }
  }, [isSharingScreen, user, stream, screenStream]);

  // Initialize PeerJS and join logic
  useEffect(() => {
    const userId = UUIDv4();
    const newUser = new Peer(userId, {
      host: "localhost",
      port: 9000,
      path: "/myapp",
    });

    setUser(newUser);
    fetchUserFeed();

    const enterRoom = ({ roomId }) => navigate(`/room/${roomId}`);
    socket.on("room-created", enterRoom);

    return () => {
      socket.off("room-created", enterRoom);
    };
  }, [navigate]);

  // Main room logic (call handling)
  useEffect(() => {
    if (!user || !stream) return;

    // When another user joins
    socket.on("user-joined", ({ peerId }) => {
      const call = user.call(peerId, stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerActions(peerId, peerStream));
      });
    });

    // When someone calls you
    user.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerActions(call.peer, peerStream));
      });
    });

    socket.on("user-left", ({ peerId }) => {
        console.log("Peer left:", peerId);
        dispatch(removePeerActions(peerId)); // remove from reducer
    });


    socket.emit("ready");

    return () => {
      socket.off("user-joined");
      user.off("call");
    };
  }, [user, stream]);

  // Handle tab close
  const { id } = useParams();
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user && id) {
        socket.emit("delete-user", { roomId: id, peerId: user.id });
        user.destroy();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [user, id]);

  return (
    <VideoSocketContext.Provider
      value={{
        socket,
        user,
        stream,
        peers,
        isSharingScreen,
        handleScreenShare,
      }}
    >
      {children}
    </VideoSocketContext.Provider>
  );
};

export default VideoSocketContext;
