(function (global) {
  function burst() {
    const canvas = document.getElementById("confetti");
    if (!canvas || !canvas.getContext) return;
    canvas.hidden = false;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = 160;
    const bits = Array.from({ length: 40 }, function () {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * 40,
        r: 3 + Math.random() * 4,
        v: 1 + Math.random() * 3,
        c: ["#1f6f8b", "#e8c547", "#fa7e61", "#4caf91"][Math.floor(Math.random() * 4)],
      };
    });
    let frames = 0;
    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bits.forEach(function (b) {
        b.y += b.v;
        ctx.fillStyle = b.c;
        ctx.fillRect(b.x, b.y, b.r, b.r);
      });
      frames += 1;
      if (frames < 80) requestAnimationFrame(tick);
      else canvas.hidden = true;
    }
    tick();
  }
  global.HarborConfetti = { burst };
})(window);
