/* 출시 뒤 스토어 버튼(2026-10-28): 버튼 두 개를 같은 무게로 두지 않는다(AI 티 금지 47).
   아이폰 · 아이패드 · 맥에서 열면 App Store를 주 버튼으로, 그 밖에는 Google Play를 주 버튼으로.
   인라인이 아니라 파일인 이유: 페이지 CSP가 인라인 스크립트를 해시로만 허용한다. */
(function () {
  if (!/iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)) return;
  Array.prototype.forEach.call(document.querySelectorAll('.store-cta'), function (row) {
    var play = row.querySelector('[data-store="play"]'), ios = row.querySelector('[data-store="ios"]');
    play.className = 'btn-ghost'; ios.className = 'btn-primary'; row.insertBefore(ios, play);
  });
})();
