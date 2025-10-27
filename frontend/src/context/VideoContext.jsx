import { addPeerActions } from "@/Actions/peerActions";
import { peerReducer } from "@/Reducer/peerReducer";
import Peer from "peerjs";
import { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import SocketIoClient from 'socket.io-client';
import { v4 as UUIDv4 } from 'uuid';

const ws_server = import.meta.env.VITE_WS_Server;
console.log(ws_server);

const VideoSocketContext = createContext();

const socket = SocketIoClient(ws_server);

export const VideoSocketContextProvider = ({ children }) => {

    const navigate = useNavigate();

    const [user, setUser] = useState();
    const [stream, setStream] = useState();

    const [peers, dispatch] = useReducer(peerReducer, {})

    const fetchParticpants = ({roomId, participants}) => {
        console.log("Fetch Participants");
        console.log(roomId, participants);
    }

    const fetchUserFeed = async () => {
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true});
        setStream(newStream);
    }

    useEffect(() => {

        const userId = UUIDv4();
        const newUser = new Peer(userId, {
            host: "localhost",
            port: 9000,
            path: "/myapp"
        });
        
        setUser(newUser);

        fetchUserFeed();

        const enterRoom = ({ roomId }) => {
            navigate(`/room/${roomId}`);
        }

        socket.on("room-created", enterRoom);

        socket.on("get-user", fetchParticpants);
    }, []);

    useEffect(() => {
        if(!user || !stream) return;
        socket.on("user-joined", ({peerId}) => {
            const call = user.call(peerId, stream);
            console.log("Calling the new peer ", peerId);
            call.on("stream", () => {
                dispatch(addPeerActions(peerId, stream));
            })
        });

        user.on("call", (call) => {
            console.log("receiving a call");
            call.answer(stream);
            call.on("stream", () => {
                dispatch(addPeerActions(call.peer, stream));
            })
        });

        socket.emit("ready");

   }, [user, stream])

    return (
        <VideoSocketContext.Provider value={{ socket, user, stream, peers }}>
            {children}
        </VideoSocketContext.Provider>
    )
}

export default VideoSocketContext;
