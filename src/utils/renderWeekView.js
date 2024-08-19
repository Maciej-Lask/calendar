export function renderWeekView() {
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

  const weekEvents = window.events.filter((event) => {
    const eventStartTime = new Date(event.startTime);
    const eventEndTime = new Date(event.endTime);
    return (
      (eventStartTime >= startDate && eventStartTime <= endDate) ||
      (eventEndTime >= startDate && eventEndTime <= endDate) ||
      (eventStartTime < startDate && eventEndTime > endDate)
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

    const sortedEvents = dayEvents
      .slice()
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    const overlappingGroups = [];

    sortedEvents.forEach((event) => {
      let added = false;
      for (const group of overlappingGroups) {
        if (
          new Date(event.startTime) < new Date(group[group.length - 1].endTime)
        ) {
          group.push(event);
          added = true;
          break;
        }
      }
      if (!added) {
        overlappingGroups.push([event]);
      }
    });

    overlappingGroups.forEach((group) => {
      const groupSize = group.length;

      group.forEach((event, index) => {
        const eventElement = document.createElement('div');
        eventElement.className = 'dayViewEvent';
        eventElement.style.left = `${(100 / groupSize) * index}%`;
        eventElement.style.top = `${
          ((new Date(event.startTime).getHours() * 60 +
            new Date(event.startTime).getMinutes()) /
            1440) *
          100
        }%`;

        const durationInMinutes =
          new Date(event.endTime).getHours() * 60 +
          new Date(event.endTime).getMinutes() -
          (new Date(event.startTime).getHours() * 60 +
            new Date(event.startTime).getMinutes());

        if (durationInMinutes < 60) {
          eventElement.style.height = '4%';
        } else {
          eventElement.style.height = `${(durationInMinutes / 1440) * 100}%`;
        }
        eventElement.style.width = `${100 / groupSize}%`;

        eventElement.innerHTML = `<small>${new Date(
          event.startTime
        ).toLocaleTimeString('pl-PL', {
          hour: '2-digit',
          minute: '2-digit',
        })} - ${new Date(event.endTime).toLocaleTimeString('pl-PL', {
          hour: '2-digit',
          minute: '2-digit',
        })} ${event.title}</small>`;

        dayColumn.appendChild(eventElement);
      });
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
