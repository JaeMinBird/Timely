import { ICalendarEvent } from '@/models/Chat';

interface CalendarEventCardProps {
  event: ICalendarEvent;
}

export default function CalendarEventCard({ event }: CalendarEventCardProps) {
  const startDate = new Date(event.start.dateTime);
  const endDate = new Date(event.end.dateTime);
  
  // Format date/time for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  const isSameDay = startDate.toDateString() === endDate.toDateString();
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm mb-4">
      <div className="flex items-start">
        <div className="bg-[#C1121F] text-white p-2 rounded-md mr-3">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
            <path d="M16 2v4" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 2v4" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 10h18" strokeWidth="2" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{event.summary}</h3>
          
          <div className="text-sm text-gray-600 mt-2">
            {isSameDay ? (
              <p>
                {formatDate(startDate)} • {formatTime(startDate)} - {formatTime(endDate)}
              </p>
            ) : (
              <p>
                {formatDate(startDate)} {formatTime(startDate)} - 
                {formatDate(endDate)} {formatTime(endDate)}
              </p>
            )}
          </div>
          
          {event.location && (
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.location}</span>
            </div>
          )}
          
          {event.description && (
            <p className="mt-2 text-sm text-gray-600">{event.description}</p>
          )}
          
          {event.attendees && event.attendees.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Attendees:</p>
              <div className="flex flex-wrap gap-1">
                {event.attendees.map((attendee, index) => (
                  <span key={index} className="text-xs bg-gray-100 rounded-full px-2 py-1">
                    {attendee.email}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 