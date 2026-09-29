import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import RestoreIcon from '@mui/icons-material/Restore';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Button } from '@mui/material';
export default function History() {


    const { getHistoryOfUser } = useContext(AuthContext);

    const [meetings, setMeetings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")


    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch (err) {
                setError(err.response?.data?.message || "History load nahi ho saki. Dobara login karke try karein.");
            } finally {
                setLoading(false);
            }
        }

        fetchHistory();
    }, [getHistoryOfUser])

    let formatDate = (dateString) => {

        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear();

        return `${day}/${month}/${year}`

    }

    return (
        <div className="historyPage">
            <header className="navBar homeNavBar">
                <div className="homeBrand">
                    <span className="homeBrandMark" aria-hidden="true">A</span>
                    <h2>Apna Video Call</h2>
                </div>
                <Button className="historyBackButton" startIcon={<HomeIcon />} onClick={() => routeTo("/home")}>
                    Back to home
                </Button>
            </header>

            <main className="historyContent">
                <div className="historyHeading">
                    <div className="historyTitleIcon" aria-hidden="true"><RestoreIcon /></div>
                    <div>
                        <p className="homeEyebrow">Your activity</p>
                        <h1>Meeting history</h1>
                        <p className="historyDescription">Your recent calls, all in one place.</p>
                    </div>
                </div>

                <div className="historyListHeader">
                    <Typography component="h2">Previous meetings</Typography>
                    {!loading && !error && (
                        <span className="historyCount">{meetings.length} {meetings.length === 1 ? "meeting" : "meetings"}</span>
                    )}
                </div>

                {loading ? (
                    <div className="historyMessage"><Typography>History load ho rahi hai...</Typography></div>
                ) : error ? (
                    <div className="historyMessage historyError"><Typography>{error}</Typography></div>
                ) : meetings.length > 0 ? (
                    <div className="historyList">
                        {meetings.map((meeting) => (
                            <Card className="historyCard" key={meeting._id} variant="outlined">
                                <CardContent className="historyCardContent">
                                    <div className="meetingCodeIcon"><RestoreIcon /></div>
                                    <div className="meetingDetails">
                                        <Typography className="meetingCodeLabel">Meeting code</Typography>
                                        <Typography className="meetingCodeValue">{meeting.meetingCode}</Typography>
                                    </div>
                                    <div className="meetingDate">
                                        <CalendarTodayIcon />
                                        <Typography>{formatDate(meeting.date)}</Typography>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="historyMessage">
                        <div className="historyEmptyIcon"><RestoreIcon /></div>
                        <Typography className="historyEmptyTitle">Abhi tak koi meeting history nahi hai.</Typography>
                        <Typography className="historyEmptyHint">Jab aap meeting join karoge, woh yahan dikhegi.</Typography>
                    </div>
                )}
            </main>
        </div>
    )
}