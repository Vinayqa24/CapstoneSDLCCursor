(function () {
  const draft = BookingState.load();
  const missing = document.getElementById("draft-missing");
  const form = document.getElementById("guest-form");
  if (!draft || draft.hotelId !== window.HOTEL_ID || !draft.roomId) {
    missing.hidden = false;
    return;
  }
  form.hidden = false;
  document.getElementById("guest-name").value = draft.fullName || "";
  document.getElementById("guest-email").value = draft.email || "";
  const err = document.getElementById("guest-error");

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    const fullName = document.getElementById("guest-name").value.trim();
    const email = document.getElementById("guest-email").value.trim();
    if (fullName.length < 2 || !email.includes("@")) {
      err.hidden = false;
      err.textContent = "Enter a name and a valid email.";
      return;
    }
    err.hidden = true;
    draft.fullName = fullName;
    draft.email = email;
    BookingState.save(draft);
    window.location.href = "/book/" + encodeURIComponent(draft.hotelId) + "/payment";
  });
})();
