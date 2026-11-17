/* Original illustrations drawn in SVG (no external images). */
(function () {
  var NAVY = '#0b2a66', BLUE = '#1f5fbf', SKY = '#8fb4ee', MIST = '#dbe7fb', ACC = '#e4572e', ACC2 = '#b8381a', CREAM = '#fff6e5', LEAF = '#2f7d4f';
  function bottle(w) {
    return '<svg viewBox="0 0 120 270" width="' + (w || 120) + '" height="' + ((w || 120) * 2.25) + '" aria-hidden="true"><defs><linearGradient id="sg" x1="0" x2="1"><stop offset="0" stop-color="' + ACC2 + '"/><stop offset=".45" stop-color="' + ACC + '"/><stop offset="1" stop-color="' + ACC2 + '"/></linearGradient></defs>' +
      '<rect x="44" y="6" width="32" height="30" rx="6" fill="' + NAVY + '"/><rect x="40" y="30" width="40" height="10" rx="3" fill="#143a85"/>' +
      '<path d="M46 40h28v26c0 14 22 24 22 46v128c0 12-8 20-20 20H44c-12 0-20-8-20-20V112c0-22 22-32 22-46z" fill="url(#sg)"/>' +
      '<path d="M34 112c0-14 8-20 14-26" stroke="#fff" stroke-opacity=".35" stroke-width="5" stroke-linecap="round" fill="none"/>' +
      '<rect x="30" y="128" width="60" height="92" rx="8" fill="' + CREAM + '"/><rect x="30" y="128" width="60" height="14" rx="4" fill="' + NAVY + '"/>' +
      '<path d="M60 150c-10 8-12 16-6 24 3 4 8 6 12 2 5-5 2-12-2-16 4 1 8 5 8 11 0 8-6 14-12 14-9 0-14-8-12-16 1-8 8-12 12-19z" fill="' + ACC + '"/>' +
      '<rect x="40" y="198" width="40" height="5" rx="2.5" fill="' + SKY + '"/><rect x="46" y="208" width="28" height="4" rx="2" fill="' + MIST + '"/></svg>';
  }
  function chili(w, rot) {
    return '<svg viewBox="0 0 140 70" width="' + (w || 120) + '" height="' + ((w || 120) / 2) + '" style="transform:rotate(' + (rot || 0) + 'deg)" aria-hidden="true"><path d="M10 38C34 10 80 8 118 30c8 5 12 12 6 16-6 4-16 0-24-2-34-8-62 0-84 4-8 1-12-6-6-10z" fill="' + ACC + '"/><path d="M20 30c20-12 50-14 78-6" stroke="#fff" stroke-opacity=".35" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M116 28c8-12 16-14 20-10-2 6-6 10-12 14z" fill="' + LEAF + '"/></svg>';
  }
  function stall(w) {
    var s = ''; for (var i = 0; i < 6; i++) s += '<path d="M' + (10 + i * 25) + ' 40h25l-4 32h-17z" fill="' + (i % 2 ? '#fff' : BLUE) + '"/>';
    return '<svg viewBox="0 0 170 150" width="' + (w || 150) + '" height="' + ((w || 150) * 150 / 170) + '" aria-hidden="true"><path d="M10 40L28 8h114l18 32z" fill="' + NAVY + '"/>' + s + '<rect x="16" y="76" width="138" height="12" rx="3" fill="#143a85"/><rect x="22" y="88" width="126" height="56" rx="4" fill="' + MIST + '"/><rect x="40" y="98" width="20" height="34" rx="5" fill="' + ACC + '"/><rect x="70" y="98" width="20" height="34" rx="5" fill="' + ACC2 + '"/><rect x="100" y="98" width="20" height="34" rx="5" fill="' + ACC + '"/></svg>';
  }
  function phone(w) {
    return '<svg viewBox="0 0 90 150" width="' + (w || 80) + '" height="' + ((w || 80) * 150 / 90) + '" aria-hidden="true"><rect x="6" y="4" width="78" height="142" rx="14" fill="' + NAVY + '"/><rect x="13" y="16" width="64" height="116" rx="6" fill="#fff"/><circle cx="45" cy="38" r="12" fill="' + SKY + '"/><rect x="22" y="58" width="46" height="8" rx="4" fill="' + MIST + '"/><rect x="22" y="72" width="34" height="8" rx="4" fill="' + MIST + '"/><rect x="22" y="92" width="46" height="26" rx="6" fill="' + ACC + '"/></svg>';
  }
  function miniChart(w) {
    return '<svg viewBox="0 0 180 110" width="' + (w || 170) + '" height="' + ((w || 170) * 110 / 180) + '" aria-hidden="true"><rect width="180" height="110" rx="14" fill="#fff"/><rect x="18" y="62" width="22" height="30" rx="4" fill="' + SKY + '"/><rect x="50" y="48" width="22" height="44" rx="4" fill="#5b8fe0"/><rect x="82" y="30" width="22" height="62" rx="4" fill="' + ACC + '"/><rect x="114" y="52" width="22" height="40" rx="4" fill="#5b8fe0"/><rect x="146" y="68" width="18" height="24" rx="4" fill="' + SKY + '"/><rect x="18" y="14" width="60" height="7" rx="3.5" fill="' + MIST + '"/></svg>';
  }
  function hero() {
    return '<svg viewBox="0 0 560 380" class="heroart" aria-hidden="true"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b2a66"/><stop offset="1" stop-color="#2f6fd6"/></linearGradient></defs>' +
      '<rect width="560" height="380" rx="28" fill="url(#hg)"/><circle cx="470" cy="70" r="120" fill="#fff" fill-opacity=".07"/><circle cx="60" cy="340" r="150" fill="#fff" fill-opacity=".06"/><circle cx="300" cy="190" r="140" fill="#fff" fill-opacity=".08"/>' +
      '<g transform="translate(46 190)">' + stall(150) + '</g><g transform="translate(222 50)">' + bottle(112) + '</g><g transform="translate(350 40)">' + miniChart(170) + '</g><g transform="translate(372 170)">' + phone(78) + '</g>' +
      '<g transform="translate(330 290)">' + chili(120, -12) + '</g><g transform="translate(170 300)">' + chili(100, 8) + '</g></svg>';
  }
  function photo(name, svg, cls) {
    return '<div class="ph ' + (cls || '') + '">' + svg + '<img src="images/' + name + '.jpg" alt="" loading="lazy" onerror="this.remove()"></div>';
  }
  window.ART = { photo: photo, bottle: bottle, chili: chili, stall: stall, phone: phone, miniChart: miniChart, hero: hero, ACC: ACC, NAVY: NAVY };
})();
