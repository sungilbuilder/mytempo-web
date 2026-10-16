/* 받은 템포 페이지 (2026-10-16, 앱 T-113 5단계). 설명은 t/index.html 머리 주석. */
(function () {
  var en = true;
  var langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
  for (var i = 0; i < langs.length; i++) if (/^ko/i.test(langs[i])) en = false;

  var CLUBS = {
    driver: ['드라이버', 'Driver'],
    iron: ['아이언', 'Iron'],
    approach: ['어프로치', 'Approach'],
    putting: ['퍼팅', 'Putting'],
  };
  var T = en
    ? {
        title: 'Received tempo',
        detail: function (b, d) { return 'Backswing ' + b + 's · downswing ' + d + 's'; },
        rounded: function (v) { return '≈' + v; },
        open: 'Open in MYTEMPO',
        noapp: "Don't have the app yet? Get it first, then open this link again.",
        invalid: "Couldn't read the tempo in this link. Ask the sender to send it again.",
      }
    : {
        title: '받은 템포',
        detail: function (b, d) { return '백스윙 ' + b + '초 · 다운스윙 ' + d + '초'; },
        rounded: function (v) { return '약 ' + v; },
        open: '마이템포에서 열기',
        noapp: '앱이 없으면 먼저 받아 주세요. 받은 뒤 이 링크를 다시 열면 돼요.',
        invalid: '링크의 템포를 읽지 못했어요. 보낸 분께 다시 보내 달라고 해 주세요.',
      };
  if (en) {
    document.documentElement.lang = 'en';
    document.title = 'Received tempo · mytempo';
  }
  function $(id) { return document.getElementById(id); }
  $('title').textContent = T.title;

  var p = {};
  location.hash.replace(/^#/, '').split('&').forEach(function (kv) {
    var i = kv.indexOf('=');
    if (i > 0) p[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1));
  });
  var b = Number(p.b), d = Number(p.d), f = Number(p.f);
  var ok = isFinite(b) && isFinite(d) && b >= 0.05 && d >= 0.05 && b + d >= 0.4 && b + d <= 3;
  if (!ok) {
    $('invalid').textContent = T.invalid;
    $('invalid').hidden = false;
    return;
  }
  var club = CLUBS.hasOwnProperty(p.c) ? p.c : '';
  var r = b / d;
  // 앱 precisionForFps와 같다: 60fps 이상이면 소수 첫째 자리, 모르거나 그 아래면 정수에 「약」
  $('ratio').textContent = f >= 60 ? (Math.round(r * 10) / 10).toFixed(1) + ':1' : T.rounded(Math.round(r) + ':1');
  $('detail').textContent = (club ? CLUBS[club][en ? 1 : 0] + ' · ' : '') + T.detail(b.toFixed(2), d.toFixed(2));
  $('open').textContent = T.open;
  $('noapp').textContent = T.noapp;

  var q = 'b=' + b.toFixed(2) + '&d=' + d.toFixed(2) + (club ? '&c=' + club : '') + (f > 0 && f <= 1000 ? '&f=' + Math.round(f) : '');
  var play = $('play').href;
  // 안드로이드는 intent 주소로: 앱이 없으면 브라우저가 Play로 넘어간다. 카카오톡 안 브라우저도 이 형식을 연다
  $('open').href = /android/i.test(navigator.userAgent)
    ? 'intent://receive?' + q + '#Intent;scheme=mytempo;package=com.mytempo.golf;S.browser_fallback_url=' + encodeURIComponent(play) + ';end'
    : 'mytempo://receive?' + q;
  $('tempo').hidden = false;
})();
