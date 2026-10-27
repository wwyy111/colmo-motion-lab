// Pointer-based dragging keeps the source fixed while the flow scrolls.
let pointerDrag=null;
document.addEventListener('dragstart',e=>{if(e.target.closest('[data-lib],[data-uid]'))e.preventDefault()});
document.addEventListener('pointerdown',e=>{
 if(e.button!==0||e.target.closest('button,input,textarea,select,summary'))return;
 const el=e.target.closest('[data-lib],[data-uid]');if(!el)return;
 pointerDrag={x:e.clientX,y:e.clientY,el,data:el.dataset.lib?{type:'new',id:el.dataset.lib}:{type:'move',uid:el.dataset.uid},ghost:null,zone:null};
});
document.addEventListener('pointermove',e=>{
 const d=pointerDrag;if(!d)return;
 if(!d.ghost&&Math.hypot(e.clientX-d.x,e.clientY-d.y)<6)return;
 e.preventDefault();
 if(!d.ghost){d.ghost=document.createElement('div');d.ghost.className='drag-ghost';d.ghost.textContent=d.el.dataset.lib?byId(d.el.dataset.lib).name:d.el.querySelector('[data-preview]').textContent;document.body.append(d.ghost);document.body.classList.add('dragging-material')}
 d.ghost.style.transform=`translate(${e.clientX+12}px,${e.clientY+12}px)`;
 const hit=document.elementFromPoint(e.clientX,e.clientY);const zone=hit?.closest('[data-at]')||hit?.closest('.node-track')?.querySelector('[data-at]:last-child');
 if(d.zone!==zone){d.zone?.classList.remove('over');zone?.classList.add('over');d.zone=zone}
},{passive:false});
function finishPointer(e,cancel=false){const d=pointerDrag;if(!d)return;pointerDrag=null;d.ghost?.remove();d.zone?.classList.remove('over');document.body.classList.remove('dragging-material');if(!cancel&&d.ghost&&d.zone){const transfer=new DataTransfer();transfer.setData('text/plain',JSON.stringify(d.data));d.zone.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:transfer}))}}
document.addEventListener('pointerup',e=>finishPointer(e));document.addEventListener('pointercancel',e=>finishPointer(e,true));document.addEventListener('keydown',e=>{if(e.key==='Escape')finishPointer(e,true)});
