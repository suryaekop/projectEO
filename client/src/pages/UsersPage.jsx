import {Link} from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import AccountNav from "../AccountNav";


export default function UserPage() {
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [role, setRole] = useState('');
  async function registerUser(ev) {
    ev.preventDefault();
    try {
      await axios.post('/register-admin', {
        name,
        email,
        password,
        role
      });
      alert('Registration successful. Now you can log in');
    } catch (e) {
      alert('Registration failed. Please try again later');
    }
  }
  return (
    <div>
    <AccountNav />
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Tambah Admin</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input type="text"
                 placeholder="John Doe"
                 value={name}
                 onChange={ev => setName(ev.target.value)} />
          <input type="email"
                 placeholder="your@email.com"
                 value={email}
                 onChange={ev => setEmail(ev.target.value)} />
          <input type="password"
                 placeholder="password"
                 value={password}
                 onChange={ev => setPassword(ev.target.value)} />
          <select value={role} onChange={ev => setRole(ev.target.value)} className="w-full">
            <option value="">-- Pilih Role --</option>
            <option value="0">Admin</option>
            <option value="1">Event Organizer</option>
          </select>
          <button className="primary">Tambah</button>
        </form>
      </div>
    </div>
    </div>
  );
}