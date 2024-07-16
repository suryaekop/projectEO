import {differenceInCalendarDays, format} from "date-fns";

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};
export default function BookingDates({tiket,className}) {
  return (
    <div className={"flex gap-1 "+className}>
      <div className="flex gap-1 items-center">
        <div>
          <h3>Tanggal Event : {formatDate(tiket.event.date)}</h3>
        </div>
      </div>
    </div>
  );
}