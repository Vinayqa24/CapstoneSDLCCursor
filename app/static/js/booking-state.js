(function (global) {
  const KEY = "hotelBookingDraft";

  function load() {
    try {
      const raw = sessionStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.warn("booking draft unreadable", err);
      return null;
    }
  }

  function save(draft) {
    sessionStorage.setItem(KEY, JSON.stringify(draft));
  }

  function clear() {
    sessionStorage.removeItem(KEY);
  }

  function hydrateFromHotel(hotel, extras) {
    const prev = load() || {};
    const sameHotel = prev.hotelId === hotel.id;
    const draft = {
      hotelId: hotel.id,
      hotelName: hotel.name,
      area: hotel.area,
      roomId: sameHotel ? prev.roomId : null,
      roomName: sameHotel ? prev.roomName : null,
      nightlyPrice: sameHotel && prev.nightlyPrice != null ? prev.nightlyPrice : hotel.nightlyPrice,
      fullName: sameHotel ? prev.fullName : "",
      email: sameHotel ? prev.email : "",
      confirmation: null,
    };
    Object.assign(draft, extras || {});
    save(draft);
    return draft;
  }

  global.BookingState = { KEY, load, save, clear, hydrateFromHotel };
})(window);
