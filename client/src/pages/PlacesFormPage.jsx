import PhotosUploader from "../PhotosUploader.jsx";
import Perks from "../Perks.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import AccountNav from "../AccountNav";
import {Navigate, useParams} from "react-router-dom";

export default function PlacesFormPage() {
  const {id} = useParams();
  const [title,setTitle] = useState('');
  const [address,setAddress] = useState('');
  const [addedPhotos,setAddedPhotos] = useState([]);
  const [description,setDescription] = useState('');
  const [perks,setPerks] = useState([]);
  const [extraInfo,setExtraInfo] = useState('');
  const [date,setDate] = useState('');
  const [maxGuests,setMaxGuests] = useState(1);
  const [price,setPrice] = useState(100);
  const [requirement, setRequirement] = useState(null)
  const [redirect,setRedirect] = useState(false);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/events/'+id).then(response => {
       const {data} = response;
       setTitle(data.title);
       setAddress(data.address);
       setAddedPhotos(data.photos);
       setDescription(data.description);
       setPerks(data.perks);
       setExtraInfo(data.extraInfo);
       setDate(data.date);
       setMaxGuests(data.maxGuests);
       setPrice(data.price);
    });
  }, [id]);
  function inputHeader(text) {
    return (
      <h2 className="text-2xl mt-4">{text}</h2>
    );
  }
  function inputDescription(text) {
    return (
      <p className="text-gray-500 text-sm">{text}</p>
    );
  }
  function preInput(header,description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function savePlace(ev) {
    ev.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('address', address);
    addedPhotos.forEach((photo, index) => {
      formData.append(`addedPhotos[${index}]`, photo);
    });
    formData.append('description', description);
    formData.append('perks', JSON.stringify(perks)); // stringify array
    formData.append('extraInfo', extraInfo);
    formData.append('date', date);
    formData.append('maxGuests', maxGuests);
    formData.append('price', price);
    if (requirement) {
      formData.append('requirement', requirement); // Append file if it exists
    }
  
    if (id) {
      // update
      formData.append('id', id);
      await axios.put('/events', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setRedirect(true);
    } else {
      // new place
      await axios.post('/events', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/account/events'} />
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace} encType="multipart/form-data">
        {preInput('Title', 'Title for your event. should be short and catchy as in advertisement')}
        <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title, for example: Tau Tau Fest"/>
        {preInput('Address', 'Address to this place')}
        <input type="text" value={address} onChange={ev => setAddress(ev.target.value)}placeholder="address"/>
        {preInput('Photos','more = better')}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
        {preInput('Description','description of the place')}
        <textarea value={description} onChange={ev => setDescription(ev.target.value)} />
        {preInput('Perks','select all the perks of your place')}
        <div className="grid mt-2 gap-2 grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
          <Perks selected={perks} onChange={setPerks} />
        </div>
        {preInput('Extra info','Rules, etc')}
        <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />
        {preInput('Date Info','Date and Time Info, etc')}
        <div>
            <h3 className="mt-2 -mb-1">Check in time</h3>
            <input type="date"
                   value={date}
                   onChange={ev => setDate(ev.target.value)}
                   className="w-full"/>
          </div>
        {preInput('Requirement', 'Requirement Events')}
        <input type="file" onChange={ev => setRequirement(ev.target.files[0])} accept=".pdf"/>
        {preInput('Check in&out times','add check in and out times, remember to have some time window for cleaning the room between guests')}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Max number of guests</h3>
            <input type="number" value={maxGuests}
                   onChange={ev => setMaxGuests(ev.target.value)}/>
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price</h3>
            <input type="text" value={price}
                   onChange={ev => setPrice(ev.target.value)}/>
          </div>
        </div>
        <button className="primary my-4">Save</button>
      </form>
    </div>
  );
}