import {firebaseConfig} from './firebase-config.js';
const site=document.body.dataset.site;
const map=site==='prime'?{
 'pizza-toscana':'Pizza Toscana','pizza-suprema':'Pizza Suprema','file-mignon':'Filé Mignon',
 'picanha-angus':'Picanha Angus','fettuccine':'Fettuccine Alfredo','spaghetti-carbonara':'Spaghetti Carbonara'
}:{'infinity-tower':'Infinity Tower','smart-office':'Smart Office Hub','eco-resort':'Eco Resort Alpino'};
const $=id=>document.getElementById(id),status=$('firebase-status'),notice=$('auth-message');
const show=(message)=>{notice.textContent=message;};
const configured=['apiKey','authDomain','projectId','appId'].every(k=>typeof firebaseConfig[k]==='string'&&firebaseConfig[k].trim().length>0);
let auth,db, api, activeUser=null, mode='signin', pending=new URLSearchParams(location.search).get('item');
let unsubscribeFavorites=()=>{},unsubscribeNotes=()=>{};
const setMode=(next)=>{mode=next;document.querySelectorAll('[data-auth-mode]').forEach(btn=>{const enabled=btn.dataset.authMode===mode;btn.classList.toggle('active',enabled);btn.setAttribute('aria-pressed',String(enabled));});$('auth-submit').textContent=mode==='signin'?'Entrar / Sign in':'Criar conta / Create account';$('auth-password').autocomplete=mode==='signin'?'current-password':'new-password';show('');};
document.querySelectorAll('[data-auth-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.authMode)));
const textRow=(title,label,onRemove)=>{const item=document.createElement('div');item.className='saved-item';const titleEl=document.createElement('strong');titleEl.textContent=title;const btn=document.createElement('button');btn.type='button';btn.textContent=label;btn.addEventListener('click',onRemove);item.append(titleEl,btn);return item;};
function listenForUser(uid){
 unsubscribeFavorites();unsubscribeNotes();
 const fref=api.collection(db,'users',uid,'favorites');
 unsubscribeFavorites=api.onSnapshot(fref,snapshot=>{const box=$('saved-items');box.replaceChildren();if(snapshot.empty){const p=document.createElement('p');p.textContent='Nenhum favorito salvo. / No favorites yet.';box.append(p);return;}
 snapshot.docs.sort((a,b)=>(a.data().title||'').localeCompare(b.data().title||'')).forEach(snap=>{box.append(textRow(snap.data().title||snap.id,'Remover / Remove',async()=>{try{await api.deleteDoc(snap.ref);show('Favorito removido. / Favorite removed.')}catch(e){show('Erro ao remover: '+e.code)}}))});},e=>show('Erro ao carregar favoritos: '+e.code));
 const nref=api.collection(db,'users',uid,'notes');
 unsubscribeNotes=api.onSnapshot(nref,snapshot=>{const box=$('notes-list');box.replaceChildren();if(snapshot.empty){const p=document.createElement('p');p.textContent='Nenhuma anotação. / No notes yet.';box.append(p);return;}
 const entries=snapshot.docs.sort((a,b)=>(b.data().createdAt?.seconds||0)-(a.data().createdAt?.seconds||0));
 entries.forEach(snap=>{const data=snap.data(),item=textRow(data.text||'','Excluir / Delete',async()=>{try{await api.deleteDoc(snap.ref)}catch(e){show('Erro ao excluir: '+e.code)}});item.querySelector('strong').style.cssText='font-weight:500;white-space:pre-wrap;overflow-wrap:anywhere';box.append(item)})},e=>show('Erro ao carregar notas: '+e.code));
}
async function persistPending(uid){if(!pending)return;const key=pending;pending=null;history.replaceState(null,'',location.pathname);if(!Object.prototype.hasOwnProperty.call(map,key))return;
 try{const ref=api.doc(db,'users',uid,'favorites',key);const existing=await api.getDoc(ref);if(existing.exists()){show('Este item já estava salvo. / Already saved.')}else{await api.setDoc(ref,{title:map[key],savedAt:api.serverTimestamp()});show('Item salvo na sua conta! / Saved to your account!')}}catch(e){show('Não foi possível salvar: '+e.code)}
}
if(!configured){
 status.textContent='CONFIGURAÇÃO PENDENTE — preencha js/firebase-config.js e publique as regras de firebase/firestore.rules. Login e salvamento ficam desativados até lá.';
 $('auth-submit').disabled=true;$('reset-password').disabled=true;
}else{
 status.textContent='Conectando ao Firebase… / Connecting to Firebase…';
 try{
 const [appLib,authLib,dbLib]=await Promise.all([
 import('https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js'),
 import('https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js'),
 import('https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js')]);
 const app=appLib.initializeApp(firebaseConfig);auth=authLib.getAuth(app);db=dbLib.getFirestore(app);
 api={...authLib,...dbLib};status.textContent='Firebase conectado. Entre ou crie sua conta. / Firebase connected.';
 api.onAuthStateChanged(auth,async user=>{
  activeUser=user;unsubscribeFavorites();unsubscribeNotes();
  $('guest-section').hidden=!!user;$('user-section').hidden=!user;$('dashboard').hidden=!user;$('dashboard-empty').hidden=!!user;
  if(user){$('user-email').textContent=user.email||user.uid;listenForUser(user.uid);await persistPending(user.uid)}else{$('saved-items').replaceChildren();$('notes-list').replaceChildren();}
 },e=>show('Erro de autenticação: '+e.code));
 $('auth-form').addEventListener('submit',async e=>{e.preventDefault();if(!$('auth-form').reportValidity())return;const email=$('auth-email').value.trim(),password=$('auth-password').value;const btn=$('auth-submit');btn.disabled=true;show('Conectando…');try{
 if(mode==='signup')await api.createUserWithEmailAndPassword(auth,email,password);else await api.signInWithEmailAndPassword(auth,email,password);show('Conta conectada. / Account connected.');$('auth-password').value='';
 }catch(err){const names={'auth/email-already-in-use':'E-mail já cadastrado.','auth/invalid-email':'E-mail inválido.','auth/weak-password':'Escolha uma senha mais forte.','auth/invalid-credential':'Credenciais inválidas.','auth/operation-not-allowed':'Ative o método E-mail/Senha no Firebase Authentication.','auth/unauthorized-domain':'Autorize este domínio no Firebase Authentication.'};show(names[err.code]||('Falha ao entrar: '+err.code));}finally{btn.disabled=false}});
 $('reset-password').addEventListener('click',async()=>{const email=$('auth-email').value.trim();if(!email){show('Informe seu e-mail no campo acima.');return;}try{await api.sendPasswordResetEmail(auth,email);show('Se houver uma conta, você receberá instruções de recuperação no e-mail informado.')}catch(e){show('Erro: '+e.code)}});
 $('logout-btn').addEventListener('click',async()=>{try{await api.signOut(auth);show('Sessão encerrada.')}catch(e){show('Erro: '+e.code)}});
 $('notes-form').addEventListener('submit',async e=>{e.preventDefault();if(!activeUser||!$('notes-form').reportValidity())return;const text=$('note-text').value.trim();if(text.length<2||text.length>500){show('Nota precisa ter entre 2 e 500 caracteres.');return;}try{await api.addDoc(api.collection(db,'users',activeUser.uid,'notes'),{text,createdAt:api.serverTimestamp()});$('note-text').value='';show('Nota salva. / Note saved.')}catch(e){show('Erro ao salvar nota: '+e.code)}});
 }catch(e){status.textContent='Firebase indisponível. Confira conexão, versão do SDK e credenciais.';show('Erro: '+(e.code||e.message));$('auth-submit').disabled=true;}
}
