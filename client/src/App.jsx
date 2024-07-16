import './App.css'
import {Route, Routes} from "react-router-dom";
import IndexPage from "./pages/IndexPage.jsx";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import {UserContextProvider} from "./UserContext";
import ProfilePage from "./pages/ProfilePage.jsx";
import PlacesPage from "./pages/PlacesPage";
import PlacesFormPage from "./pages/PlacesFormPage";
import PlacePage from "./pages/PlacePage";
import BookingsPage from "./pages/BookingsPage";
import BookingPage from "./pages/BookingPage";
import UserPage from './pages/UsersPage';
import ListEventPage from './pages/ListEvent';
import ListTicketPage from './pages/ListTicketsPage';


axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/users" element={<UserPage/>} />
          <Route path="/account/events" element={<PlacesPage />} />
          <Route path="/admin/events" element={<ListEventPage />} />
          <Route path="/admin/tickets" element={<ListTicketPage />} />
          <Route path="/account/events/new" element={<PlacesFormPage />} />
          <Route path="/account/events/:id" element={<PlacesFormPage />} />
          <Route path="/events/:id" element={<PlacePage />} />
          <Route path="/account/tiket" element={<BookingsPage />} />
          <Route path="/account/tikets/:id" element={<BookingPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
