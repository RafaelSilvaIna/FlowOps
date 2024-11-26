import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';

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


