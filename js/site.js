(()=>{'use strict';
 const site=document.body.dataset.site||'prime',storageKey='site-language-'+site;
 const langButton=document.getElementById('lang-btn'),nav=document.getElementById('main-nav'),toggle=document.getElementById('nav-toggle');
 let language=localStorage.getItem(storageKey)==='en'?'en':'pt';
 document.querySelectorAll('[data-en]').forEach(el=>{el.dataset.pt=el.textContent;});
 const translate=()=>{
   document.documentElement.lang=language==='en'?'en':'pt-BR';
   document.querySelectorAll('[data-en]').forEach(el=>{el.textContent=language==='en'?el.dataset.en:el.dataset.pt;});
   document.querySelectorAll('[data-placeholder-en]').forEach(el=>{if(!el.dataset.placeholderPt)el.dataset.placeholderPt=el.placeholder;el.placeholder=language==='en'?el.dataset.placeholderEn:el.dataset.placeholderPt;});
   if(langButton)langButton.textContent=language==='en'?'PT':'EN';
   if(site==='build')updateProfile();
 };
 langButton?.addEventListener('click',()=>{language=language==='pt'?'en':'pt';localStorage.setItem(storageKey,language);translate();});
 function setNav(open){nav?.classList.toggle('open',open);toggle?.setAttribute('aria-expanded',String(open));if(toggle){toggle.textContent=open?'×':'☰';toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');}}
 toggle?.addEventListener('click',()=>setNav(!nav.classList.contains('open')));
 nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setNav(false)));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')setNav(false)});
 document.addEventListener('click',e=>{if(nav?.classList.contains('open')&&!e.target.closest('.site-header'))setNav(false)});
 window.addEventListener('resize',()=>{if(innerWidth>820)setNav(false)},{passive:true});
 const filterButtons=[...document.querySelectorAll('[data-category].filter-btn')],cards=[...document.querySelectorAll('.dish-card')],search=document.getElementById('search-food');
 if(filterButtons.length){let category='all';const apply=()=>{let total=0;const term=(search?.value||'').trim().toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');cards.forEach(card=>{const text=card.textContent.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');const show=(category==='all'||card.dataset.category===category)&&text.includes(term);card.hidden=!show;if(show)total++;});filterButtons.forEach(b=>{b.classList.toggle('active',b.dataset.category===category);b.setAttribute('aria-pressed',String(b.dataset.category===category));});const status=document.getElementById('menu-status');if(status)status.textContent=language==='en'?`${total} dishes found`:`${total} ${total===1?'prato encontrado':'pratos encontrados'}`;const empty=document.getElementById('menu-empty');if(empty)empty.hidden=total>0;};filterButtons.forEach(b=>b.addEventListener('click',()=>{category=b.dataset.category;apply()}));search?.addEventListener('input',apply);langButton?.addEventListener('click',apply);apply();}
 const contact=document.getElementById('contact-form');contact?.addEventListener('submit',e=>{e.preventDefault();if(!contact.reportValidity())return;const result=document.getElementById('contact-status');if(result)result.textContent=language==='en'?'Preview only — no message was sent.':'Demonstração: nenhuma mensagem foi enviada.';});
 if(site==='build'){
  const toolButtons=[...document.querySelectorAll('[data-tool]')];toolButtons.forEach(b=>b.addEventListener('click',()=>{toolButtons.forEach(x=>{const active=x===b;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active))});document.querySelectorAll('[data-panel]').forEach(p=>p.hidden=p.dataset.panel!==b.dataset.tool)}));
  const money=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(n);
  const val=document.getElementById('property-value'),down=document.getElementById('down-payment'),years=document.getElementById('years');
  const simulate=()=>{const v=Number(val.value),d=Number(down.value)/100,n=Number(years.value)*12,fin=v*(1-d),rate=.005;const payment=fin*rate/(1-(1+rate)**(-n));document.getElementById('value-show').textContent=money(v);document.getElementById('down-show').textContent=(d*100)+'%';document.getElementById('years-show').textContent=years.value+(language==='en'?' years':' anos');document.getElementById('payment-show').textContent=money(payment);document.getElementById('financed-show').textContent=money(fin);document.getElementById('entry-show').textContent=money(v*d);};
  [val,down,years].forEach(el=>el?.addEventListener('input',simulate));if(val)simulate();langButton?.addEventListener('click',simulate);
  document.querySelectorAll('.faq-question').forEach(btn=>btn.addEventListener('click',()=>{const el=document.getElementById(btn.getAttribute('aria-controls'));const open=btn.getAttribute('aria-expanded')!=='true';btn.setAttribute('aria-expanded',String(open));el.hidden=!open;btn.querySelector('span:last-child').textContent=open?'−':'+'}));
  document.getElementById('profile-select')?.addEventListener('change',updateProfile);
 }
 function updateProfile(){const select=document.getElementById('profile-select'),el=document.getElementById('profile-result');if(!select||!el)return;const data=[['Infinity Tower — cenário residencial de demonstração.','Infinity Tower — sample residential concept.'],['Smart Office Hub — cenário corporativo de demonstração.','Smart Office Hub — sample corporate concept.'],['Eco Resort Alpino — cenário de hospedagem de demonstração.','Eco Alpine Resort — sample hospitality concept.']];el.textContent=data[select.selectedIndex]?.[language==='en'?1:0]||'';}
 translate();
 // Update the header on each page as the Firebase session changes.
 // The actual permissions still come from Authentication and Firestore Rules.
 if(site==='build'){
  const label=document.querySelector('.header-login [data-en]');
  if(label){
   const renderAccount=user=>{
    label.dataset.pt=user?'Minha conta':'Entrar';
    label.dataset.en=user?'My account':'Sign in';
    label.textContent=language==='en'?label.dataset.en:label.dataset.pt;
   };
   import('./firebase-config.js').then(async({firebaseConfig})=>{
    if(!['apiKey','authDomain','projectId','appId'].every(k=>typeof firebaseConfig[k]==='string'&&firebaseConfig[k].trim()))return;
    const [appLibrary,authLibrary]=await Promise.all([
     import('https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js'),
     import('https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js')
    ]);
    const app=appLibrary.getApps().length?appLibrary.getApp():appLibrary.initializeApp(firebaseConfig);
    authLibrary.onAuthStateChanged(authLibrary.getAuth(app),renderAccount,()=>renderAccount(null));
   }).catch(error=>console.warn('BuildCorp: estado de login indisponível.',error));
  }
 }
})();
