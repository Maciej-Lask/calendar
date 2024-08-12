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
    let isToday = false;
    if (
      today.toDateString() ===
      new Date(currentYear, currentMonth, day).toDateString()
    ) {
      isToday = true;
    }
    const dayClass = isToday
      ? 'month-calendar-day bg-primary text-white'
      : 'month-calendar-day';

    calendarHTML += `<div class="${dayClass}"><strong>${day}</strong></div>`;
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

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
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
  calendarHTML += '<div class="calendar-day">';
  for (let hour = 0; hour < 24; hour++) {
    calendarHTML += `<div class="calendar-hour">${hour}:00</div>`;
  }
  calendarHTML += '</div>';

  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    const isToday = today.toDateString() === day.toDateString();

    calendarHTML += `<div class="calendar-day${isToday ? ' current-day' : ''}">
                            <div class="calendar-hours">`;
    for (let hour = 0; hour < 24; hour++) {
      calendarHTML += `<div class="calendar-hour"></div>`;
    }
    calendarHTML += `</div></div>`;
  }

  calendarHTML += '</div>';

  calendarView.innerHTML = calendarHTML;

  if (weekContainsToday) {
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const currentTimeLineTop =
      ((currentHour * 60 + currentMinute) / 1440) * 100;

    const timeLine = document.createElement('div');
    timeLine.className = 'current-time-line';
    timeLine.style.top = `${currentTimeLineTop}%`;

    const currentDayElement = calendarView.querySelector('.current-day');
    if (currentDayElement) {
      currentDayElement.querySelector('.calendar-hours').appendChild(timeLine);
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
