(function () {
  const hotel = Catalog.byId(window.HOTEL_ID);
  const missing = document.getElementById("hotel-missing");
  const step = document.getElementById("room-step");
  if (!hotel) {
    missing.hidden = false;
    return;
  }
  missing.hidden = true;
  step.hidden = false;
  BookingState.hydrateFromHotel(hotel);
  document.getElementById("room-hotel").textContent = hotel.name + " · " + Display.hotelLine(hotel);

  const box = document.getElementById("room-options");
  const draft = BookingState.load();
  hotel.rooms.forEach(function (room, i) {
    const id = "room-" + room.id;
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "roomId";
    input.value = room.id;
    input.required = true;
    input.id = id;
    input.setAttribute("data-testid", "room-option");
    if ((draft && draft.roomId === room.id) || (!draft.roomId && i === 0)) input.checked = true;
    const span = document.createElement("span");
    span.textContent = room.name + " — " + Display.money(room.price);
    label.appendChild(input);
    label.appendChild(span);
    box.appendChild(label);
  });

  document.getElementById("room-form").addEventListener("submit", function (ev) {
    ev.preventDefault();
    const selected = box.querySelector("input[name=roomId]:checked");
    const room = hotel.rooms.find((r) => r.id === selected.value);
    BookingState.hydrateFromHotel(hotel, {
      roomId: room.id,
      roomName: room.name,
      nightlyPrice: room.price,
    });
    window.location.href = "/book/" + encodeURIComponent(hotel.id) + "/guest";
  });
})();
