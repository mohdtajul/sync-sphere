import { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'

const server_url = import.meta.env.VITE_SERVER_URL;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {

    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState([]);

    let [audio, setAudio] = useState();

    let [screen, setScreen] = useState();

    let [showModal, setModal] = useState(true);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([])

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(3);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");

    const videoRef = useRef([])

    let [videos, setVideos] = useState([])

    // TODO
    // if(isChrome() === false) {


    // }

    useEffect(() => {
        // console.log("HELLO")
        getPermissions()

    }, [])

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        console.log("VIDEO/AUDIO EFFECT");

        if (video !== undefined && audio !== undefined) {
            getUserMedia();
            console.log("SET STATE HAS ", video, audio);

        }


    }, [video, audio])

    let getMedia = () => {
        console.log("CONNECT CLICKED");

        setVideo(videoAvailable);
        setAudio(audioAvailable);
        console.log("videoAvailable =", videoAvailable);
        console.log("audioAvailable =", audioAvailable);
        connectToSocketServer();
    }

    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        console.log("GET USER MEDIA START");
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }





    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()

        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }




    let connectToSocketServer = () => {
        console.log("ENTERED SOCKET FUNCTION");
        socketRef.current = io.connect(server_url, {
            secure: false,
            auth: {
                token: localStorage.getItem("token")
            }
        });
        
        console.log("SOCKET REF", socketRef.current);

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on("connect_error", (err) => {
            console.log("SOCKET ERROR:", err.message);
        });

        socketRef.current.on('connect', () => {
            console.log("SOCKET CONNECTED");
            console.log(socketRef.current.id);

            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })


            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    // Wait for their ice candidate       
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // Wait for their video stream
                    connections[socketListId].onaddstream = (event) => {
                        console.log("BEFORE:", videoRef.current);
                        console.log("FINDING ID: ", socketListId);

                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("FOUND EXISTING");

                            // Update the stream of the existing video
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            // Create a new video
                            console.log("CREATING NEW");
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };


                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }


    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        setVideo(!video);
        // getUserMedia();
    }
    let handleAudio = () => {
        setAudio(!audio)
        // getUserMedia();
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])
    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/"
    }

    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }
    let closeChat = () => {
        setModal(false);
    }
    let handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };



    let sendMessage = () => {
        console.log(socketRef.current);
        socketRef.current.emit('chat-message', message, username)
        setMessage("");

        // this.setState({ message: "", sender: username })
    }


    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }


    return (
        <div className={styles.meetingApp}>
            {askForUsername ? (
                <main className={styles.lobbyPage}>
                    <header className={styles.lobbyHeader}>
                        <span className={styles.lobbyBrandMark} aria-hidden="true">A</span>
                        <span>Apna Video Call</span>
                    </header>

                    <section className={styles.lobbyLayout}>
                        <div className={styles.lobbyIntro}>
                            <p className={styles.lobbyEyebrow}>Before you join</p>
                            <h1>Get ready for your conversation.</h1>
                            <p>Choose the name others will see, check your camera, then join when you’re ready.</p>
                            <div className={styles.lobbyForm}>
                                <TextField
                                    className={styles.usernameField}
                                    id="meeting-username"
                                    label="Your name"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && username.trim() && connect()}
                                    variant="outlined"
                                    fullWidth
                                />
                                <Button className={styles.connectButton} variant="contained" disabled={!username.trim()} onClick={connect}>
                                    Join meeting
                                </Button>
                                <p className={styles.lobbyPrivacyNote}>Your camera and microphone settings can be changed during the call.</p>
                            </div>
                        </div>

                        <div className={styles.lobbyPreview}>
                            <div className={styles.previewHeader}>
                                <span className={styles.previewStatus}><span /> Camera preview</span>
                                <span className={styles.previewName}>{username.trim() || "You"}</span>
                            </div>
                            <div className={styles.previewVideoWrap}>
                                <video className={styles.lobbyVideo} ref={localVideoref} autoPlay muted playsInline></video>
                                <span className={styles.previewCaption}>{username.trim() || "You"}</span>
                            </div>
                        </div>
                    </section>
                </main>
            ) : (
                <div className={styles.meetVideoContainer}>
                    <header className={styles.roomHeader}>
                        <div className={styles.roomBrand}>
                            <span className={styles.lobbyBrandMark} aria-hidden="true">A</span>
                            <div>
                                <strong>Apna Video Call</strong>
                                <span>Meeting in progress</span>
                            </div>
                        </div>
                        <div className={styles.roomUser}><span className={styles.roomLiveDot} />{username}</div>
                    </header>

                    <div className={styles.roomBody}>
                        <main className={styles.roomMain}>
                            <section className={styles.videoStage}>
                                <div className={styles.conferenceView}>
                                    <div className={`${styles.videoTile} ${styles.localVideoTile}`}>
                                        <video ref={localVideoref} autoPlay muted playsInline></video>
                                        <span>{username} (You)</span>
                                    </div>
                                    {videos.map((video) => (
                                        <div className={styles.videoTile} key={video.socketId}>
                                            <video
                                                data-socket={video.socketId}
                                                ref={ref => {
                                                    if (ref && video.stream) {
                                                        ref.srcObject = video.stream;
                                                    }
                                                }}
                                                autoPlay
                                                playsInline
                                            />
                                            <span>Participant</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className={styles.buttonContainers}>
                                <IconButton aria-label={video ? "Turn camera off" : "Turn camera on"} title={video ? "Turn camera off" : "Turn camera on"} onClick={handleVideo} className={!video ? styles.controlDisabled : ""}>
                                    {video ? <VideocamIcon /> : <VideocamOffIcon />}
                                </IconButton>
                                <IconButton aria-label="Leave meeting" title="Leave meeting" onClick={handleEndCall} className={styles.endCallButton}>
                                    <CallEndIcon />
                                </IconButton>
                                <IconButton aria-label={audio ? "Mute microphone" : "Unmute microphone"} title={audio ? "Mute microphone" : "Unmute microphone"} onClick={handleAudio} className={!audio ? styles.controlDisabled : ""}>
                                    {audio ? <MicIcon /> : <MicOffIcon />}
                                </IconButton>
                                {screenAvailable && (
                                    <IconButton aria-label={screen ? "Stop screen sharing" : "Share screen"} title={screen ? "Stop screen sharing" : "Share screen"} onClick={handleScreen}>
                                        {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                                    </IconButton>
                                )}
                                <Badge badgeContent={newMessages} max={999} color="primary">
                                    <IconButton aria-label={showModal ? "Close chat" : "Open chat"} title={showModal ? "Close chat" : "Open chat"} onClick={() => showModal ? closeChat() : openChat()} className={showModal ? styles.controlSelected : ""}>
                                        <ChatIcon />
                                    </IconButton>
                                </Badge>
                            </div>
                        </main>

                        {showModal && (
                            <aside className={styles.chatRoom}>
                                <div className={styles.chatContainer}>
                                    <div className={styles.chatHeader}>
                                        <div>
                                            <h1>In-call chat</h1>
                                            <p>Messages in this meeting</p>
                                        </div>
                                        <IconButton className={styles.closeChatButton} aria-label="Close chat" onClick={closeChat}>×</IconButton>
                                    </div>
                                    <div className={styles.chattingDisplay}>
                                        {messages.length > 0 ? messages.map((item, index) => (
                                            <div className={styles.chatMessage} key={index}>
                                                <p className={styles.chatSender}>{item.sender}</p>
                                                <p className={styles.chatBubble}>{item.data}</p>
                                            </div>
                                        )) : (
                                            <div className={styles.emptyChat}>
                                                <ChatIcon />
                                                <p>No messages yet</p>
                                                <span>Say hello to get the conversation started.</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.chattingArea}>
                                        <TextField
                                            className={styles.chatInput}
                                            value={message}
                                            onChange={e => setMessage(e.target.value)}
                                            onKeyDown={e => e.key === "Enter" && message.trim() && sendMessage()}
                                            id="meeting-chat-message"
                                            label="Write a message"
                                            variant="outlined"
                                            size="small"
                                        />
                                        <Button variant="contained" disabled={!message.trim()} onClick={sendMessage}>Send</Button>
                                    </div>
                                </div>
                            </aside>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}