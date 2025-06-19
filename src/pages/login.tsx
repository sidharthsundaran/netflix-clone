import {useState} from 'react' 
import {useAuth} from  '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import '../App.css'

const  Login = ()=>{
    const  {login} =useAuth()
    const  [username , setUsername]  = useState('')
    const navigate = useNavigate()

    const handleLogin = () => {
        if(username.trim () !== ''){
            login(username)
            navigate('/home')
        }
    }

    return  (
        <div className='flex flex-col items-center jutify-center min-h-screen bg-black text-white px-4'>
            <h1 className='text-3xl font -bold mb-6'> Netflix Login</h1>
            <input type="text"
             placeholder='Enter your name'
             value={username}
             onChange={(e)=>setUsername(e.target.value)}
             className='p-2 mb-4 w-full max-w-xs rounded text-black'
            />
            <button onClick={handleLogin} 
              className='bg-red-600 hover:bg-red-700 px-6 py-2 rounded text white semibold'
            >
             Sign In
            </button>
        </div>
    )
}

export default Login;