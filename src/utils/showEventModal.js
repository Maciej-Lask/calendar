
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

  const modalContent = `
    <h5>${event.title}</h5>
    <p><strong>Data:</strong> ${startDate} - ${endDate}</p>
    <p><strong>Godzina rozpoczęcia:</strong> ${startTime}</p>
    <p><strong>Godzina zakończenia:</strong> ${endTime}</p>
    <p><strong>Opis:</strong> ${event.description}</p>
  `;

  const modalBody = document.querySelector('#eventModal .modal-body');
  modalBody.innerHTML = modalContent;

  const deleteButton = document.getElementById('deleteEventButton');
  const editButton = document.getElementById('editEventButton');

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
