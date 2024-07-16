import {Link, Navigate} from "react-router-dom";
import {useContext, useState} from "react";
import axios from "axios";
import {UserContext} from "../UserContext.jsx";
import { data } from "autoprefixer";
import {toast} from "react-toastify"
import userLogo from "../assets/Rectangle 8.png"
import nameLogo from "../assets/KREATIFEVENT (1).png"

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect,setRedirect] = useState(false);
  const [redirectTo, setRedirectTo] = useState(false);
  const [redirectAdmin, setRedirectAdmin] = useState(false);
  const {setUser} = useContext(UserContext);
  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      const {data} = await axios.post("./login", {email,password});
      console.log(data);
      if(data.role === 0){
        setUser(data);
        alert('Login successful');
        setRedirectAdmin(true);
        localStorage.setItem("token", JSON.stringify(data))
      }else if(data.role === 1) {
        setUser(data);
        alert('Login successful');
        setRedirect(true);
        localStorage.setItem("token", JSON.stringify(data))
      }else if(data.role === 2){
        setUser(data);
        alert('Login successful');
        setRedirectTo(true);
        localStorage.setItem("token", JSON.stringify(data))
      }
    } catch (e) {
      alert('Login failed');
    }
  }

  if (redirect) {
    return <Navigate to={'/account/events'} />
  }

  if (redirectAdmin) {
    return <Navigate to={'/'} />
  }

  if(redirectTo){
    return <Navigate to={'/'} />
  }


  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <img src={nameLogo} alt=""  className="mx-auto py-5"/>
        <div className="flex gap-10">
        <div className="w-96 h-96 mr-24">
          <img src={userLogo} alt="" />
        </div>
        <div className="py-28">
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
          <input type="email"
                 placeholder="your@email.com"
                 value={email}
                 onChange={ev => setEmail(ev.target.value)} />
          <input type="password"
                 placeholder="password"
                 value={password}
                 onChange={ev => setPassword(ev.target.value)} />
          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet? <Link className="underline text-black" to={'/register'}>Register now</Link>
          </div>
        </form>
        </div>
        
        </div>
        
      </div>
    </div>
  );
}