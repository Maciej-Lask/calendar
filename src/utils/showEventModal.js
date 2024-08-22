export function showEventModal(event) {
  const startDate = new Date(event.startTime).toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const startTime = new Date(event.startTime).toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const endDate = new Date(event.endTime).toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const endTime = new Date(event.endTime).toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  });

  let modalContent = `
    <h5>${event.title}</h5>
    <p><strong>Data:</strong> ${startDate} - ${endDate}</p>
    <p><strong>Godzina rozpoczęcia:</strong> ${startTime}</p>
    <p><strong>Godzina zakończenia:</strong> ${endTime}</p>
    <p><strong>Opis:</strong> ${event.description}</p>
  `;

  if (event.canBeBooked) {
   
    if (event.isBooked) {
      modalContent += `<p><strong>Zarezerwowane:</strong> Tak</p>`;
    } else {
      modalContent += `<p><strong>Możliwość rezerwacji:</strong> Tak</p>`;
      modalContent += `<p><strong>Zarezerwowane:</strong> Nie</p>`;
    }
  } else {
    modalContent += `<p><strong>Możliwość rezerwacji:</strong> Nie</p>`;
  }

  const modalBody = document.querySelector('#eventModal .modal-body');
  modalBody.innerHTML = modalContent;

  const modalFooter = document.querySelector('#eventModal .modal-footer');
  modalFooter.innerHTML = '';

  if (window.userRole === 'client') {
    if (event.canBeBooked && !event.isBooked) {
      const bookButton = document.createElement('button');
      bookButton.id = 'bookEventButton';
      bookButton.type = 'button';
      bookButton.className = 'btn btn-success';
      bookButton.innerText = 'Zarezerwuj';

      bookButton.onclick = () => {
        const updatedEvent = { ...event, isBooked: true };
        updateEvent(updatedEvent);
        const eventModal = bootstrap.Modal.getInstance(
          document.getElementById('eventModal')
        );
        if (eventModal) {
          eventModal.hide();
        }
      };

      modalFooter.appendChild(bookButton);
    }
  } else {
    const editButton = document.createElement('button');
    editButton.id = 'editEventButton';
    editButton.type = 'button';
    editButton.className = 'btn btn-primary';
    editButton.innerText = 'Edytuj wydarzenie';

    const deleteButton = document.createElement('button');
    deleteButton.id = 'deleteEventButton';
    deleteButton.type = 'button';
    deleteButton.className = 'btn btn-danger';
    deleteButton.innerText = 'Usuń wydarzenie';

    modalFooter.appendChild(editButton);
    modalFooter.appendChild(deleteButton);

    deleteButton.onclick = () => {
      deleteEvent(event.id);
      const eventModal = bootstrap.Modal.getInstance(
        document.getElementById('eventModal')
      );
      if (eventModal) {
        eventModal.hide();
      }
    };

    editButton.onclick = () => {
      showEditEventForm(event);
      const eventModal = bootstrap.Modal.getInstance(
        document.getElementById('eventModal')
      );
      if (eventModal) {
        eventModal.hide();
      }
    };
  }

  const eventModal = new bootstrap.Modal(document.getElementById('eventModal'));
  eventModal.show();
}

function showEditEventForm(event) {
  document.getElementById('editEventId').value = event.id;
  document.getElementById('editEventTitle').value = event.title;
  document.getElementById('editEventDate').value = new Date(event.startTime)
    .toISOString()
    .split('T')[0];
  document.getElementById('editEventStartTime').value = new Date(
    event.startTime
  ).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  document.getElementById('editEventEndTime').value = new Date(
    event.endTime
  ).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  document.getElementById('editEventDescription').value = event.description;

  document.getElementById('editCanBeBooked').checked = event.canBeBooked;
  document.getElementById('editIsBooked').checked = event.isBooked;

  const editEventModal = new bootstrap.Modal(
    document.getElementById('editEventModal')
  );
  editEventModal.show();

  const saveEditedEventBtn = document.getElementById('saveEditedEventBtn');
  saveEditedEventBtn.onclick = () => {
    const updatedEvent = {
      id: document.getElementById('editEventId').value,
      title: document.getElementById('editEventTitle').value,
      startTime: `${document.getElementById('editEventDate').value}T${
        document.getElementById('editEventStartTime').value
      }:00`,
      endTime: `${document.getElementById('editEventDate').value}T${
        document.getElementById('editEventEndTime').value
      }:00`,
      description: document.getElementById('editEventDescription').value,
      canBeBooked: document.getElementById('editCanBeBooked').checked,
      isBooked: document.getElementById('editIsBooked').checked,
    };

    updateEvent(updatedEvent);
    const editModalInstance = bootstrap.Modal.getInstance(
      document.getElementById('editEventModal')
    );
    if (editModalInstance) {
      editModalInstance.hide();
    }
  };
}
