import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';
import { getDatabase, ref, set, get } from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyDaffUTJnaBW7ppaHo_UQOBMHrlvMXTdGw",
    authDomain: "flowops-7e9f0.firebaseapp.com",
    databaseURL: "https://flowops-7e9f0-default-rtdb.firebaseio.com",
    projectId: "flowops-7e9f0",
    storageBucket: "flowops-7e9f0.firebasestorage.app",
    messagingSenderId: "541008189245",
    appId: "1:541008189245:web:58eeb67a2507ab0bb1d754",
    measurementId: "G-KHZ92X24C4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = firebase.database();

const authStatusText = document.getElementById("auth-status-text");
const authIcon = document.getElementById("auth-icon");
const settingsModal = document.getElementById("settings-modal");
const notification = document.getElementById("notification");
const authStatus = document.getElementById("auth-status");


onAuthStateChanged(auth, user => {
    if (user) {
        authStatusText.innerText = "Autenticado";
        authIcon.classList.remove("fa-spin");
        authIcon.classList.add("fa-cog");
        authStatus.addEventListener("click", openSettingsModal);
        showNotification("Conta autenticada com sucesso!");

       
        document.getElementById("logout").onclick = () => {
            signOut(auth).then(() => {
                location.reload();
            }).catch((error) => {
                console.error("Erro ao sair:", error);
            });
        };
    } else {
        authStatusText.innerText = "Verificando autenticação...";
        authIcon.classList.add("fa-spin");
    }
});


function showNotification(message) {
    notification.innerText = message;
    notification.classList.remove("hidden");
    setTimeout(() => {
        notification.classList.add("hidden");
    }, 5000);
}


function openSettingsModal() {
    settingsModal.classList.remove("hidden");
}

settingsModal.addEventListener("click", (event) => {
    if (event.target === settingsModal) {
        settingsModal.classList.add("hidden");
    }
});

document.getElementById("change-password").onclick = () => {
    alert("Funcionalidade para alterar a senha será implementada.");
};

document.getElementById("delete-account").onclick = () => {
    alert("Funcionalidade para excluir a conta será implementada.");
};

// secao numero 1
// Função para salvar informações no Realtime Database
async function saveUserInfoToDatabase(uid, browser, ip) {
    const userRef = database.ref('users/' + uid); // Referência ao caminho do usuário no banco
    const userData = {
        browser: browser,
        ip: ip,
        lastLogin: new Date().toISOString()
    };

    try {
        await userRef.set(userData); // Salva os dados no banco
        console.log("Informações salvas com sucesso!");
    } catch (error) {
        console.error("Erro ao salvar informações no Firebase:", error);
    }
}

// Função para obter informações do usuário do Realtime Database
async function loadUserInfoFromDatabase(uid) {
    const userRef = database.ref('users/' + uid); // Referência ao caminho do usuário no banco
    try {
        const snapshot = await userRef.once('value');
        const data = snapshot.val();

        if (data) {
            // Exibe as informações do usuário
            document.getElementById("user-uid").textContent = uid;
            document.getElementById("user-browser").textContent = data.browser;
            document.getElementById("user-ip").textContent = data.ip;
        } else {
            document.getElementById("user-info").innerHTML = "Informações não encontradas.";
        }
    } catch (error) {
        console.error("Erro ao carregar informações do Firebase:", error);
    }
}

// Função para carregar informações e salvar no banco
async function loadAndSaveUserInfo() {
    const user = auth.currentUser;

    if (user) {
        const uid = user.uid; // UID do usuário autenticado
        const browser = getBrowser(); // Pega o navegador
        const ip = await getIP(); // Pega o IP usando a API externa

        // Salva no Realtime Database
        await saveUserInfoToDatabase(uid, browser, ip);

        // Carrega as informações do banco
        await loadUserInfoFromDatabase(uid);
    } else {
        document.getElementById("user-info").innerHTML = "Usuário não autenticado.";
    }
}

// Chama a função quando o usuário estiver autenticado
auth.onAuthStateChanged(user => {
    if (user) {
        loadAndSaveUserInfo(); // Chama a função de carregar e salvar informações
    } else {
        console.log("Usuário não autenticado.");
    }
});



