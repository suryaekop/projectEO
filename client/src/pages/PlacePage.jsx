import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";

export default function PlacePage() {
  const {id} = useParams();
  const [events,setEvents] = useState(null);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/events/${id}`).then(response => {
      setEvents(response.data);
    });
  }, [id]);

  if (!events) return '';
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };



  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{events.title}</h1>
      <AddressLink>{events.address}</AddressLink>
      <PlaceGallery event={events} />
      <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>
            {events.description}
          </div>
          Tanggal Event: {formatDate(events.date)}<br />
          Maximal Penonton: {events.maxGuests}
        </div>
        <div>
          <BookingWidget event={events} />
        </div>
      </div>
      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra info</h2>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">{events.extraInfo}</div>
      </div>
    </div>
  );
}
