import { renderMonthView } from './utils/renderMonthView.js';
import { renderWeekView } from './utils/renderWeekView.js';
import { renderDayView } from './utils/renderDayView.js';
import { events } from './utils/events.js';


document.addEventListener('DOMContentLoaded', function () {
  const viewMode = document.getElementById('viewMode').value;
  window.currentDate = new Date(); // displayed date
  renderView(viewMode);

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
    console.log('add event');
    const myModal = new bootstrap.Modal(
      document.getElementById('addEventModal')
    );
    myModal.show();
  });

  document
    .getElementById('saveEventBtn')
    .addEventListener('click', function () {
      const title = document.getElementById('eventTitle').value;
      const eventDate = document.getElementById('eventDate').value;
      const startTime = document.getElementById('eventStartTime').value;
      const endTime = document.getElementById('eventEndTime').value;
      const description = document.getElementById('eventDescription').value;

      if (title && eventDate && startTime && endTime && description) {
        const startDateTime = new Date(`${eventDate}T${startTime}`);
        const endDateTime = new Date(`${eventDate}T${endTime}`);

        if (endDateTime > startDateTime) {
          events.push({
            title,
            startTime: startDateTime,
            endTime: endDateTime,
            description,
          });

          const myModal = bootstrap.Modal.getInstance(
            document.getElementById('addEventModal')
          );
          myModal.hide();

          document.getElementById('eventForm').reset();

          renderView(document.getElementById('viewMode').value);
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

function renderView(viewMode) {
  if (viewMode === 'month') {
    renderMonthView();
  } else if (viewMode === 'week') {
    renderWeekView();
  } else if (viewMode === 'day') {
    renderDayView();
  }
}
