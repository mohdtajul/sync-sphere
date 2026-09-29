import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar } from '@mui/material';

export default function Authentication() {



    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState("");


    const [formState, setFormState] = React.useState(0);

    const [open, setOpen] = React.useState(false)


    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    let handleAuth = async () => {
        try {
            if (formState === 0) {
                await handleLogin(username, password)
            }
            if (formState === 1) {
                let result = await handleRegister(name, username, password);
                console.log(result);
                setUsername("");
                setMessage(result);
                setOpen(true);
                setError("")
                setFormState(0)
                setPassword("")
            }
        } catch (err) {

            const message = err.response?.data?.message || "Backend se connection nahi ho pa raha. Thodi der baad dobara try karein.";
            setError(message);
        }
    }


    return (
        <div className="authPage">
            <section className="authAside">
                <div className="authBrand">
                    <span className="authBrandMark" aria-hidden="true">A</span>
                    <span>Apna Video Call</span>
                </div>
                <div className="authAsideCopy">
                    <p className="authEyebrow">A little closer, wherever you are</p>
                    <h1>Make room for good conversations.</h1>
                    <p>Sign in or create an account to meet face to face, wherever life takes you.</p>
                </div>
                <img className="authArtwork" src="/mobile.png" alt="Apna Video Call on a phone" />
                <span className="authAsideFooter">Simple, personal video calls.</span>
            </section>

            <main className="authMain">
                <Paper className="authCard" elevation={0}>
                    <div className="authCardIcon"><LockOutlinedIcon /></div>
                    <Typography component="p" className="authFormEyebrow">WELCOME</Typography>
                    <Typography component="h2" className="authTitle">
                        {formState === 0 ? "Welcome back" : "Create your account"}
                    </Typography>
                    <Typography component="p" className="authSubtitle">
                        {formState === 0 ? "Sign in to continue to your meetings." : "A few details and you’ll be ready to connect."}
                    </Typography>

                    <div className="authTabs" role="tablist" aria-label="Account access">
                        <Button role="tab" aria-selected={formState === 0} className={formState === 0 ? "authTab authTabActive" : "authTab"} onClick={() => { setFormState(0); setError("") }}>
                            Sign in
                        </Button>
                        <Button role="tab" aria-selected={formState === 1} className={formState === 1 ? "authTab authTabActive" : "authTab"} onClick={() => { setFormState(1); setError("") }}>
                            Sign up
                        </Button>
                    </div>

                    <Box component="form" className="authForm" noValidate onSubmit={e => { e.preventDefault(); handleAuth() }}>
                        {formState === 1 && (
                            <TextField
                                className="authField"
                                required
                                fullWidth
                                id="full-name"
                                label="Full name"
                                name="name"
                                value={name}
                                autoComplete="name"
                                onChange={e => setName(e.target.value)}
                            />
                        )}
                        <TextField
                            className="authField"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            value={username}
                            autoComplete="username"
                            autoFocus={formState === 0}
                            onChange={e => setUsername(e.target.value)}
                        />
                        <TextField
                            className="authField"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            value={password}
                            type="password"
                            autoComplete={formState === 0 ? "current-password" : "new-password"}
                            onChange={e => setPassword(e.target.value)}
                            id="password"
                        />

                        {error && <Typography className="authError" role="alert">{error}</Typography>}

                        <Button className="authSubmit" type="submit" fullWidth variant="contained" disabled={!username.trim() || !password || (formState === 1 && !name.trim())}>
                            {formState === 0 ? "Sign in" : "Create account"}
                        </Button>
                    </Box>
                </Paper>
            </main>

            <Snackbar open={open} autoHideDuration={4000} message={message} onClose={() => setOpen(false)} />
        </div>
    );
}