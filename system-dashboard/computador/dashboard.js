
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
  const changePasswordBtn = document.getElementById('changePasswordBtn');
  const deleteAccountBtn = document.getElementById('deleteAccountBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const reportBugBtn = document.getElementById('reportBugBtn');
  const bugReportForm = document.getElementById('bugReportForm');
  const toggleUserInfo = document.getElementById('toggleUserInfo');
  const userInfoContent = document.getElementById('userInfoContent');
  
  // Verificar status de autenticação
  firebase.auth().onAuthStateChanged((user) => {
      if (user) {
          authStatus.innerHTML = `
              <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#authModal">
                  <i class="fas fa-cog"></i> Autenticação
              </button>
          `;
          updateUserInfo(user);
      } else {
          authStatus.innerHTML = `
              <button type="button" class="btn btn-sm btn-outline-secondary">
                  <i class="fas fa-sign-in-alt"></i> Entrar
              </button>
          `;
      }
  });
  
  // Atualizar informações do usuário
  async function updateUserInfo(user) {
      document.getElementById('userUid').textContent = user.uid;
      document.getElementById('userIp').textContent = await getUserIp();
      document.getElementById('userBrowser').textContent = getBrowserInfo();
      document.getElementById('userDevice').textContent = getDeviceInfo();
  }
  
  // Obter IP do usuário
  async function getUserIp() {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
  }
  
  // Obter informações do navegador
  function getBrowserInfo() {
      const ua = navigator.userAgent;
      let browserName = "Desconhecido";
      if (ua.match(/chrome|chromium|crios/i)) {
          browserName = "Chrome";
      } else if (ua.match(/firefox|fxios/i)) {
          browserName = "Firefox";
      } else if (ua.match(/safari/i)) {
          browserName = "Safari";
      } else if (ua.match(/opr\//i)) {
          browserName = "Opera";
      } else if (ua.match(/edg/i)) {
          browserName = "Edge";
      }
      return browserName;
  }
  
  // Obter informações do dispositivo
  function getDeviceInfo() {
      const ua = navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
          return "Tablet";
      } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
          return "Smartphone";
      }
      return "Desktop";
  }
  
  // Alternar visibilidade das informações do usuário
  toggleUserInfo.addEventListener('click', () => {
      userInfoContent.classList.toggle('hidden');
      toggleUserInfo.innerHTML = userInfoContent.classList.contains('hidden') ? 
          '<i class="fas fa-eye"></i>' : 
          '<i class="fas fa-eye-slash"></i>';
  });
  
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
  
  // Abrir modal de reportar bug
  reportBugBtn.addEventListener('click', () => {
      new bootstrap.Modal(document.getElementById('reportBugModal')).show();
  });
  
  // Enviar relatório de bug
  bugReportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('bugReportEmail').value;
      const description = document.getElementById('bugDescription').value;
  
      // Salvar o relatório no Firebase Realtime Database
      firebase.database().ref('bugReports').push({
          email: email,
          description: description,
          timestamp: firebase.database.ServerValue.TIMESTAMP
      }).then(() => {
          Swal.fire({
              title: 'Obrigado!',
              text: 'Seu relatório de bug foi enviado com sucesso. Corrigiremos o problema o mais rápido possível.',
              icon: 'success',
              imageUrl: 'https://example.com/happy-people-image.jpg', // Substitua com a URL real da imagem
              imageWidth: 400,
              imageHeight: 200,
              imageAlt: 'Pessoas felizes'
          });
          document.getElementById('reportBugModal').querySelector('.btn-close').click();
      }).catch((error) => {
          Swal.fire(
              'Erro!',
              'Falha ao enviar o relatório: ' + error.message,
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
  
  // Notificação de cookies
  document.addEventListener('DOMContentLoaded', () => {
      if (!localStorage.getItem('cookiesAccepted')) {
          Swal.fire({
              title: 'Nós usamos cookies!',
              text: 'Este site usa cookies para melhorar sua experiência.',
              icon: 'info',
              showCancelButton: true,
              confirmButtonText: 'Aceitar',
              cancelButtonText: 'Ver documentação',
              reverseButtons: true
          }).then((result) => {
              if (result.isConfirmed) {
                  localStorage.setItem('cookiesAccepted', 'true');
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                  window.open('https://example.com/cookie-documentation', '_blank'); // Substitua com a URL real da documentação
              }
          });
      }
      
      showNotification('Bem-vindo', 'Você está conectado ao Painel de Controle FlowOps', 'success');
  });
  
  // Inicializar tooltips do Bootstrap
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  });