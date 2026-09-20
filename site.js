(function(){
  // The measured score lives in the HTML and the CSS: a reader without
  // JavaScript (a crawler, an agent) sees 57/100 and the filled loop. This
  // script only replays it as an animation, and only when it starts early
  // enough that the visitor has not already seen the final state.
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var arc = document.getElementById('arc'), num = document.getElementById('num');
  var SCORE = 57, LENGTH = arc.getTotalLength();
  function draw(){ arc.style.strokeDasharray = (LENGTH * SCORE / 100) + ' ' + LENGTH; }
  if (!reduce && performance.now() < 1500) {
    arc.style.transition = 'none';
    arc.style.strokeDasharray = '0 ' + LENGTH;
    num.textContent = '0';
    arc.getBoundingClientRect();
    arc.style.transition = '';
    requestAnimationFrame(function(){ setTimeout(draw, 250); });
    var start = null;
    (function step(now){
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / 2200), eased = 1 - Math.pow(1 - t, 3);
      num.textContent = Math.round(SCORE * eased);
      if (t < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  if ('IntersectionObserver' in window && !reduce) {
    document.documentElement.classList.add('js');
    var seen = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){ if (entry.isIntersecting) { entry.target.classList.add('seen'); seen.unobserve(entry.target); } });
    }, {threshold: 0, rootMargin: '0px 0px -8% 0px'});
    document.querySelectorAll('.reveal').forEach(function(el){ seen.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('seen'); });
  }
})();
