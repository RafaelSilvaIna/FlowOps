// Configuração do Firebase
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

// Elementos do DOM
const authStatus = document.getElementById('authStatus');
const darkModeToggle = document.getElementById('darkModeToggle');
const changePasswordBtn = document.getElementById('changePasswordBtn');
const deleteAccountBtn = document.getElementById('deleteAccountBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Verificar status de autenticação
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        authStatus.innerHTML = `
            <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#authModal">
                <i class="fas fa-cog"></i> Autenticação
            </button>
        `;
    } else {
        authStatus.innerHTML = `
            <button type="button" class="btn btn-sm btn-outline-secondary">
                <i class="fas fa-sign-in-alt"></i> Entrar
            </button>
        `;
    }
});

// Alternar modo escuro
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i> Modo Claro' : '<i class="fas fa-moon"></i> Modo Escuro';
});

// Verificar preferência salva de modo escuro
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
}

// Alterar senha
changePasswordBtn.addEventListener('click', () => {
    Swal.fire({
        title: 'Alterar Senha',
        input: 'password',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Alterar Senha',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: (password) => {
            return firebase.auth().currentUser.updatePassword(password)
                .then(() => {
                    return 'Senha atualizada com sucesso';
                })
                .catch((error) => {
                    Swal.showValidationMessage(`Falha na solicitação: ${error}`);
                });
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Sucesso!',
                text: result.value,
                icon: 'success'
            });
        }
    });
});

// Excluir conta
deleteAccountBtn.addEventListener('click', () => {
    Swal.fire({
        title: 'Tem certeza?',
        text: "Essa ação não pode ser revertida!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            firebase.auth().currentUser.delete()
                .then(() => {
                    Swal.fire(
                        'Excluída!',
                        'Sua conta foi excluída.',
                        'success'
                    );
                })
                .catch((error) => {
                    Swal.fire(
                        'Erro!',
                        'Falha ao excluir conta: ' + error.message,
                        'error'
                    );
                });
        }
    });
});

// Sair
logoutBtn.addEventListener('click', () => {
    firebase.auth().signOut()
        .then(() => {
            Swal.fire(
                'Desconectado!',
                'Você foi desconectado com sucesso.',
                'success'
            );
        })
        .catch((error) => {
            Swal.fire(
                'Erro!',
                'Falha ao desconectar: ' + error.message,
                'error'
            );
        });
});

// Função para mostrar notificações estilizadas
function showNotification(title, message, type) {
    Swal.fire({
        title: title,
        text: message,
        icon: type,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });
}

// Exemplo de uso da notificação
document.addEventListener('DOMContentLoaded', () => {
    showNotification('Bem-vindo', 'Você está conectado ao Painel de Controle FlowOps', 'success');
});
