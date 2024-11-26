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

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Configuração do Three.js para o fundo 3D
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('space-background').appendChild(renderer.domElement);

// Criar estrelas
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({color: 0xFFFFFF});
const starsVertices = [];
for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = -Math.random() * 2000;
    starsVertices.push(x, y, z);
}
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    stars.rotation.y += 0.0002;
    renderer.render(scene, camera);
}
animate();

// Funções auxiliares
function generateCIU() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let ciu = '';
    for (let i = 0; i < 4; i++) {
        ciu += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (let i = 0; i < 3; i++) {
        ciu += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return ciu;
}

async function getUserIp() {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Mostrar modal de termos se ainda não foi aceito
    if (!localStorage.getItem('termsAccepted')) {
        new bootstrap.Modal(document.getElementById('termsModal')).show();
    }

    // Aceitar termos
    document.getElementById('acceptTerms').addEventListener('click', () => {
        localStorage.setItem('termsAccepted', 'true');
        bootstrap.Modal.getInstance(document.getElementById('termsModal')).hide();
    });

    // Formulário de cadastro
    document.getElementById('cadastroForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const username = document.getElementById('username').value;
        const ativarCIU = document.getElementById('ativarCIU').checked;

        try {
            // Criar usuário no Firebase Auth
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Dados adicionais para o Realtime Database
            const userData = {
                username: username,
                email: email,
                ciuAtivado: ativarCIU,
                ip: await getUserIp()
            };

            if (ativarCIU) {
                userData.ciu = generateCIU();
                document.getElementById('ciuKey').textContent = userData.ciu;
                document.getElementById('userIp').textContent = userData.ip;
                new bootstrap.Modal(document.getElementById('ciuModal')).show();

                let secondsLeft = 5;
                const closeButton = document.getElementById('closeCiuModal');
                const countdownInterval = setInterval(() => {
                    secondsLeft--;
                    closeButton.textContent = `Fechar (${secondsLeft}s)`;
                    if (secondsLeft === 0) {
                        clearInterval(countdownInterval);
                        closeButton.disabled = false;
                        closeButton.textContent = 'Fechar';
                    }
                }, 1000);

                closeButton.addEventListener('click', () => {
                    bootstrap.Modal.getInstance(document.getElementById('ciuModal')).hide();
                });
            }

            // Salvar dados no Realtime Database
            await firebase.database().ref('users/' + user.uid).set(userData);

            alert('Cadastro realizado com sucesso!');
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Erro no cadastro:', error);
            alert('Erro no cadastro: ' + error.message);
        }
    });

    document.getElementById('ipInfo').addEventListener('click', () => {
        window.location.href = 'explore.html';
    });
});

// Inicializar AOS
AOS.init();