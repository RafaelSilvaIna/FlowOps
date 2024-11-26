import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

// Firebase configuration
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
const auth = getAuth(app);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('background').appendChild(renderer.domElement);

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

// Animation
function animate() {
    requestAnimationFrame(animate);
    stars.rotation.y += 0.0005;
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Authentication state observer
onAuthStateChanged(auth, (user) => {
    const statusMessage = document.getElementById('status-message');
    if (user) {
        statusMessage.textContent = 'Authentication successful. Redirecting...';
        setTimeout(() => {
            window.location.href = '../../system-acess/system-main/AcessSecurity.html';
        }, 2000);
    } else {
        statusMessage.textContent = 'Not authenticated. Redirecting to login...';
        setTimeout(() => {
            window.location.href = '../system-auth-register/register.html'; 
        }, 2000);
    }
});

