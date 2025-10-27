import UserFeedPlayer from "@/components/molecules/UserFeedPlayer/UserFeedPlayer";
import VideoSocketContext from "@/context/VideoContext";
import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";


const Room = () => {
    const { id } = useParams();

    const { socket, user, stream, peers } = useContext(VideoSocketContext);

    const navigate = useNavigate();

    function handleCloseTab () {
        socket.emit("delete-user", {
           roomId: id, peerId: user._id 
        })
        navigate('/home');
    }

    useEffect(() => {
        if(user) socket.emit("joined-room", {roomId: id, peerId: user._id});
        console.log(user)
    }, [id, user, socket]);

  return (
    <div>
        Room is connected with id {id} and  user Id is {user && user._id}

        your feed
        <UserFeedPlayer stream={stream}/>

        Other's feed
        <div>
            {Object.keys(peers).map((peerId) => (
                <>
                    PeerId is: {peerId}
                    <UserFeedPlayer key={peerId} stream={peers[peerId].stream}/>
                </>
            ))}
        </div>

        <button 
            type="button" 
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            onClick={handleCloseTab}
        >
            Close tab
        </button>

    </div>
  );
};

export default Room;
