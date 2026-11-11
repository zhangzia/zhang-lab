'use strict';
if (new URLSearchParams(window.location.search).has('embed')) {
  document.body.classList.add('embedded');
  let lastHeight = 0;
  const send = () => { const height=Math.ceil(document.body.getBoundingClientRect().height);if(height!==lastHeight){lastHeight=height;window.parent.postMessage({type:'stability-height',height},window.location.origin);} };
  new ResizeObserver(send).observe(document.body);
  window.addEventListener('load',send);
  send();
}
