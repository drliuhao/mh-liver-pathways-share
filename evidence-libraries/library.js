'use strict';
(async()=>{
 const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const out=document.getElementById('results'),select=document.getElementById('library'),search=document.getElementById('search');
 try{
 const [a,b]=await Promise.all(['catalog.json','document-index.json'].map(u=>fetch(u).then(r=>{if(!r.ok)throw Error(u);return r.json()})));
 const data=LibraryDocumentIndex.merge(a,b);
 document.getElementById('census').textContent=data.libraries.length+' libraries · '+data.unique_publications+' publications';
 for(const lib of data.libraries){const o=document.createElement('option');o.value=lib.key;o.textContent=lib.title;select.append(o)}
 function render(){const key=decodeURIComponent(location.hash.slice(1));select.value=key;const q=search.value.toLowerCase(),lib=data.libraries.find(x=>x.key===key);
 if(!lib){out.innerHTML='<div class="library-grid">'+data.libraries.filter(l=>l.title.toLowerCase().includes(q)).map(l=>'<article class="library-card"><h2><a href="#'+e(l.key)+'">'+e(l.title)+'</a></h2><p>'+l.publication_count+' publications</p></article>').join('')+'</div>';return}
 const publications=lib.papers.map(r=>data.publications[r.id]).filter(Boolean).filter(p=>[p.title,p.pmid,p.doi].join(' ').toLowerCase().includes(q));
 out.innerHTML='<p><a href="#">← All evidence libraries</a></p><h2>'+e(lib.title)+'</h2><ul class="records">'+publications.map(p=>'<li class="record"><h3>'+e(p.title)+'</h3><p>'+e(p.year)+' · PMID '+e(p.pmid||'not indexed')+' · DOI '+e(p.doi||'not recorded')+'</p><div class="access">'+(p.url?'<a href="'+e(p.url)+'" target="_blank" rel="noopener">Publication / full text ↗</a>':'')+(p.tmc?'<a href="'+e(p.tmc)+'" target="_blank" rel="noopener">TMC full-text access ↗</a>':'')+'</div></li>').join('')+'</ul>';
 }
 select.addEventListener('change',()=>{location.hash=select.value});search.addEventListener('input',render);window.addEventListener('hashchange',render);render();
 }catch(err){out.textContent='The evidence index could not load. Please reload.';console.error(err)}
})();