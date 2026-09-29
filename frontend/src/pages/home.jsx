import { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { Button, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {


    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");


    const {addToUserHistory} = useContext(AuthContext);
    
    let handleJoinVideoCall = async () => {
        await addToUserHistory(meetingCode)
        navigate(`/${meetingCode}`)
    }

    return (
        <div className="homePage">
            <header className="navBar homeNavBar">
                <div className="homeBrand">
                    <span className="homeBrandMark" aria-hidden="true">A</span>
                    <h2>Apna Video Call</h2>
                </div>
                <div className="homeNavActions">
                    <Button className="historyButton" startIcon={<RestoreIcon />} onClick={() => navigate("/history")}>
                        History
                    </Button>
                    <Button onClick={() => {
                        localStorage.removeItem("token")
                        navigate("/auth")
                    }}>
                        Logout
                    </Button>
                </div>
            </header>

            <main className="meetContainer homeMain">
                <section className="leftPanel homeIntro">
                    <div className="homeIntroContent">
                        <p className="homeEyebrow">A simple space to connect</p>
                        <h1>Good conversations start here.</h1>
                        <p className="homeDescription">
                            Join a video call with your class, your team, or anyone you want to catch up with.
                        </p>

                        <div className="meetingForm">
                            <TextField
                                className="meetingCodeField"
                                onChange={e => setMeetingCode(e.target.value)}
                                value={meetingCode}
                                label="Meeting code"
                                variant="outlined"
                                onKeyDown={e => e.key === "Enter" && meetingCode.trim() && handleJoinVideoCall()}
                            />
                            <Button
                                className="joinButton"
                                onClick={handleJoinVideoCall}
                                disabled={!meetingCode.trim()}
                                variant="contained"
                            >
                                Join meeting
                            </Button>
                        </div>
                        <p className="homeHint">Enter a code to join an existing meeting.</p>
                    </div>
                </section>
                <div className="rightPanel homeIllustration">
                    <img src="/rightpanel.png" alt="People connecting on a video call" />
                </div>
            </main>
        </div>
    )
}


export default withAuth(HomeComponent)