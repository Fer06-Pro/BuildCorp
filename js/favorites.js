import { firebaseConfig } from './firebase-config.js';

// The document IDs and paths must match the client portal in js/portal.js.
const projectNames = {
  'infinity-tower': 'Infinity Tower',
  'smart-office': 'Smart Office Hub',
  'eco-resort': 'Eco Resort Alpino'
};

const buttons = [...document.querySelectorAll('button[data-favorite-id]')];
const isEnglish = () => document.documentElement.lang === 'en';
const localized = (pt, en) => isEnglish() ? en : pt;
const configured = ['apiKey', 'authDomain', 'projectId', 'appId'].every(key =>
  typeof firebaseConfig[key] === 'string' && firebaseConfig[key].trim()
);

let currentUser = null;
let firestore = null;
let database = null;
let available = false;
let loaded = false;
let savedIds = new Set();
const busyIds = new Set();
let unsubscribe = () => {};
let notificationTimer;

const notification = document.createElement('div');
notification.className = 'favorite-feedback';
notification.setAttribute('role', 'status');
notification.setAttribute('aria-live', 'polite');
notification.hidden = true;
document.body.append(notification);

function notify(message, loginLink = false) {
  clearTimeout(notificationTimer);
  notification.replaceChildren(document.createTextNode(message));
  if (loginLink) {
    const link = document.createElement('a');
    link.href = 'portal.html';
    link.textContent = localized('Entrar ou criar conta', 'Sign in or create an account');
    notification.append(document.createTextNode(' '), link);
  }
  notification.hidden = false;
  notificationTimer = setTimeout(() => { notification.hidden = true; }, loginLink ? 9000 : 5000);
}

function render() {
  for (const button of buttons) {
    const id = button.dataset.favoriteId;
    const saved = savedIds.has(id);
    button.classList.toggle('is-saved', saved);
    button.setAttribute('aria-pressed', String(saved));
    button.disabled = busyIds.has(id) || (currentUser !== null && !loaded);

    const heart = button.querySelector('.favorite-heart');
    if (heart) heart.textContent = saved ? '♥' : '♡';
    const label = button.querySelector('[data-en]');
    if (label) {
      label.dataset.pt = saved ? 'Salvo' : 'Salvar projeto';
      label.dataset.en = saved ? 'Saved' : 'Save project';
      label.textContent = isEnglish() ? label.dataset.en : label.dataset.pt;
    }
    const action = saved
      ? localized('Remover projeto salvo', 'Remove saved project')
      : localized('Salvar projeto', 'Save project');
    button.setAttribute('aria-label', `${action}: ${projectNames[id]}`);
    button.title = `${action}: ${projectNames[id]}`;
  }
}

buttons.forEach(button => button.addEventListener('click', async event => {
  event.preventDefault();
  const id = button.dataset.favoriteId;
  if (!Object.hasOwn(projectNames, id)) return;
  if (!configured) {
    notify(localized('Configure o Firebase da BuildCorp para salvar projetos.', 'Configure BuildCorp Firebase to save projects.'));
    return;
  }
  if (!available) {
    notify(localized('Firebase indisponível. Confira sua conexão.', 'Firebase unavailable. Check your connection.'));
    return;
  }
  if (!currentUser) {
    notify(localized('Entre na sua conta para salvar projetos.', 'Sign in to save projects.'), true);
    return;
  }
  if (!loaded || busyIds.has(id)) return;

  const uid = currentUser.uid;
  const removing = savedIds.has(id);
  busyIds.add(id);
  render();
  try {
    const ref = firestore.doc(database, 'users', uid, 'favorites', id);
    if (removing) {
      await firestore.deleteDoc(ref);
    } else {
      await firestore.setDoc(ref, {
        title: projectNames[id],
        savedAt: firestore.serverTimestamp()
      });
    }
    if (currentUser?.uid === uid) {
      notify(removing
        ? localized('Projeto removido dos salvos.', 'Project removed from saved items.')
        : localized('Projeto salvo na sua conta!', 'Project saved to your account!'));
    }
  } catch (error) {
    notify(localized('Erro ao salvar projeto: ', 'Error saving project: ') + (error.code || error.message));
  } finally {
    busyIds.delete(id);
    render();
  }
}));

// The generic language handler runs first; this refreshes favorite-specific labels.
document.getElementById('lang-btn')?.addEventListener('click', render);
render();

if (configured && buttons.length) {
  try {
    const [appLibrary, authLibrary, firestoreLibrary] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js')
    ]);
    const app = appLibrary.getApps().length
      ? appLibrary.getApp()
      : appLibrary.initializeApp(firebaseConfig);
    const auth = authLibrary.getAuth(app);
    database = firestoreLibrary.getFirestore(app);
    firestore = firestoreLibrary;
    available = true;

    authLibrary.onAuthStateChanged(auth, user => {
      unsubscribe();
      currentUser = user;
      savedIds = new Set();
      loaded = !user;
      render();
      if (!user) return;
      const uid = user.uid;
      const favorites = firestore.collection(database, 'users', uid, 'favorites');
      unsubscribe = firestore.onSnapshot(favorites, snapshot => {
        if (currentUser?.uid !== uid) return;
        savedIds = new Set(snapshot.docs.map(doc => doc.id));
        loaded = true;
        render();
      }, error => {
        if (currentUser?.uid !== uid) return;
        loaded = false;
        render();
        notify(localized('Erro ao consultar projetos: ', 'Could not load saved projects: ') + (error.code || error.message));
      });
    }, error => {
      notify(localized('Erro de autenticação: ', 'Authentication error: ') + (error.code || error.message));
    });
  } catch (error) {
    console.warn('BuildCorp: integração de favoritos indisponível.', error);
    notify(localized('Não foi possível conectar ao Firebase.', 'Could not connect to Firebase.'));
  }
}
