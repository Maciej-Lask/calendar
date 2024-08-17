import { events } from '../utils/events.js';
export function renderDayView() {
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

  const dayEventsSorted = dayEvents.sort((a, b) => {
    return a.startTime - b.startTime;
  });

  if (dayEventsSorted.length > 0) {
    const overlappingGroups = [];

    dayEventsSorted.forEach((event, index) => {
      if (overlappingGroups.length === 0) {
        overlappingGroups.push([event]);
      } else {
        const lastGroup = overlappingGroups[overlappingGroups.length - 1];
        const lastEventInGroup = lastGroup[lastGroup.length - 1];

        if (event.startTime < lastEventInGroup.endTime) {
          lastGroup.push(event);
        } else {
          overlappingGroups.push([event]);
        }
      }
    });
    console.log(overlappingGroups);
    overlappingGroups.forEach((group) => {
      const groupSize = group.length;

      group.forEach((event, index) => {
        const eventElement = document.createElement('div');
        eventElement.className = 'dayViewEvent';
        eventElement.style.top = `${
          ((event.startTime.getHours() * 60 + event.startTime.getMinutes()) /
            1440) *
          100
        }%`;

        if (
          event.endTime.getHours() * 60 +
            event.endTime.getMinutes() -
            event.startTime.getHours() * 60 -
            event.startTime.getMinutes() <
          31
        ) {
          eventElement.style.height = '4%';
        } else {
          eventElement.style.height = `${
            ((event.endTime.getHours() * 60 +
              event.endTime.getMinutes() -
              event.startTime.getHours() * 60 -
              event.startTime.getMinutes()) /
              1440) *
            100
          }%`;
        }

        eventElement.style.width = `${100 / groupSize}%`;
        eventElement.style.left = `${(100 / groupSize) * index}%`;

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
