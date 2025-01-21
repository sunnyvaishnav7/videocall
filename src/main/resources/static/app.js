let localStream;
let remoteStream;
let peerConnection;
const servers = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
};

const startCallBtn = document.getElementById("startCallBtn");
const endCallBtn = document.getElementById("endCallBtn");
const muteBtn = document.getElementById("muteBtn");
const videoBtn = document.getElementById("videoBtn");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

startCallBtn.addEventListener("click", startCall);
endCallBtn.addEventListener("click", endCall);
muteBtn.addEventListener("click", toggleMute);
videoBtn.addEventListener("click", toggleVideo);

async function startCall() {
    try {
        // Get the local stream (camera and microphone)
        localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        localVideo.srcObject = localStream;

        // Create peer connection
        peerConnection = new RTCPeerConnection(servers);

        // Add tracks to the peer connection
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        // Create offer and send it to the remote peer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // Simulate sending offer and receiving answer
        // Replace with real signaling
        setTimeout(() => {
            peerConnection.setRemoteDescription(offer); // Normally, it would be received from the remote peer
            peerConnection.createAnswer()
                .then(answer => peerConnection.setLocalDescription(answer))
                .then(() => peerConnection.setRemoteDescription(answer));
        }, 1000);

        // Get remote stream
        peerConnection.ontrack = event => {
            remoteStream = event.streams[0];
            remoteVideo.srcObject = remoteStream;
        };

        // Show controls
        startCallBtn.classList.add("hide");
        endCallBtn.classList.remove("hide");
        muteBtn.classList.remove("hide");
        videoBtn.classList.remove("hide");
    } catch (err) {
        console.error("Error accessing media devices.", err);
    }
}

function endCall() {
    peerConnection.close();
    localStream.getTracks().forEach(track => track.stop());
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;

    startCallBtn.classList.remove("hide");
    endCallBtn.classList.add("hide");
    muteBtn.classList.add("hide");
    videoBtn.classList.add("hide");
}

function toggleMute() {
    const audioTrack = localStream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    muteBtn.innerHTML = audioTrack.enabled
        ? '<i class="fa fa-microphone"></i> Mute'
        : '<i class="fa fa-microphone-slash"></i> Unmute';
}

function toggleVideo() {
    const videoTrack = localStream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    videoBtn.innerHTML = videoTrack.enabled
        ? '<i class="fa fa-video-camera"></i> Stop Video'
        : '<i class="fa fa-video-camera-slash"></i> Start Video';
}

// Chat functionality
const chatInput = document.getElementById("chatInput");
const sendMsgBtn = document.getElementById("sendMsgBtn");
const chatMessages = document.getElementById("chatMessages");

sendMsgBtn.addEventListener("click", () => {
    const msg = chatInput.value.trim();
    if (msg) {
        const li = document.createElement("li");
        li.textContent = msg;
        chatMessages.appendChild(li);
        chatInput.value = "";
    }
});
