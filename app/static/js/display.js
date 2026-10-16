(function (global) {
  function money(n) {
    return "$" + Number(n).toFixed(0);
  }

  function stars(n) {
    return `${n} star${n === 1 ? "" : "s"}`;
  }

  function hotelLine(hotel) {
    return `${hotel.area} · ${stars(hotel.stars)} · ${money(hotel.nightlyPrice)} / night`;
  }

  global.Display = { money, stars, hotelLine };
})(window);
