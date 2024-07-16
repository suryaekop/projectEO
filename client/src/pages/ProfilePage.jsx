import {useContext, useState} from "react";
import {UserContext} from "../UserContext.jsx";
import {Link, Navigate, useParams} from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";
import userLogo from "../assets/logouser.png"

export default function ProfilePage() {
  const [redirect,setRedirect] = useState(null);
  const {ready,user,setUser} = useContext(UserContext);
  let {subpage} = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  async function logout() {
    await axios.post("/logout");
    setRedirect("/");
    alert('Logout Successful');
    setUser(null);
  }

  if (!ready) {
    return 'Loading...';
  }

  if (ready && !user && !redirect) {
    return <Navigate to={'/login'} />
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }
  return (
    <div>
      <AccountNav />
      <div className="mt-4 text-center mx-auto">
              <div className="w-32 h-32  mx-auto">
                <img src={userLogo} alt="" />
              </div>
              <div className="grow-0 shrink mt-1">
                <h1 className="text-xl">Profile User</h1>
                <h2 className="text-xl">Nama : {user.name}</h2>
                <h2 className="text-xl">Email : {user.email}</h2>
                <h2 className="text-xl">Role : {user.role === 0 ? "Admin" : user.role === 1 ? "Event Organizer" : user.role === 2 ? "User" : "Pengguna Lain"}
                  </h2>
              </div>
        </div>
      {subpage === 'profile' && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})<br />
          <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
        </div>
      )}
      {subpage === 'places' && (
        <PlacesPage />
      )}
    </div>
  );
}