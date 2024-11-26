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
async function getUserIp() {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
}

let loginAttempts = 0;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Verificar IP e CIU
            const userData = (await firebase.database().ref('users/' + user.uid).once('value')).val();
            const currentIp = await getUserIp();

            if (userData.ip !== currentIp) {
                new bootstrap.Modal(document.getElementById('blockModal')).show();
                return;
            }

            if (userData.ciuAtivado) {
                new bootstrap.Modal(document.getElementById('ciuVerificationModal')).show();
            } else {
                // Login bem-sucedido, redirecionar para a página principal
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            console.error('Erro no login:', error);
            alert('Erro no login: ' + error.message);
        }
    });

    document.getElementById('verifyCIU').addEventListener('click', async () => {
        const ciuInput = document.getElementById('ciuInput').value;
        const user = firebase.auth().currentUser;
        const userData = (await firebase.database().ref('users/' + user.uid).once('value')).val();

        if (ciuInput === userData.ciu) {
            // CIU correto, redirecionar para a página principal
            window.location.href = 'dashboard.html';
        } else {
            loginAttempts++;
            if (loginAttempts >= 3) {
                // Bloquear login por 1 hora
                alert('Você excedeu o número máximo de tentativas. Seu acesso está bloqueado por 1 hora.');
                setTimeout(() => {
                    loginAttempts = 0;
                }, 3600000); // 1 hora em milissegundos
            } else {
                alert('CIU incorreto. Tente novamente.');
            }
        }
    });
});

// Inicializar AOS
AOS.init();