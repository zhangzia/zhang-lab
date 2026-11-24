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

  function render() {
    const index = Number(slider.value);
    const report = reports[index];
    const { year } = report;
    const includeLowCycle = byId('low-cycle').checked;
    const scale = includeLowCycle ? expandedScale : standardScale;
    const visibleCases = report.cases.filter(item => includeLowCycle || !item.lowCycle);
    const cases = byId('sort').value === 'cost'
      ? visibleCases.sort((a, b) => midpoint(a) - midpoint(b))
      : visibleCases;

    byId('year-display').value = year;
    byId('chart-year').textContent = year;
    byId('version').textContent = `Lazard LCOS v${report.version}.0`;
    slider.setAttribute('aria-valuetext', String(year));
    byId('previous').disabled = index === 0;
    byId('next').disabled = index === reports.length - 1;
    byId('coverage').textContent = `${cases.length} published ranges · ${report.summary}`;
    byId('comparison-note').hidden = !cases.some(item => item.lowCycle);

    const chartRows = cases.map(item => {
      const color = item.benchmark ? '#005a43' : '#397ea7';
      const left = 100 * item.low / scale;
      const width = 100 * (item.high - item.low) / scale;
      return `<div class="chart-row" style="--bar-color:${color}">
        <span class="tech-name">${escape(item.name)}<small>${escape(item.detail)}${item.lowCycle ? ' · 25 cycles/year' : ''}</small></span>
        <div class="track"><span class="bar" style="left:${left}%;width:${width}%"></span></div>
        <span class="cost-value">${fmt.format(item.low)}–${fmt.format(item.high)}</span>
      </div>`;
    });
    const ticks = Array.from({ length: 5 }, (_, i) =>
      `<span style="left:${25 * i}%">${fmt.format(i * scale / 4)}</span>`);
    const chart = byId('chart');
    chart.innerHTML = '<div class="chart-header"><span>Storage case</span><span></span><span>$/MWh</span></div>'
      + chartRows.join('') + '<div class="chart-axis"><span></span><div class="ticks">'
      + ticks.join('') + '</div><span></span></div>';
    chart.setAttribute('aria-label', `Storage costs in ${year}, US dollars per MWh. `
      + cases.map(item => `${item.name}, ${item.detail}: ${item.low} to ${item.high}`).join('. '));
    byId('axis-scale-note').textContent = `Same 0–${fmt.format(scale)} scale in every year`;

    const benchmark = cases.find(item => item.benchmark);
    byId('benchmark').hidden = !benchmark || !baseline;
    if (benchmark && baseline) {
      const value = midpoint(benchmark);
      const change = Math.round((value / midpoint(baseline) - 1) * 100);
      byId('utility-midpoint').textContent = fmt.format(value);
      byId('utility-change').textContent = (change > 0 ? '+' : change < 0 ? '−' : '') + Math.abs(change) + '%';
    }

    byId('selected-source').innerHTML = sourceLink(report);
    byId('selected-notes').textContent = report.note;
    byId('table-caption').textContent = `${year} storage cost data ($/MWh)`;
    byId('data-table').innerHTML = cases.map(item => `<tr>
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
  byId('sort').addEventListener('change', render);
  byId('low-cycle').addEventListener('change', render);
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

  render();
})();

