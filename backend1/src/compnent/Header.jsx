import { Link, useNavigate } from 'react-router-dom'

function Header(){
        const navigate = useNavigate()
        const raw = typeof window !== 'undefined' ? localStorage.getItem('fb_user') : null
        const user = raw ? JSON.parse(raw) : null

        function handleLogout(){
            localStorage.removeItem('fb_user')
            navigate('/login')
        }

        return(
                <header className="app-header">
                    {/* <div className="brand"><Link to="/">Student Feedback</Link></div> */}
                    <nav>
                        {/* <Link to="/">Home</Link> */}
                        {user ? (
                            <>
                                {/* <Link to="/account">Account</Link> */}
                                <button className="link-btn" onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <Link className="login-btn" to="/login">Login</Link>
                        )}
                    </nav>
                </header>
        )
}
export default Header