'use strict';
const menu = document.querySelector('.menu-toggle');
const nav = document.getElementById('site-nav');
if (menu && nav) menu.addEventListener('click', () => { const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open); });
const frame = document.getElementById('stability-frame');
if (frame) window.addEventListener('message', event => {
  if (event.source !== frame.contentWindow || event.origin !== window.location.origin || event.data?.type !== 'stability-height') return;
  if (Number.isFinite(event.data.height)) frame.style.height=Math.min(5000,Math.max(560,event.data.height+12))+'px';
});

const lcoeFrame = document.getElementById('lcoe-frame');
if (lcoeFrame) window.addEventListener('message', event => {
  if (event.source !== lcoeFrame.contentWindow || event.origin !== window.location.origin || event.data?.type !== 'lcoe-height') return;
  if (Number.isFinite(event.data.height)) lcoeFrame.style.height=Math.min(7000,Math.max(600,event.data.height+12))+'px';
});

// Native dialog keeps photo viewing keyboard accessible and preserves link fallback.
const photoLinks = document.querySelectorAll('.photo-link');
if (photoLinks.length && typeof HTMLDialogElement !== 'undefined') {
  const dialog=document.createElement('dialog');dialog.className='photo-dialog';dialog.setAttribute('aria-label','Photo viewer');
  const close=document.createElement('button');close.type='button';close.textContent='Close photo ×';
  const image=document.createElement('img'),caption=document.createElement('p');
  dialog.append(close,image,caption);document.body.append(dialog);
  close.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  photoLinks.forEach(link=>link.addEventListener('click',event=>{
    event.preventDefault();const preview=link.querySelector('img');
    image.src=link.href;image.alt=preview?.alt||'Group photograph';
    caption.textContent=link.closest('figure')?.querySelector('figcaption')?.textContent||image.alt;
    dialog.showModal();
  }));
}
