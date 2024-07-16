import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";

export default function BookingPage() {
  const {id} = useParams();
  const [tickets,setTickets] = useState(null);
  useEffect(() => {
    if (id) {
      axios.get('/transaksi').then(response => {
        const foundBooking = response.data.find(({_id}) => _id === id);
        if (foundBooking) {
          setTickets(foundBooking);
        }
      });
    }
  }, [id]);

  if (!tickets) {
    return '';
  }
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="my-8">
      <h1 className="text-3xl">{tickets.event.title}</h1>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-4">Your Ticket information:</h2>
          <span className="text-3xl mb-3">Tanggal Event: {formatDate(tickets.event.date)}</span>
        </div>
        
        <div className="bg-primary p-6 text-white rounded-2xl">
          <div>Total Harga</div>
          <div className="text-3xl">{formatRupiah(tickets.price)}</div>
        </div>
      </div>
    </div>
  );
}