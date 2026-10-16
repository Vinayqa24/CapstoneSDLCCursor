(function (global) {
  const EMPTY = document.getElementById("map-empty");
  const NO_COORDS = document.getElementById("map-no-coords");
  const FALLBACK = document.getElementById("map-fallback");
  const ROOT = document.getElementById("results-map");

  let map = null;
  let layer = null;

  function isPlottable(hotel) {
    const lat = Number(hotel.lat);
    const lng = Number(hotel.lng);
    return (
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  }

  function show(el, on) {
    if (!el) return;
    el.hidden = !on;
  }

  function ensureMap() {
    if (map) return true;
    if (typeof L === "undefined" || !ROOT) {
      show(FALLBACK, true);
      show(EMPTY, false);
      show(NO_COORDS, false);
      return false;
    }
    show(FALLBACK, false);
    map = L.map(ROOT, { keyboard: true, scrollWheelZoom: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    layer = L.layerGroup().addTo(map);
    map.setView([47.61, -122.34], 13);
    return true;
  }

  function popupFor(hotel) {
    const root = document.createElement("div");
    root.setAttribute("data-testid", "map-popup");

    const title = document.createElement("strong");
    title.textContent = hotel.name;
    root.appendChild(title);

    const meta = document.createElement("p");
    meta.textContent = Display.hotelLine(hotel);
    root.appendChild(meta);

    const actions = document.createElement("p");
    const details = document.createElement("a");
    details.href = "/hotels/" + encodeURIComponent(hotel.id);
    details.setAttribute("data-testid", "map-view-details");
    details.textContent = "View details";
    const book = document.createElement("a");
    book.href = "/book/" + encodeURIComponent(hotel.id) + "/room";
    book.setAttribute("data-testid", "map-book");
    book.textContent = "Book";
    actions.appendChild(details);
    actions.appendChild(document.createTextNode(" · "));
    actions.appendChild(book);
    root.appendChild(actions);
    return root;
  }

  function render(visibleHotels) {
    const started = performance.now();
    const list = visibleHotels || [];

    if (!ensureMap()) return;

    layer.clearLayers();

    if (list.length === 0) {
      show(EMPTY, true);
      show(NO_COORDS, false);
      return;
    }

    const plottable = list.filter(isPlottable);
    if (plottable.length === 0) {
      show(EMPTY, false);
      show(NO_COORDS, true);
      return;
    }

    show(EMPTY, false);
    show(NO_COORDS, false);

    const bounds = [];
    plottable.forEach(function (hotel) {
      const latlng = [Number(hotel.lat), Number(hotel.lng)];
      bounds.push(latlng);
      const marker = L.marker(latlng, {
        keyboard: true,
        title: hotel.name,
        alt: hotel.name,
        icon: L.divIcon({
          className: "harbor-marker",
          html: '<span class="harbor-marker-dot"></span>',
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        }),
      });
      marker.bindPopup(popupFor(hotel));
      marker.on("add", function () {
        const el = marker.getElement();
        if (!el) return;
        el.setAttribute("data-testid", "map-marker");
        el.setAttribute("data-hotel-id", hotel.id);
        el.setAttribute("role", "button");
        el.setAttribute("aria-label", hotel.name);
        el.tabIndex = 0;
      });
      marker.addTo(layer);
    });

    if (bounds.length === 1) {
      map.setView(bounds[0], 14);
    } else {
      map.fitBounds(bounds, { padding: [28, 28], maxZoom: 15 });
    }
    map.invalidateSize();

    const elapsed = performance.now() - started;
    if (elapsed > 500) {
      console.warn("map marker refresh exceeded 500ms", elapsed);
    }
  }

  global.HarborMap = { render, isPlottable };
})(window);
