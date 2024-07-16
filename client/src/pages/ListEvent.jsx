import {Link, useParams} from "react-router-dom";
import AccountNav from "../AccountNav";
import {useEffect, useState} from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";
export default function ListEventPage() {
  const [events,setEvents] = useState([]);
  useEffect(() => {
    axios.get('/events').then(response => {
      setEvents(response.data);
    });
  }, []);

  const handleApproveEvent = async (id) => {
    try {
      await axios.patch(`/events/${id}/approve`);
      // Refresh halaman untuk memperbarui status event setelah disetujui
      window.location.reload();
    } catch (error) {
      console.error('Error approving event:', error);
    }
  };
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };
  return (
    <div>
      <AccountNav />
        <div className="mt-4 w-36 ml-64">
          <table>
            <thead className="border-b-2 border-gray-500">
            <tr>
              <th className="text-left p-4">No</th>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Address</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Max Guest</th>
              <th className="text-left p-4">EO</th>
              <th className="text-left p-4">Persyaratan</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Action</th>
            </tr>
            </thead>
            <tbody>
            {events.length > 0 && events.map((event,index) => (
              <tr key={event._id} className="border-b border-gray-500">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{event.title}</td>
                <td className="p-4">{event.price}</td>
                <td className="p-4">{event.address}</td>
                <td className="p-4">{formatDate(event.date)}</td>
                <td className="p-4">{event.maxGuests}</td>
                <td className="p-4">{event.owner.name ? event.owner.name : "No Owner"}</td>
                <td className="p-4">
                {event.requirement && (
                    <a href={`http://localhost:4000/events/${event._id}/pdf`} target="_blank" rel="noopener noreferrer">View PDF</a>
                  )}
                </td>
                <td className="p-4">{event.approve === 1 ? "Approved" : "Pending"} </td>
                <td className="p-4">
                  {event.approve === 1 ? (
                    "Approved Success"
                  ) : (
                    <button onClick={() => handleApproveEvent(event._id)} className="bg-primary text-white rounded-xl w-full">Approve</button>
                  )}
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
    </div>
  );
}