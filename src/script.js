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
});

const events = [
  {
    title: 'Spotkanie z klientem',
    startTime: new Date('2024-08-12T06:00:00'),
    endTime: new Date('2024-08-12T11:00:00'),
    description: 'Omówienie projektu z klientem.',
  },
  {
    title: 'Spotkanie z klientem',
    startTime: new Date('2024-08-12T05:00:00'),
    endTime: new Date('2024-08-12T10:00:00'),
    description: 'Omówienie projektu z klientem.',
  },
  {
    title: 'Lunch',
    startTime: new Date('2024-08-12T13:00:00'),
    endTime: new Date('2024-08-12T13:14:00'),
    description: 'Lunch z zespołem.',
  },
  {
    title: 'Webinar',
    startTime: new Date('2024-08-13T15:00:00'),
    endTime: new Date('2024-08-13T16:30:00'),
    description: 'Udział w webinarze na temat nowych technologii.',
  },
  {
    title: 'Przygotowanie raportu',
    startTime: new Date('2024-08-14T09:00:00'),
    endTime: new Date('2024-08-14T12:00:00'),
    description: 'Przygotowanie raportu kwartalnego.',
  },
];

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

function renderMonthView() {
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

function renderWeekView() {
  const calendarView = document.getElementById('calendarView');
  calendarView.innerHTML = '';

  const daysOfWeek = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'];
  const displayedDate = window.currentDate;
  const today = new Date();
  const currentDayIndex = (displayedDate.getDay() + 6) % 7;

  const startDate = new Date(displayedDate);
  startDate.setDate(displayedDate.getDate() - currentDayIndex);
  startDate.setHours(0, 0, 0, 0); 
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  const weekEvents = events.filter((event) => {
    return (
      (event.startTime >= startDate && event.startTime <= endDate) ||
      (event.endTime >= startDate && event.endTime <= endDate) ||
      (event.startTime < startDate && event.endTime > endDate)
    );
  });

  const weekContainsToday = today >= startDate && today <= endDate;

  let calendarHTML = '<div class="header-row">';
  calendarHTML += `<div class="calendar-day-header">Godz.</div>`;
  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    const dayOfMonth = day.getDate();
    const isToday = today.toDateString() === day.toDateString();
    calendarHTML += `<div class="calendar-day-header${
      isToday ? ' bg-primary text-white' : ''
    }">${daysOfWeek[i]}. ${dayOfMonth}</div>`;
  }
  calendarHTML += '</div>';

  calendarHTML += '<div class="calendar-row" style="position: relative;">';
  calendarHTML += '<div class="calendar-day-hours">';
  for (let hour = 0; hour < 24; hour++) {
    calendarHTML += `<div class="calendar-hour">${hour}:00</div>`;
  }
  calendarHTML += '</div>';

  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    const isToday = today.toDateString() === day.toDateString();

    calendarHTML += `<div class="calendar-day${isToday ? ' current-day' : ''}">
                            <div class="calendar-hours" style="position: relative;">`;
    for (let hour = 0; hour < 24; hour++) {
      calendarHTML += `<div class="calendar-hour"></div>`;
    }
    calendarHTML += `</div></div>`;
  }

  calendarHTML += '</div>';

  calendarView.innerHTML = calendarHTML;

  const dayColumns = calendarView.querySelectorAll(
    '.calendar-row .calendar-day'
  );

  const eventsByDay = Array.from({ length: 7 }, () => []);
  weekEvents.forEach((event) => {
    const eventStartDate = new Date(event.startTime);
    const startDayIndex = (eventStartDate.getDay() + 6) % 7;
    eventsByDay[startDayIndex].push(event);
  });

  eventsByDay.forEach((dayEvents, dayIndex) => {
    const dayColumn = dayColumns[dayIndex].querySelector('.calendar-hours');
    if (!dayColumn) return;

    const eventColumnIndexes = [];

    dayEvents.forEach((event, index) => {
      const eventStartDate = new Date(event.startTime);
      const eventEndDate = new Date(event.endTime);

      const startHour = eventStartDate.getHours();
      const startMinute = eventStartDate.getMinutes();
      const endHour = eventEndDate.getHours();
      const endMinute = eventEndDate.getMinutes();

      const startInMinutes = startHour * 60 + startMinute;
      const endInMinutes = endHour * 60 + endMinute;
      const durationInMinutes = endInMinutes - startInMinutes;

      let columnIndex = 0;
      while (
        eventColumnIndexes[columnIndex] &&
        eventColumnIndexes[columnIndex] > startInMinutes
      ) {
        columnIndex++;
      }
      eventColumnIndexes[columnIndex] = startInMinutes + durationInMinutes;

      const eventElement = document.createElement('div');
      eventElement.className = 'dayViewEvent';
      eventElement.style.left = `${columnIndex * 20}%`; 
      eventElement.style.top = `${(startInMinutes / 1440) * 100}%`;
      eventElement.style.height = `${(durationInMinutes / 1440) * 100}%`;
      // eventElement.style.zIndex = 10 + index; 

      eventElement.innerHTML = `<small>${event.startTime.toLocaleTimeString(
        'pl-PL',
        { hour: '2-digit', minute: '2-digit' }
      )} - ${event.endTime.toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
      })} ${event.title}</small>`;

      dayColumn.appendChild(eventElement);
    });
  });

  if (weekContainsToday) {
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const currentTimeLineTop =
      ((currentHour * 60 + currentMinute) / 1440) * 100;

    const timeLine = document.createElement('div');
    timeLine.className = 'current-time-line';
    timeLine.style.top = `${currentTimeLineTop}%`;

    const currentDayElement = calendarView.querySelector(
      '.current-day .calendar-hours'
    );
    if (currentDayElement) {
      currentDayElement.appendChild(timeLine);
    }
  }
}


function renderDayView() {
  const calendarView = document.getElementById('calendarView');
  calendarView.innerHTML = '';

  const today = window.currentDate;
  const displayedDate = new Date(today);
  const dayOfWeek = today.toLocaleDateString('pl-PL', { weekday: 'short' });
  const dayOfMonth = today.getDate();
  const month = today.toLocaleDateString('pl-PL', { month: 'long' });
  const isToday = displayedDate.toDateString() === new Date().toDateString();

  let calendarHTML = `
    <div class="container-fluid">
      <div class="row">
        <div class="col-3 hour-column">
          <div class="calendar-day-header">Godz.</div>
  `;

  for (let hour = 0; hour < 24; hour++) {
    calendarHTML += `<div class="calendar-hour">${hour}:00</div>`;
  }

  calendarHTML += `
        </div>
        <div class="col-9 current-day-column">
          <div class="header-row">
            <div class="calendar-day-header">${month} ${dayOfWeek} ${dayOfMonth}</div>
          </div>
          <div class="calendar-row" style="position: relative;">
            <div class="calendar-hours">
  `;

  for (let hour = 0; hour < 24; hour++) {
    calendarHTML += `<div class="calendar-hour"></div>`;
  }

  calendarHTML += `
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  calendarView.innerHTML = calendarHTML;

  const dayEvents = events.filter(
    (event) => event.startTime.toDateString() === displayedDate.toDateString()
  );

  if (dayEvents.length > 0) {
    dayEvents.forEach((event, index) => {
      const eventElement = document.createElement('div');
      eventElement.className = 'dayViewEvent';
      eventElement.style.left = `${index * 10}%`;
      eventElement.style.top = `${
        ((event.startTime.getHours() * 60 + event.startTime.getMinutes()) /
          1440) *
        100
      }%`;
      eventElement.style.height = `${
        ((event.endTime.getHours() * 60 +
          event.endTime.getMinutes() -
          event.startTime.getHours() * 60 -
          event.startTime.getMinutes()) /
          1440) *
        100
      }%`;

      // eventElement.style.zIndex = 10 + index;

      eventElement.innerHTML = `<small>${event.startTime.toLocaleTimeString(
        'pl-PL',
        { hour: '2-digit', minute: '2-digit' }
      )} - ${event.endTime.toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
      })} ${event.title}</small>`;

      const currentDayColumn = calendarView.querySelector(
        '.current-day-column .calendar-row .calendar-hours'
      );
      currentDayColumn.appendChild(eventElement);
    });
  }

  if (isToday) {
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const currentTimeLineTop =
      ((currentHour * 60 + currentMinute) / 1440) * 100;

    const timeLine = document.createElement('div');
    timeLine.className = 'current-time-line';
    timeLine.style.top = `${currentTimeLineTop}%`;

    const currentDayElement = calendarView.querySelector(
      '.current-day-column .calendar-row'
    );
    if (currentDayElement) {
      currentDayElement.appendChild(timeLine);
    }
  }
}
