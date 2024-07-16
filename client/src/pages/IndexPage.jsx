import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Image from "../Image.jsx";

export default function IndexPage() {
  const [events,setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    axios.get('/events').then(response => {
      const approvedEvents = response.data.filter(event => event.approve === 1);
      setEvents(approvedEvents);
      setFilteredEvents(approvedEvents);
    });
  }, []);

  useEffect(() => {
    if(searchQuery === ""){
      setFilteredEvents(events);
    }else{
      setFilteredEvents(events.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    }
  },[searchQuery,events])
  return (
    <div>
      <div className="w-64 flex mx-[1180px]">
        <input type="text" 
        value={searchQuery} 
        placeholder="Cari Event" 
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border-slate-950 hover:border-primary focus:border-primary"/>
      </div>
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
      {filteredEvents.length > 0 && filteredEvents.map(event => (
        <Link to={'/events/'+event._id}>
          <div className="bg-gray-500 mb-2 rounded-2xl flex">
            {event.photos?.[0] && (
              <Image className="rounded-2xl object-cover aspect-square" src={event.photos?.[0]} alt=""/>
            )}
          </div>
          <h2 className="font-bold">{event.address}</h2>
          <h3 className="text-sm text-gray-500">{event.title}</h3>
          <div className="mt-1">
            <span className="font-bold">${event.price}</span> per night
          </div>
        </Link>
      ))}
    </div>
    </div>
  );
}
