import { addPeerActions, removePeerActions } from "@/Actions/peerActions";
import { peerReducer } from "@/Reducer/peerReducer";
import Peer from "peerjs";
import { createContext, useEffect, useReducer, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SocketIoClient from "socket.io-client";
import { v4 as UUIDv4 } from "uuid";

const ws_server = import.meta.env.VITE_WS_Server;
const VideoSocketContext = createContext();
const socket = SocketIoClient(ws_server);

export const VideoSocketContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [stream, setStream] = useState();
  const [screenStream, setScreenStream] = useState(null);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [peers, dispatch] = useReducer(peerReducer, {});

  const fetchParticipants = ({ roomId, participants }) => {
    console.log("Participants:", roomId, participants);
  };

  const fetchUserFeed = async () => {
    const newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setStream(newStream);
  };

  const handleScreenShare = useCallback(async () => {
    if (isSharingScreen) {
      // Stop screen sharing
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
      setIsSharingScreen(false);

      // Revert to camera stream
      Object.values(user.connections).forEach((connectionArray) => {
        connectionArray.forEach((conn) => {
          const sender = conn.peerConnection
            .getSenders()
            .find((s) => s.track?.kind === "video");
          if (sender) {
            sender.replaceTrack(stream.getVideoTracks()[0]);
          }
        });
      });
      console.log("Stopped screen sharing.");
      return;
    }

    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
        audio: false,
      });

      setScreenStream(displayStream);
      setIsSharingScreen(true);

      const screenTrack = displayStream.getVideoTracks()[0];

      // Replace video track in all Peer connections
      Object.values(user.connections).forEach((connectionArray) => {
        connectionArray.forEach((conn) => {
          const sender = conn.peerConnection
            .getSenders()
            .find((s) => s.track?.kind === "video");
          if (sender) {
            sender.replaceTrack(screenTrack);
          }
        });
      });

      // Stop sharing automatically if user clicks "Stop Sharing"
      screenTrack.onended = () => {
        handleScreenShare();
      };

      console.log("Started screen sharing.");
    } catch (err) {
      console.error("Error while sharing screen:", err);
    }
  }, [isSharingScreen, user, stream, screenStream]);

  useEffect(() => {
    const userId = UUIDv4();
    const newUser = new Peer(userId, {
      host: "localhost",
      port: 9000,
      path: "/myapp",
    });

    setUser(newUser);
    fetchUserFeed();

    const enterRoom = ({ roomId }) => {
      navigate(`/room/${roomId}`);
    };

    socket.on("room-created", enterRoom);
    socket.on("get-user", fetchParticipants);
  }, []);

  useEffect(() => {
    if (!user || !stream) return;

    socket.on("user-joined", ({ peerId }) => {
      const call = user.call(peerId, stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerActions(peerId, peerStream));
      });
    });

    user.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerActions(call.peer, peerStream));
      });
    });

    socket.emit("ready");
  }, [user, stream]);

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
