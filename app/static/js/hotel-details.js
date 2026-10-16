(function () {
  const hotel = Catalog.byId(window.HOTEL_ID);
  const missing = document.getElementById("hotel-missing");
  const panel = document.getElementById("hotel-details");
  if (!hotel) {
    missing.hidden = false;
    return;
  }
  missing.hidden = true;
  panel.hidden = false;
  document.getElementById("hotel-name").textContent = hotel.name;
  document.getElementById("hotel-meta").textContent = Display.hotelLine(hotel);
  document.getElementById("hotel-blurb").textContent = hotel.blurb;
  const book = document.getElementById("book-from-details");
  book.href = "/book/" + encodeURIComponent(hotel.id) + "/room";
})();
