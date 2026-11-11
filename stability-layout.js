'use strict';
(function(){
 const main=document.querySelector('main');
 const controls=document.querySelector('section[aria-labelledby="experiment-title"]');
 const result=document.querySelector('section.result');
 const time=document.querySelector('section[aria-labelledby="response-title"]');
 const power=document.querySelector('section[aria-labelledby="energy-title"]');
 if(!main||!controls||!result||!time||!power)return;
 const workspace=document.createElement('section');workspace.className='experiment-workspace';workspace.setAttribute('aria-label','Controls and live plot');
 const sidebar=document.createElement('aside');sidebar.className='control-pane';sidebar.setAttribute('aria-label','Experiment parameters');
 const plots=document.createElement('div');plots.className='plot-pane';
 main.insertBefore(workspace,controls);workspace.append(sidebar,plots);sidebar.append(controls);plots.append(result);
 const tabs=document.createElement('div');tabs.className='plot-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','Plot view');plots.append(tabs);
 const views=[{id:'rotor-view',label:'Rotor angle',panel:time},{id:'energy-view',label:'Power-angle areas',panel:power}];
 const buttons=views.map((view,index)=>{const b=document.createElement('button');b.type='button';b.id=view.id+'-tab';b.textContent=view.label;b.setAttribute('role','tab');b.setAttribute('aria-controls',view.id);b.setAttribute('aria-selected',String(index===0));b.tabIndex=index===0?0:-1;tabs.append(b);view.panel.id=view.id;view.panel.setAttribute('role','tabpanel');view.panel.setAttribute('aria-labelledby',b.id);view.panel.hidden=index!==0;plots.append(view.panel);return b;});
 function select(index){views.forEach((view,i)=>{view.panel.hidden=i!==index;buttons[i].setAttribute('aria-selected',String(i===index));buttons[i].tabIndex=i===index?0:-1;});window.dispatchEvent(new Event('stability-layout-change'));}
 buttons.forEach((button,index)=>{button.addEventListener('click',()=>select(index));button.addEventListener('keydown',event=>{let next=index;if(event.key==='ArrowRight')next=(index+1)%views.length;else if(event.key==='ArrowLeft')next=(index+views.length-1)%views.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=views.length-1;else return;event.preventDefault();select(next);buttons[next].focus();});});
 const learning=document.querySelector('section.learning');
 if(learning){const details=document.createElement('details');details.className='learning-details';const summary=document.createElement('summary');summary.textContent='Learning prompts';details.append(summary);learning.before(details);details.append(learning);}
 document.body.classList.add('side-by-side');
 window.dispatchEvent(new Event('stability-layout-change'));
})();
