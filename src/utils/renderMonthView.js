import { events } from './events.js';

export function renderMonthView() {
  const calendarView = document.getElementById('calendarView');
  calendarView.innerHTML = '';

  const displayedDay = window.currentDate;
  const today = new Date();
  const currentMonth = displayedDay.getMonth();
  const currentYear = displayedDay.getFullYear();

  const daysOfWeek = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'];

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const adjustedFirstDayOfMonth = (firstDayOfMonth + 6) % 7;

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  let calendarHTML = `<div class="text-center mb-3"><strong>${displayedDay.toLocaleString(
    'pl-PL',
    { month: 'long', year: 'numeric' }
  )}</strong></div>`;

  calendarHTML += '<div class="calendar-row">';
  for (let i = 0; i < 7; i++) {
    calendarHTML += `<div class="month-calendar-day fw-bold">${daysOfWeek[i]}.</div>`;
  }
  calendarHTML += '</div><div class="calendar-row">';

  for (let i = 0; i < adjustedFirstDayOfMonth; i++) {
    const day = daysInPrevMonth - adjustedFirstDayOfMonth + i + 1;
    calendarHTML += `<div class="month-calendar-day text-muted">${day}</div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(currentYear, currentMonth, day);
    let isToday = today.toDateString() === currentDate.toDateString();
    const dayClass = isToday
      ? 'month-calendar-day bg-primary text-white'
      : 'month-calendar-day';

    calendarHTML += `<div class="${dayClass}"><strong>${day}</strong>`;

    const dayEvents = events.filter(
      (event) => event.startTime.toDateString() === currentDate.toDateString()
    );

    if (dayEvents.length > 0) {
      calendarHTML += '<div class="events">';
      dayEvents.forEach((event) => {
        calendarHTML += `<div class="event"><small>${event.startTime.toLocaleTimeString(
          'pl-PL',
          { hour: '2-digit', minute: '2-digit' }
        )} - ${event.title}</small></div>`;
      });
      calendarHTML += '</div>';
    }

    calendarHTML += '</div>';

    if ((day + adjustedFirstDayOfMonth) % 7 === 0) {
      calendarHTML += '</div><div class="calendar-row">';
    }
  }

  const remainingCells =
    (7 - ((daysInMonth + adjustedFirstDayOfMonth) % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    calendarHTML += `<div class="month-calendar-day text-muted">${i}</div>`;
  }

  calendarHTML += '</div>';

  calendarView.innerHTML = calendarHTML;
}
