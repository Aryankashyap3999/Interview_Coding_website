import { useEffect, useRef } from "react";

const UserFeedPlayer = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      className="w-full h-full object-cover bg-slate-900 rounded-2xl transition-all duration-300"
      muted
      autoPlay
      playsInline
    />
  );
};

export default UserFeedPlayer;
