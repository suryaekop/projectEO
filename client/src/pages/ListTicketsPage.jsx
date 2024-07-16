import {Link, useParams} from "react-router-dom";
import AccountNav from "../AccountNav";
import {useEffect, useState} from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";
export default function ListTicketPage() {
  const [tickets,setTickets] = useState([]);
  useEffect(() => {
    axios.get('/tickets').then(response => {
      setTickets(response.data);
    });
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };
  return (
    <div>
      <AccountNav />
      <h1 className="text-xl mx-[635px] w-full font-bold">List Pembelian Ticket</h1>
        <div className="mt-4 w-full ml-[300px]">
          <table>
            <thead className="border-b-2 border-gray-500">
            <tr>
              <th className="text-left p-4">No</th>
              <th className="text-left p-4">Order ID</th>
              <th className="text-left p-4">Nama Event</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Address</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Jumlah Tiket</th>
              <th className="text-left p-4">Nama</th>
              <th className="text-left p-4">Status</th>
            </tr>
            </thead>
            <tbody>
            {tickets.length > 0 && tickets.map((ticket,index) => (
              <tr key={ticket._id} className="border-b border-gray-500">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{ticket.orderId}</td>
                <td className="p-4">{ticket.event.title}</td>
                <td className="p-4">{ticket.price}</td>
                <td className="p-4">{ticket.event.address}</td>
                <td className="p-4">{formatDate(ticket.event.date)}</td>
                <td className="p-4">{ticket.qty} Buah</td>
                <td className="p-4">{ticket.name}</td>
                <td className="p-4">{ticket.status}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
    </div>
  );
}