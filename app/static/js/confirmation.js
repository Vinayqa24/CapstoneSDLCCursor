(function () {
  const draft = BookingState.load();
  const missing = document.getElementById("confirm-missing");
  const panel = document.getElementById("confirm-panel");
  if (!draft || !draft.confirmation) {
    missing.hidden = false;
    return;
  }
  panel.hidden = false;
  document.getElementById("confirm-ref").textContent = draft.confirmation;
  document.getElementById("confirm-summary").textContent =
    draft.hotelName + " · " + draft.roomName + " · " + draft.fullName;
  if (window.HarborConfetti) HarborConfetti.burst();
  document.getElementById("back-to-results").addEventListener("click", function () {
    BookingState.clear();
  });
})();
