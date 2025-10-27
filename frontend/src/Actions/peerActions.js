export const ADD_PEER = "ADD_PEER";
export const REMOVE_PEER = "REMOVE_PEER" ;

export const addPeerActions = (peerId, stream) => ({
    type: ADD_PEER,
    payload: {peerId, stream}
});

export const removePeerActions = (peerId, stream) => ({
    type: REMOVE_PEER,
    payload: {peerId, stream}
});