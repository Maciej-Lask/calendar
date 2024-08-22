import { renderMonthView } from './utils/renderMonthView.js';
import { renderWeekView } from './utils/renderWeekView.js';
import { renderDayView } from './utils/renderDayView.js';
import { showEventModal } from './utils/showEventModal.js';

export async function fetchEvents() {
  try {
    const response = await fetch('http://localhost:8000/api/events');
    if (!response.ok) {
      throw new Error('Błąd w pobieraniu wydarzeń');
    }
    const events = await response.json();
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

async function deleteEvent(id) {
  try {
    const response = await fetch(`http://localhost:8000/api/events/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      window.events = window.events.filter((event) => event.id !== id);
      renderView(document.getElementById('viewMode').value);
    } else {
      alert('Wystąpił problem z usunięciem wydarzenia.');
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    alert('Wystąpił problem z usunięciem wydarzenia.');
  }
}

async function updateEvent(event) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/events/${event.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (response.ok) {
      window.events = await fetchEvents();

      renderView(document.getElementById('viewMode').value);
    } else {
      console.error('Failed to update event.');
    }
  } catch (error) {
    console.error('Error updating event:', error);
  }
}

function changeUserRole() {
  const reservationView = document.getElementById('reservationView').value;
  if (reservationView === 'admin') {
    window.userRole = 'admin';
  } else if (reservationView === 'client') {
    window.userRole = 'client';
  }
  console.log(`User role changed to: ${window.userRole}`);
  toggleAddEventButton();
}

function toggleAddEventButton() {
  const addEventBtn = document.getElementById('addEventBtn');
  if (window.userRole === 'admin') {
    addEventBtn.style.display = 'block';
  } else {
    addEventBtn.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  const viewMode = document.getElementById('viewMode').value;
  window.currentDate = new Date(); // displayed date
  window.userRole = 'client';
  window.events = await fetchEvents();

  renderView(viewMode);
  document
    .getElementById('reservationView')
    .addEventListener('change', changeUserRole);

  toggleAddEventButton();

  document.getElementById('prevBtn').addEventListener('click', function () {
    changeDate(-1);
    renderView(document.getElementById('viewMode').value);
  });

  document.getElementById('nextBtn').addEventListener('click', function () {
    changeDate(1);
    renderView(document.getElementById('viewMode').value);
  });

  document.getElementById('viewMode').addEventListener('change', function () {
    renderView(this.value);
  });

  document.getElementById('addEventBtn').addEventListener('click', function () {
    const myModal = new bootstrap.Modal(
      document.getElementById('addEventModal')
    );
    myModal.show();
  });

  document
    .getElementById('saveEventBtn')
    .addEventListener('click', async function () {
      const title = document.getElementById('eventTitle').value;
      const eventDate = document.getElementById('eventDate').value;
      const startTime = document.getElementById('eventStartTime').value;
      const endTime = document.getElementById('eventEndTime').value;
      const description = document.getElementById('eventDescription').value;

      if (title && eventDate && startTime && endTime && description) {
        const startDateTime = new Date(`${eventDate}T${startTime}`);
        const endDateTime = new Date(`${eventDate}T${endTime}`);

        if (endDateTime > startDateTime) {
          const newEvent = {
            title,
            startTime: startDateTime,
            endTime: endDateTime,
            description,
          };

          try {
            const response = await fetch('http://localhost:8000/api/events', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newEvent),
            });

            if (response.ok) {
              window.events.push(newEvent);

              const myModal = bootstrap.Modal.getInstance(
                document.getElementById('addEventModal')
              );
              myModal.hide();
              window.events = await fetchEvents();

              document.getElementById('eventForm').reset();

              renderView(document.getElementById('viewMode').value);
            } else {
              alert('Wystąpił problem z dodaniem wydarzenia.');
            }
          } catch (error) {
            console.error('Error saving event:', error);
            alert('Wystąpił problem z dodaniem wydarzenia.');
          }
        } else {
          alert('Czas zakończenia musi być późniejszy niż czas rozpoczęcia.');
        }
      } else {
        alert('Proszę wypełnić wszystkie pola.');
      }
    });
});

function changeDate(offset) {
  const viewMode = document.getElementById('viewMode').value;
  if (viewMode === 'month') {
    window.currentDate.setMonth(window.currentDate.getMonth() + offset);
  } else if (viewMode === 'week') {
    window.currentDate.setDate(window.currentDate.getDate() + offset * 7);
  } else if (viewMode === 'day') {
    window.currentDate.setDate(window.currentDate.getDate() + offset);
  }
}

export function renderView(viewMode) {
  if (viewMode === 'month') {
    renderMonthView(window.events);
  } else if (viewMode === 'week') {
    renderWeekView(window.events);
  } else if (viewMode === 'day') {
    renderDayView(window.events);
  }
}

window.deleteEvent = deleteEvent;
window.updateEvent = updateEvent;
