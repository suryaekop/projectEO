import {useContext, useEffect, useState} from "react";
import {differenceInCalendarDays} from "date-fns";
import axios from "axios";
import {Navigate} from "react-router-dom";
import {UserContext} from "./UserContext.jsx";
import { v4 as uuidv4} from "uuid"

export default function BookingWidget({event}) {
  const [date,setDate] = useState('');
  const [dateBuy, setDateBuy] = useState('');
  const [qty,setQty] = useState(1);
  const [orderId, setOrderId] = useState('');
  const [name,setName] = useState('');
  const [phone,setPhone] = useState('');
  const [total, setTotal] = useState(event.price);
  const [redirect,setRedirect] = useState('');
  const [token, setToken] = useState('');
  const {user} = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
    generateOrderId();
  }, [user]);

  useEffect(() => {
    if(token){
      window.snap.pay(token, {
        onSuccess: async(result) => {
          localStorage.setItem("Pembayaran", JSON.stringify(result))
          await verifyPayment('success');
          setToken("")
        },
        onPending: async(result) => {
          localStorage.setItem("Pembayaran", JSON.stringify(result))
          await verifyPayment('pending');
          setToken("")
        },
        onError: (error) => {
          console.log(error)
          setToken("")
        },
        onClose: () => {
          console.log("Anda belum menyelasaikan pembayaran")
          setToken("")
        }
      })
      setDateBuy('');
      setQty(1);
      setOrderId('');
      setName('');
      setPhone('');
      setTotal(event.price);

    }
  },[token])

  useEffect(() => {
    const midtransUrl = "https://app.sandbox.midtrans.com/snap/snap.js";

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransUrl;


    const midTransClientKey = "SB-Mid-client-xGLXMk4yPuvj0lJD";
    scriptTag.setAttribute("data-client-key",midTransClientKey)

    document.body.appendChild(scriptTag)

    return () => {
      document.body.removeChild(scriptTag)
    }
  })

  const handleQtyChange = (value) => {
    setQty(value);
    setTotal(value * event.price); // Update total based on new quantity
  };

  const generateOrderId = () => {
    const stringTransaksi = "KRE";  // Convert timestamp to base 36
    const randomChars = Math.floor(Math.random() * 1000) // Generate random characters
    const orderId = stringTransaksi + randomChars.toString().padStart(5, '0'); // Combine timestamp and random characters
    setOrderId(orderId); // Set generated Order ID
  };
  async function bookThisPlace() {
    const response = await axios.post('/tiket', {
      date,qty,name,phone,
      event:event._id,
      price:qty * event.price,
    });
    const bookingId = response.data._id;
    setRedirect(`/account/tiket/${bookingId}`);
  }

  async function bookAndPaymentTiket(){
    const result = await axios.post('/transaksi', {
      orderId,dateBuy:Date.now(),qty,name,phone,price:event.price,total,event: event._id
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    setToken(result.data.token);
  }
  async function verifyPayment(transactionStatus) {
    await axios.post('/verify-payment', {
      orderId, transactionStatus
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <>
    {user?.role === 2 && (
      <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: {formatRupiah(event.price)}
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Tanggal Event : {formatDate(event.date)}</label>
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Order ID:</label>
          <input type="text"
                 value={orderId}
                 onChange={ev => setOrderId(ev.target.value)}/>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Tiket:</label>
          <input type="number"
                 value={qty}
                 onChange={ev => handleQtyChange(ev.target.value)}/>
        </div>
        {qty > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input type="text"
                   value={name}
                   onChange={ev => setName(ev.target.value)}/>
            <label>Phone number:</label>
            <input type="tel"
                   value={phone}
                   onChange={ev => setPhone(ev.target.value)}/>
          </div>
        )}
        <div className="py-3 px-4 border-t">
          <label>Total:</label>
          <input type="text"
                 value={formatRupiah(total)}
                 readOnly/>
        </div>
      </div>
      <button onClick={bookAndPaymentTiket} className="primary mt-4">
        Buy Ticket
      </button>
    </div>
    )}
    
    
  </>
  
  );
}