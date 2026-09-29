import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';

import { IconButton } from '@mui/material';
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

            <IconButton onClick={() => {
                routeTo("/home")
            }}>
                <HomeIcon />
            </IconButton >
            {loading ? (
                <Typography sx={{ p: 2 }}>History load ho rahi hai...</Typography>
            ) : error ? (
                <Typography color="error" sx={{ p: 2 }}>{error}</Typography>
            ) : meetings.length > 0 ? meetings.map((meeting) => (
                <Card key={meeting._id} variant="outlined">
                    <CardContent>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Code: {meeting.meetingCode}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            Date: {formatDate(meeting.date)}
                        </Typography>
                    </CardContent>
                </Card>
            )) : (
                <Typography sx={{ p: 2 }}>Abhi tak koi meeting history nahi hai.</Typography>
            )}

        </div>
    )
}