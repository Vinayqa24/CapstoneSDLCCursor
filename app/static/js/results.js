(function () {
  const listEl = document.getElementById("hotel-list");
  const listEmpty = document.getElementById("list-empty");
  const areaSelect = document.getElementById("filter-area");
  const form = document.getElementById("filters");

  Catalog.areas().forEach(function (area) {
    const opt = document.createElement("option");
    opt.value = area;
    opt.textContent = area;
    areaSelect.appendChild(opt);
  });

  function currentFilters() {
    return {
      q: (document.getElementById("filter-q").value || "").trim().toLowerCase(),
      area: areaSelect.value,
      stars: Number(document.getElementById("filter-stars").value) || 0,
      maxPrice: document.getElementById("filter-max-price").value
        ? Number(document.getElementById("filter-max-price").value)
        : null,
      sort: document.getElementById("filter-sort").value,
    };
  }

  function apply(hotels, f) {
    let rows = hotels.filter(function (h) {
      if (f.q && !(h.name.toLowerCase().includes(f.q) || h.area.toLowerCase().includes(f.q))) {
        return false;
      }
      if (f.area && h.area !== f.area) return false;
      if (h.stars < f.stars) return false;
      if (f.maxPrice != null && Number.isFinite(f.maxPrice) && h.nightlyPrice > f.maxPrice) {
        return false;
      }
      return true;
    });
    rows.sort(function (a, b) {
      if (f.sort === "price-desc") return b.nightlyPrice - a.nightlyPrice;
      if (f.sort === "stars-desc") return b.stars - a.stars;
      if (f.sort === "name") return a.name.localeCompare(b.name);
      return a.nightlyPrice - b.nightlyPrice;
    });
    return rows;
  }

  function renderList(rows) {
    listEl.replaceChildren();
    listEmpty.hidden = rows.length > 0;
    rows.forEach(function (hotel) {
      const li = document.createElement("li");
      li.className = "hotel-card";
      li.setAttribute("data-testid", "hotel-card");
      li.setAttribute("data-hotel-id", hotel.id);

      const a = document.createElement("a");
      a.href = "/hotels/" + encodeURIComponent(hotel.id);
      a.setAttribute("data-testid", "hotel-link");
      const title = document.createElement("strong");
      title.textContent = hotel.name;
      a.appendChild(title);
      li.appendChild(a);

      const meta = document.createElement("p");
      meta.textContent = Display.hotelLine(hotel);
      li.appendChild(meta);
      listEl.appendChild(li);
    });
  }

  function refresh() {
    const t0 = performance.now();
    const visible = apply(Catalog.all(), currentFilters());
    renderList(visible);
    if (globalThis.HarborMap) HarborMap.render(visible);
    const dt = performance.now() - t0;
    if (dt > 200) console.warn("filter/sort exceeded 200ms", dt);
  }

  form.addEventListener("input", refresh);
  form.addEventListener("change", refresh);
  refresh();
})();
