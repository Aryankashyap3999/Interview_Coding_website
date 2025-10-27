import UserFeedPlayer from "@/components/molecules/UserFeedPlayer/UserFeedPlayer";
import VideoSocketContext from "@/context/VideoContext";
import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Room = () => {
    const { id } = useParams();
    const { socket, user, stream, peers } = useContext(VideoSocketContext);
    const navigate = useNavigate();

    function handleCloseTab() {
        socket.emit("delete-user", {
            roomId: id, 
            peerId: user._id
        });
        navigate('/home');
    }

    useEffect(() => {
        if(user) socket.emit("joined-room", {roomId: id, peerId: user._id});
        console.log(user);
    }, [id, user, socket]);

    const participantCount = Object.keys(peers).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-6">
                <div className="flex items-center justify-between bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-700/50">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Video Conference</h1>
                        <p className="text-slate-400 text-sm">
                            Room ID: <span className="font-mono text-slate-300">{id}</span>
                            {user && <span className="ml-4">Your ID: <span className="font-mono text-slate-300">{user._id}</span></span>}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-700/50 px-4 py-2 rounded-lg">
                            <span className="text-slate-300 text-sm">
                                👥 {participantCount + 1} participant{participantCount !== 0 ? 's' : ''}
                            </span>
                        </div>
                        <button 
                            type="button" 
                            className="flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-500/50 font-medium rounded-lg text-sm px-5 py-2.5 transition-all duration-200 shadow-lg hover:shadow-red-500/50"
                            onClick={handleCloseTab}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Leave Room
                        </button>
                    </div>
                </div>
            </div>

            {/* Video Grid */}
            <div className="max-w-7xl mx-auto">
                <div className={`grid gap-4 ${participantCount === 0 ? 'grid-cols-1' : participantCount === 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                    {/* Your Feed */}
                    <div className="relative group">
                        <div className="bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700/50 aspect-video">
                            <UserFeedPlayer stream={stream}/>
                        </div>
                        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                            <span className="text-white text-sm font-medium flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                You
                            </span>
                        </div>
                    </div>

                    {/* Other Participants */}
                    {Object.keys(peers).map((peerId) => (
                        <div key={peerId} className="relative group">
                            <div className="bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700/50 aspect-video">
                                <UserFeedPlayer stream={peers[peerId].stream}/>
                            </div>
                            <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                                <span className="text-white text-sm font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                    Participant
                                </span>
                                <span className="text-slate-400 text-xs font-mono block mt-0.5">
                                    {peerId.slice(0, 8)}...
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {participantCount === 0 && (
                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-full mb-4">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Waiting for others to join</h3>
                        <p className="text-slate-400">Share the room ID with others to start the meeting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Room;