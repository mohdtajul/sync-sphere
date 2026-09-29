import '../App.css';
import { Link } from 'react-router-dom'


export default function LandingPage(){
    return(
        <div className='landingPageContainer'>
            <nav>
                <div className='navHeader'>
                    <span className="landingBrandMark" aria-hidden="true">A</span>
                    <h2>Apna Video Call</h2>
                </div>
                <div className='navlist'>
                    <Link className="landingNavLink" to="/home">Join as Guest</Link>
                    <Link className="landingNavLink" to="/auth">Register</Link>
                    <Link className="landingLoginLink" to="/auth">Login</Link>
                </div>
            </nav>

            <main className="landingMainContainer">
                <div className="landingCopy">
                    <p className="landingEyebrow">A little closer, wherever you are</p>
                    <h1><span>Connect</span> with your loved ones.</h1>
                    <p className="landingDescription">Good conversations shouldn’t have to wait. Start a video call and make time for the people who matter.</p>
                    <Link className="landingGetStarted" to="/auth">Get started <span aria-hidden="true">→</span></Link>
                    <p className="landingGuestNote">Already have a meeting code? <Link to="/home">Join as a guest</Link></p>
                </div>
                <div className="landingArtwork">
                    <img src="/mobile.png" alt="Apna Video Call shown on a phone" />
                </div>
            </main>
            <footer className="landingFooter">Simple, personal video calls.</footer>

        </div>
    )
    
}