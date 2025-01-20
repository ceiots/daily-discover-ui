import React, { useEffect, useState } from "react";
import instance from "../utils/axios";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await instance.get(`/events`);
        setEvents(response.data);
      } catch (error) {
        setError("Error fetching events. Please try again later.");
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="events-container">
      <h1>历史事件</h1>
      {loading ? (
        <p>Loading events...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        events.map((event) => (
          <div key={event.id} className="event-item">
            <img src={event.imageUrl} alt={event.title} className="event-image" />
            <h2>{event.title}</h2>
            <p>{event.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Events;
