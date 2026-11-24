(() => {
  'use strict';

  const reports = window.LCOSReports;
  const byId = id => document.getElementById(id);
  const slider = byId('year');
  const params = new URLSearchParams(location.search);
  const requestedIndex = reports.findIndex(report => report.year === Number(params.get('year')));
  slider.max = reports.length - 1;
  slider.value = requestedIndex === -1 ? slider.max : requestedIndex;
  let playback = null;

  const midpoint = ({ low, high }) => (low + high) / 2;
  const baseline = reports.find(report => report.year === 2020)?.cases.find(item => item.benchmark);
  const fmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });
  const escape = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
  const slots = [
    { id: 'utility1', name: 'Utility standalone · 1 h', type: 'utility' },
    { id: 'utility2', name: 'Utility standalone · 2 h', type: 'utility' },
    { id: 'utility4', name: 'Utility standalone · 4 h', type: 'utility' },
    { id: 'commercial', name: 'Commercial standalone', type: 'commercial' },
    { id: 'residential', name: 'Residential standalone', type: 'residential' },
    { id: 'utilitySolar', name: 'Utility solar + storage', type: 'solar' },
    { id: 'commercialSolar', name: 'Commercial solar + storage', type: 'solar' },
    { id: 'residentialSolar', name: 'Residential solar + storage', type: 'solar' },
    { id: 'utilityWind', name: 'Utility wind + storage', type: 'wind' }
  ];
  const lowCycleSlot = { id: 'lowCycle', name: 'Transmission & distribution', type: 'grid' };
  const chart = byId('chart');
  let chartRows = [];

  // Use one scale for all report years in each comparison mode.
  function scaleFor(includeLowCycle) {
    const highest = Math.max(...reports.flatMap(report =>
      report.cases.filter(item => includeLowCycle || !item.lowCycle).map(item => item.high)));
    const interval = highest > 1600 ? 250 : 100;
    return Math.ceil(highest / (4 * interval)) * 4 * interval;
  }
  const standardScale = scaleFor(false);
  const expandedScale = scaleFor(true);

  const sourceLink = (report, citation = report) => {
    const href = escape(report.url + '#page=' + citation.pdfPage);
    return `<a href="${href}" target="_blank" rel="noopener">LCOS v${report.version}.0 · p. ${citation.page}</a>`;
  };

  function prepareChart() {
    const includeLowCycle = byId('low-cycle').checked;
    const scale = includeLowCycle ? expandedScale : standardScale;
    const visibleSlots = includeLowCycle ? [...slots, lowCycleSlot] : slots;
    const markup = visibleSlots.map(slot => `<div class="chart-row" data-slot="${slot.id}" data-type="${slot.type}">
      <span class="tech-name"><span class="case-color" aria-hidden="true"></span><span>${escape(slot.name)}<small></small></span></span>
      <div class="track"><span class="bar" hidden></span></div>
      <span class="cost-value"></span>
    </div>`);
    const ticks = Array.from({ length: 5 }, (_, i) =>
      `<span style="left:${25 * i}%">${fmt.format(i * scale / 4)}</span>`);
    chart.innerHTML = '<div class="chart-header"><span>Storage case</span><span></span><span>$/MWh</span></div>'
      + markup.join('') + '<div class="chart-axis"><span></span><div class="ticks">'
      + ticks.join('') + '</div><span></span></div>';
    chartRows = visibleSlots.map(slot => {
      const element = chart.querySelector(`[data-slot="${slot.id}"]`);
      return { slot, detail: element.querySelector('small'), bar: element.querySelector('.bar'),
        value: element.querySelector('.cost-value') };
    });
    byId('comparison-note').hidden = !includeLowCycle;
    byId('axis-scale-note').textContent = `Same 0–${fmt.format(scale)} scale in every year`;
  }

  function render() {
    const index = Number(slider.value);
    const report = reports[index];
    const { year } = report;
    const includeLowCycle = byId('low-cycle').checked;
    const scale = includeLowCycle ? expandedScale : standardScale;
    const casesBySlot = new Map(report.cases.map(item => [item.chartSlot, item]));

    byId('year-display').value = year;
    byId('chart-year').textContent = year;
    byId('version').textContent = `Lazard LCOS v${report.version}.0`;
    slider.setAttribute('aria-valuetext', String(year));
    byId('previous').disabled = index === 0;
    byId('next').disabled = index === reports.length - 1;
    const reportedCount = chartRows.filter(row => casesBySlot.has(row.slot.id)).length;
    byId('coverage').textContent = `${reportedCount} of ${chartRows.length} chart cases reported`;

    const descriptions = chartRows.map(({ slot, detail, bar, value }) => {
      const item = casesBySlot.get(slot.id);
      detail.textContent = item?.chartDetail ?? '';
      bar.hidden = !item;
      value.textContent = item ? `${fmt.format(item.low)}–${fmt.format(item.high)}` : '—';
      value.title = item ? '' : 'Not reported';
      if (item) {
        bar.style.left = `${100 * item.low / scale}%`;
        bar.style.width = `${100 * (item.high - item.low) / scale}%`;
        return `${slot.name}, ${item.chartDetail}: ${item.low} to ${item.high}`;
      }
      return `${slot.name}: not reported`;
    });
    chart.setAttribute('aria-label', `Storage costs in ${year}, US dollars per MWh. ${descriptions.join('. ')}`);

    const benchmark = report.cases.find(item => item.benchmark);
    if (benchmark && baseline) {
      const value = midpoint(benchmark);
      const change = Math.round((value / midpoint(baseline) - 1) * 100);
      byId('utility-midpoint').textContent = fmt.format(value);
      byId('utility-change').textContent = (change > 0 ? '+' : change < 0 ? '−' : '') + Math.abs(change) + '%';
    } else {
      byId('utility-midpoint').textContent = '—';
      byId('utility-change').textContent = '—';
    }

    byId('selected-source').innerHTML = sourceLink(report);
    byId('selected-notes').textContent = `${report.summary} ${report.note}`;
    byId('table-caption').textContent = `${year} storage cost data ($/MWh)`;
    byId('data-table').innerHTML = report.cases.map(item => `<tr>
      <th scope="row">${escape(item.name)}<small>${escape(item.assumptions || item.detail)}</small></th>
      <td>${fmt.format(item.low)}</td><td>${fmt.format(item.high)}</td>
      <td>${fmt.format(midpoint(item))}</td><td>${sourceLink(report, item)}</td>
    </tr>`).join('');

    const link = new URL(location.href);
    link.searchParams.set('year', year);
    try { history.replaceState(null, '', link); } catch { /* Local file previews can restrict URL changes. */ }
  }

  function stop() {
    clearInterval(playback);
    playback = null;
    byId('play').textContent = '▶ Play years';
    byId('play').setAttribute('aria-pressed', 'false');
  }

  function step(amount) {
    stop();
    slider.value = Math.max(0, Math.min(reports.length - 1, Number(slider.value) + amount));
    render();
  }

  slider.addEventListener('input', () => { stop(); render(); });
  byId('low-cycle').addEventListener('change', () => { prepareChart(); render(); });
  byId('previous').addEventListener('click', () => step(-1));
  byId('next').addEventListener('click', () => step(1));
  byId('play').addEventListener('click', () => {
    if (playback !== null) { stop(); return; }
    if (Number(slider.value) === reports.length - 1) { slider.value = 0; render(); }
    byId('play').textContent = 'Ⅱ Pause';
    byId('play').setAttribute('aria-pressed', 'true');
    playback = setInterval(() => {
      slider.value = Number(slider.value) + 1;
      render();
      if (Number(slider.value) === reports.length - 1) stop();
    }, 1250);
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });

  byId('download').addEventListener('click', () => {
    const header = ['year', 'lcos_version', 'storage_case', 'configuration', 'low_usd_per_mwh',
      'high_usd_per_mwh', 'midpoint_usd_per_mwh', 'printed_page', 'pdf_page', 'source', 'case_scope', 'report_note'];
    const rows = reports.flatMap(report => report.cases.map(item => [
      report.year, report.version + '.0', item.name, item.assumptions || item.detail, item.low, item.high,
      midpoint(item), item.page, item.pdfPage, report.url + '#page=' + item.pdfPage, report.summary, report.note
    ]));
    const csv = [header, ...rows].map(row =>
      row.map(value => '"' + String(value).replace(/"/g, '""') + '"').join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'lcos-lazard-2015-2026.csv';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  prepareChart();
  render();
})();

