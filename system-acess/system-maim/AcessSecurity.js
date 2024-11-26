const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('space-background').appendChild(renderer.domElement);

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

        // Elementos de distração
        const distractionElements = ['🔒', '🛡️', '🔐', '🔑', '🖥️', '📡', '🌐', '💻'];
        for (let i = 0; i < 20; i++) {
            const distraction = document.createElement('div');
            distraction.className = 'distraction';
            distraction.style.left = `${Math.random() * 100}%`;
            distraction.style.top = `${Math.random() * 100}%`;
            distraction.textContent = distractionElements[Math.floor(Math.random() * distractionElements.length)];
            document.body.appendChild(distraction);
        }

        // Funções de verificação de segurança
        async function checkIP() {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        }

        function checkBrowser() {
            const parser = new UAParser();
            return parser.getResult();
        }

        async function checkVPN() {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            return data.proxy;
        }

        function checkLocalStorage() {
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                return true;
            } catch (e) {
                return false;
            }
        }

        // Função principal de verificação
        async function runSecurityCheck() {
            const progressBar = document.getElementById('progress-bar');
            const status = document.getElementById('status');
            let progress = 0;

            const updateProgress = (step) => {
                progress += step;
                progressBar.style.width = `${progress}%`;
                progressBar.setAttribute('aria-valuenow', progress);
                progressBar.textContent = `${Math.round(progress)}%`;
            };

            status.textContent = 'Verificando IP...';
            const ip = await checkIP();
            updateProgress(25);

            status.textContent = 'Analisando navegador...';
            const browserInfo = checkBrowser();
            updateProgress(25);

            status.textContent = 'Verificando VPN...';
            const isVPN = await checkVPN();
            updateProgress(25);

            status.textContent = 'Testando armazenamento local...';
            const localStorageAvailable = checkLocalStorage();
            updateProgress(25);

            // Simulação de análise final
            await new Promise(resolve => setTimeout(resolve, 2000));

            const securityReport = {
                ip: ip,
                browser: browserInfo.browser.name,
                os: browserInfo.os.name,
                isVPN: isVPN,
                localStorageAvailable: localStorageAvailable
            };

            if (isVPN || !localStorageAvailable) {
                status.textContent = 'Alerta de segurança! Acesso bloqueado.';
                alert('Detectamos um problema de segurança. Por favor, desative seu VPN ou permita o uso de localStorage.');
            } else {
                status.textContent = 'Verificação concluída com sucesso!';
                document.getElementById('modal').style.display = 'block';
            }

            return securityReport;
        }

        // Event Listeners
        document.getElementById('start-check').addEventListener('click', async () => {
            if (confirm('Você permite que realizemos a verificação de segurança?')) {
                document.getElementById('start-check').style.display = 'none';
                await runSecurityCheck();
            } else {
                alert('Você não poderá prosseguir sem a verificação de segurança.');
            }
        });

        document.getElementById('download-pdf').addEventListener('click', () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.text('Relatório de Segurança', 10, 10);
            // Adicione mais detalhes ao PDF conforme necessário
            doc.save('relatorio-seguranca.pdf');
        });

        document.getElementById('close-modal').addEventListener('click', () => {
            const dontShowAgain = document.getElementById('dont-show-again').checked;
            if (dontShowAgain) {
                localStorage.setItem('dontShowSecurityCheck', 'true');
            }
            document.getElementById('modal').style.display = 'none';
            window.location.href = 'dashboard.html';
        });

        // Verificar se deve mostrar a tela de segurança
        if (localStorage.getItem('dontShowSecurityCheck') === 'true') {
            window.location.href = 'dashboard.html';
        }