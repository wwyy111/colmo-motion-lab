// One shared tooltip, outside the clipped workbench. It never intercepts dragging.
const materialTip=document.createElement('div');
materialTip.id='material-definition';materialTip.className='material-definition';materialTip.setAttribute('role','tooltip');materialTip.hidden=true;document.body.append(materialTip);
let tipOwner=null;
function hideMaterialTip(){tipOwner?.removeAttribute('aria-describedby');tipOwner=null;materialTip.hidden=true}
function showMaterialTip(el){
 if(document.body.classList.contains('dragging-material'))return;
 const state=byId(el.dataset.lib);if(!state)return;
 hideMaterialTip();tipOwner=el;el.setAttribute('aria-describedby',materialTip.id);
 materialTip.innerHTML=`<strong>${esc(state.name)}</strong><p>${esc(STATE_EXPLANATIONS[state.id]||state.meaning)}</p>`;
 materialTip.hidden=false;
 const r=el.getBoundingClientRect(),t=materialTip.getBoundingClientRect();
 let left=r.right+10;if(left+t.width>innerWidth-12)left=Math.max(12,r.left-t.width-10);
 materialTip.style.left=left+'px';materialTip.style.top=Math.max(12,Math.min(r.top,innerHeight-t.height-12))+'px';
}
document.querySelectorAll('[data-lib]').forEach(el=>{
 el.tabIndex=0;
 el.addEventListener('pointerenter',()=>showMaterialTip(el));
 el.addEventListener('pointerleave',hideMaterialTip);
 el.addEventListener('focusin',()=>showMaterialTip(el));
 el.addEventListener('focusout',hideMaterialTip);
});
document.addEventListener('pointerdown',hideMaterialTip);document.addEventListener('dragstart',hideMaterialTip);
document.addEventListener('keydown',e=>{if(e.key==='Escape')hideMaterialTip()});
window.addEventListener('scroll',hideMaterialTip,true);window.addEventListener('resize',hideMaterialTip);
