'use strict';
(function(root){
 function merge(catalog,supplement){
  const data=JSON.parse(JSON.stringify(catalog));
  Object.assign(data.publications,supplement.publications);
  for(const lib of data.libraries){
   const extra=supplement.libraries[lib.key]||{papers:[],policy_records:[]};
   const ids=new Set(lib.papers.map(r=>r.id));
   for(const row of extra.papers){if(!ids.has(row.id)){lib.papers.push(row);ids.add(row.id)}}
   const titles=new Set(lib.policy_records.map(r=>r.title));
   for(const row of extra.policy_records){if(!titles.has(row.title)){lib.policy_records.push(row);titles.add(row.title)}}
   lib.publication_count=lib.papers.length;
  }
  data.unique_publications=Object.keys(data.publications).length;
  return data;
 }
 if(typeof module==='object'&&module.exports)module.exports={merge};else root.LibraryDocumentIndex={merge};
})(typeof window==='undefined'?globalThis:window);