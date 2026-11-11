(function () {
  'use strict';
  const D = window.LCOEData, $ = id => document.getElementById(id);
  const slider = $('year');
  let timer = null;
  const params = new URLSearchParams(location.search);
  const requestedYear = Number(params.get('year'));
  if (D.years.includes(requestedYear)) slider.value = D.years.indexOf(requestedYear);
  if (params.has('embed')) document.body.classList.add('embedded');
  const fmt = value => Number.isInteger(value) ? String(value) : value.toFixed(1);
  const sourceLink = v => `<a href="${v.source}${v.pdfPage?'#page='+v.pdfPage:''}" target="_blank" rel="noopener">v${v.sourceVersion}.0 · p. ${v.page} ↗</a>`;
  function selected() { return D.data[Number(slider.value)]; }
  function rows(record) {
    let result = D.technologies.filter(t => $('existing').checked || t.group !== 'existing');
    if ($('sort').value === 'cost') result = result.slice().sort((a,b) => {
      if (a.group !== b.group) return a.group === 'existing' ? 1 : -1;
      return (record.values[a.id]?.midpoint ?? Infinity) - (record.values[b.id]?.midpoint ?? Infinity);
    });
    return result;
  }
  function changeText(value,baseline) {
    const change = Math.round(100*(value/baseline-1));
    return change === 0 ? '0%' : `${change<0?'−':'+'}${Math.abs(change)}%`;
  }
  function render() {
    const record = selected(), year = record.year, techs = rows(record);
    $('year-display').value = String(year);
    slider.setAttribute('aria-valuetext',String(year));
    $('chart-year').textContent = year;
    $('version').textContent = `Lazard v${record.version}.0`;
    $('previous').disabled = Number(slider.value) === 0;
    $('next').disabled = Number(slider.value) === D.years.length-1;
    $('comparison-note').hidden = !$('existing').checked || !record.values.existingGas;
    const reported = techs.filter(t => record.values[t.id]);
    const ranges = reported.filter(t => record.values[t.id].kind === 'range').length;
    const points = reported.length-ranges;
    const omitted = techs.filter(t => !record.values[t.id]);
    $('coverage').textContent = `${year} annual report · ${ranges} cost ranges${points ? ` and ${points} reported midpoint${points===1?'':'s'}` : ''}.${omitted.length ? ' Not reported: '+omitted.map(t=>t.name).join(', ')+'.' : ''}`;
    $('selected-source').innerHTML = `<a href="${record.source}" target="_blank" rel="noopener">Lazard v${record.version}.0 · ${year} report ↗</a>`;
    $('selected-notes').textContent = record.note;
    const chartRows = techs.map(t => {
      const v = record.values[t.id];
      const cost = !v ? '—<small>not reported</small>' : v.kind === 'range' ? `${v.low}–${v.high}` : `${fmt(v.midpoint)}<small>midpoint</small>`;
      const mark = !v ? '<span class="no-value">—</span>' : v.kind === 'range'
        ? `<span class="bar" style="left:${100*v.low/D.axisMax}%;width:${100*(v.high-v.low)/D.axisMax}%"></span>`
        : `<span class="point" style="left:${100*v.midpoint/D.axisMax}%"></span>`;
      const explanation = !v ? record.unavailable[t.id] : `${v.kind === 'range' ? `Range $${v.low}–$${v.high}` : `Published midpoint $${fmt(v.midpoint)}`} per MWh; Lazard v${v.sourceVersion}.0 page ${v.page}${v.note?'; '+v.note:''}`;
      return `<div class="chart-row ${t.group === 'existing'?'existing':''} ${!v?'unavailable':''}" style="--bar-color:${t.color}" title="${t.name}: ${explanation}"><span class="tech-name">${t.name}${t.group === 'existing'?'<small>operating cost only</small>':''}</span><div class="track">${mark}</div><span class="cost-value">${cost}</span></div>`;
    });
    $('chart').innerHTML = '<div class="chart-header"><span>Technology</span><span></span><span>$/MWh</span></div>'+chartRows.join('')+'<div class="chart-axis"><span></span><div class="ticks">'+[0,1,2,3,4].map(i=>`<span style="left:${i*25}%">${fmt(i*D.axisMax/4)}</span>`).join('')+'</div><span></span></div>';
    $('axis-scale-note').textContent = `Same 0–${D.axisMax} scale in every year`;
    $('chart').setAttribute('aria-label',`Generation costs in ${year}, US dollars per MWh. `+techs.map(t=>{
      const v=record.values[t.id];return `${t.name}: ${!v?'not reported in this edition':v.kind==='range'?`${v.low} to ${v.high}`:`midpoint ${v.midpoint}`}`;
    }).join('; '));
    const first = D.data[0];
    $('solar-change').textContent = changeText(record.values.solar.midpoint,first.values.solar.midpoint);
    $('wind-change').textContent = changeText(record.values.wind.midpoint,first.values.wind.midpoint);
    $('table-caption').textContent = `${year} cost data ($/MWh); midpoint = center of range, not a forecast`;
    $('data-table').innerHTML = techs.map(t=>{
      const v=record.values[t.id];return `<tr><th scope="row">${t.name}${t.group==='existing'?'<small>Existing plant operating cost</small>':''}${v?.note?`<small>${v.note}</small>`:''}</th><td>${v?.low??'—'}</td><td>${v?.high??'—'}</td><td>${v?fmt(v.midpoint):'—'}</td><td>${v?sourceLink(v):record.unavailable[t.id]}</td></tr>`;
    }).join('');
    // Keep a copied standalone URL on the same year; embeds retain their parent URL.
    if (!params.has('embed')) {
      const url = new URL(location.href);url.searchParams.set('year',year);
      try { history.replaceState(null,'',url); } catch { /* file:// browsers may deny replaceState */ }
    }
    reportHeight();
  }
  function stop() { if(timer) clearInterval(timer);timer=null;$('play').textContent='▶ Play years';$('play').setAttribute('aria-pressed','false'); }
  function step(amount) { stop();slider.value = Math.max(0,Math.min(D.years.length-1,Number(slider.value)+amount));render(); }
  slider.addEventListener('input',()=>{stop();render();});
  $('previous').addEventListener('click',()=>step(-1));
  $('next').addEventListener('click',()=>step(1));
  $('sort').addEventListener('change',render);
  $('existing').addEventListener('change',render);
  $('play').addEventListener('click',()=>{
    if(timer){stop();return;}
    if(Number(slider.value)===D.years.length-1){slider.value=0;render();}
    $('play').textContent='Ⅱ Pause';$('play').setAttribute('aria-pressed','true');
    timer=setInterval(()=>{slider.value=Number(slider.value)+1;render();if(Number(slider.value)===D.years.length-1)stop();},1250);
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  $('download').addEventListener('click',()=>{
    const url=URL.createObjectURL(new Blob([D.csv()],{type:'text/csv;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='lcoe-lazard-2009-2026.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  let lastHeight=0;
  function reportHeight(){
    if(!params.has('embed'))return;
    const height=Math.ceil(document.body.getBoundingClientRect().height);
    if(height!==lastHeight){lastHeight=height;window.parent.postMessage({type:'lcoe-height',height},location.origin);}
  }
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(reportHeight).observe(document.body);
  window.addEventListener('load',reportHeight);
  render();
})();
