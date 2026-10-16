(function (global) {
  const HOTELS = [
    {
      id: "hotel-01",
      name: "Brine & Beacon Inn",
      area: "Harbor District",
      stars: 4,
      nightlyPrice: 189,
      blurb: "Windows over the working piers.",
      lat: 47.6062,
      lng: -122.3321,
      rooms: [
        { id: "std", name: "Standard queen", price: 189 },
        { id: "dlx", name: "Harbor king", price: 249 },
      ],
    },
    {
      id: "hotel-02",
      name: "Cobbled Court Hotel",
      area: "Old Town",
      stars: 3,
      nightlyPrice: 129,
      blurb: "Brick courtyard and a late bakery next door.",
      lat: 47.6097,
      lng: -122.3331,
      rooms: [
        { id: "std", name: "Courtyard double", price: 129 },
        { id: "ste", name: "Attic suite", price: 199 },
      ],
    },
    {
      id: "hotel-03",
      name: "Ridge Lookout Lodge",
      area: "Ridge",
      stars: 5,
      nightlyPrice: 310,
      blurb: "Quiet ridge, long views, small spa.",
      lat: 47.6205,
      lng: -122.3493,
      rooms: [
        { id: "std", name: "View queen", price: 310 },
        { id: "ste", name: "Lookout suite", price: 420 },
      ],
    },
    {
      id: "hotel-04",
      name: "Ferry Slip Suites",
      area: "Harbor District",
      stars: 4,
      nightlyPrice: 220,
      blurb: "Steps from the passenger dock.",
      lat: 47.6026,
      lng: -122.3394,
      rooms: [
        { id: "std", name: "Slip queen", price: 220 },
        { id: "dlx", name: "Corner king", price: 275 },
      ],
    },
    {
      id: "hotel-05",
      name: "Lantern Row Rooms",
      area: "Old Town",
      stars: 3,
      nightlyPrice: 99,
      blurb: "Narrow street, good coffee, thin walls.",
      lat: 47.6112,
      lng: -122.337,
      rooms: [{ id: "std", name: "Row twin", price: 99 }],
    },
    {
      id: "hotel-06",
      name: "Cedar Spine Inn",
      area: "Ridge",
      stars: 4,
      nightlyPrice: 175,
      blurb: "Trail access and a wood-fired dining room.",
      lat: 47.6309,
      lng: -122.3518,
      rooms: [
        { id: "std", name: "Cedar queen", price: 175 },
        { id: "dlx", name: "Spine loft", price: 230 },
      ],
    },
    {
      id: "hotel-07",
      name: "Pilot House Hotel",
      area: "Harbor District",
      stars: 5,
      nightlyPrice: 340,
      blurb: "Former chart room, now a small luxury house.",
      lat: 47.6079,
      lng: -122.3428,
      rooms: [
        { id: "dlx", name: "Pilot king", price: 340 },
        { id: "ste", name: "Chart suite", price: 455 },
      ],
    },
    {
      id: "hotel-08",
      name: "Market Stair Inn",
      area: "Old Town",
      stars: 2,
      nightlyPrice: 79,
      blurb: "Above the morning stallholders.",
      lat: 47.6089,
      lng: -122.3405,
      rooms: [{ id: "std", name: "Stair single", price: 79 }],
    },
    {
      id: "hotel-09",
      name: "Windbreak Cabins",
      area: "Ridge",
      stars: 3,
      nightlyPrice: 145,
      blurb: "Scattered cabins, shared fire pit.",
      lat: 47.6251,
      lng: -122.3612,
      rooms: [{ id: "std", name: "Cabin queen", price: 145 }],
    },
    {
      id: "hotel-10",
      name: "Saltline Hostel-Hotel",
      area: "Harbor District",
      stars: 2,
      nightlyPrice: 68,
      blurb: "Bunk-free rooms, shared kitchen.",
      lat: 47.5998,
      lng: -122.331,
      rooms: [{ id: "std", name: "Saltline double", price: 68 }],
    },
    {
      id: "hotel-11",
      name: "Glass Wharf Hotel",
      area: "Harbor District",
      stars: 5,
      nightlyPrice: 289,
      blurb: "Curtain wall facing the container cranes.",
      lat: 47.6145,
      lng: -122.328,
      rooms: [
        { id: "dlx", name: "Wharf king", price: 289 },
        { id: "ste", name: "Crane suite", price: 390 },
      ],
    },
    {
      id: "hotel-12",
      name: "Mistview Inn",
      area: "Offshore",
      stars: 3,
      nightlyPrice: 160,
      blurb: "Listed for booking; coordinates not published.",
      lat: null,
      lng: null,
      rooms: [{ id: "std", name: "Mist queen", price: 160 }],
    },
  ];

  function all() {
    return HOTELS.slice();
  }

  function byId(id) {
    return HOTELS.find((h) => h.id === id) || null;
  }

  function areas() {
    return [...new Set(HOTELS.map((h) => h.area))].sort();
  }

  global.Catalog = { all, byId, areas };
})(window);
