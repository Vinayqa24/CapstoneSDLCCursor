(function () {
  const draft = BookingState.load();
  const missing = document.getElementById("draft-missing");
  const step = document.getElementById("pay-step");
  if (!draft || draft.hotelId !== window.HOTEL_ID || !draft.roomId || !draft.fullName) {
    missing.hidden = false;
    return;
  }
  step.hidden = false;
  document.getElementById("pay-summary").textContent =
    draft.hotelName +
    " · " +
    draft.roomName +
    " · " +
    Display.money(draft.nightlyPrice) +
    " · " +
    draft.fullName;

  document.getElementById("pay-confirm").addEventListener("click", function () {
    const btn = this;
    btn.disabled = true;
    btn.textContent = "Confirming…";
    setTimeout(function () {
      draft.confirmation = "HB-" + String(Date.now()).slice(-8);
      BookingState.save(draft);
      window.location.href = "/confirmation";
    }, 400);
  });
})();
