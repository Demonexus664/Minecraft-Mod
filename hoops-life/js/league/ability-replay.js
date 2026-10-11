// Real DNA activation telemetry, collected from the basketball simulation.
// This is not a claim that every occurrence created a made shot or a win.
window.HL=window.HL||{};
HL.AbilityReplay=(function(){
 const esc=s=>HL.UI?.esc?HL.UI.esc(s):String(s??'').replace(/[&<>"']/g,ch=>(
  {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 const CAPTIONS={
  gravitySpace:'Spacing opened the rim',
  contactBalance:'Held balance through contact',
  deepSeal:'Created a deep paint catch',
  postDouble:'Forced help toward the post',
  transitionMismatch:'Caught a bad transition matchup',
  lob:'Threatened the rim on an assisted play',
  rimIntimidation:'Weak-side shot intimidation',
  quickRelease:'Shot before defensive recovery',
  screenWindow:'Created a screen separation window',
  relocation:'Relocated after the action',
  shotCreation:'Created separation in isolation',
  shotAnticipation:'Read a late defender',
  highRelease:'Shot over a shorter matchup',
  defensiveRecovery:'Recovered after a rotation',
  precisionPass:'Improved an assisted shooting window',
  clutchCounter:'Used a late-game shot counter',
  passingLanePressure:'Pressure on passing lanes'
 };
 function accumulate(dst,events,side){
  const from=events?.dna?.[side]||{};
  for(const [k,v]of Object.entries(from))if(Number.isFinite(+v)&&+v>0)
    dst[k]=(dst[k]||0)+(+v);
  return dst;
 }
 function rows(counts){
  return Object.entries(counts||{}).filter(([k,v])=>Number.isFinite(+v)&&v>0)
   .map(([key,count])=>({key,count,caption:CAPTIONS[key]||HL.DNA?.MECHANIC_TEXT?.[key]||
     key.replace(/([A-Z])/g,' $1')}))
   .sort((a,b)=>b.count-a.count).slice(0,14);
 }
 function render(counts,title='DNA ACTION REPLAY'){
  const items=rows(counts),max=items[0]?.count||1;
  return '<section class="block ability-replay"><header><h3>'+esc(title)+'</h3>'+
   '<span class="ml-auto t3 sm">Recorded possession mechanics</span></header>'+
   '<div class="body stack"><p class="t2 sm">These counters come from the actual possession engine. An ability activation is an opportunity or tactical effect, not automatically a successful basket.</p>'+
   (items.length?'<div class="ability-replay-grid">'+items.map((r,i)=>
    '<article class="ability-replay-row" style="--replay-rank:'+i+'"><div class="ability-replay-icon">'+
    String(i+1).padStart(2,'0')+'</div><div class="ability-replay-copy">'+
    '<b>'+esc(r.caption)+'</b><div class="ability-replay-track"><i style="width:'+
    Math.max(2,Math.round(r.count/max*100))+'%"></i></div></div>'+
    '<strong>'+r.count.toLocaleString()+'<small> TRIGGERS</small></strong></article>').join('')+
    '</div>':'<p class="t3">No special basketball DNA actions were recorded this season. Try combining compatible high-level abilities or using a fusion with on-court mechanics.</p>')+
   '</div></section>';
 }
 return {CAPTIONS,accumulate,rows,render};
})();