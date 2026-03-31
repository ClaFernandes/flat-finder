const path = window.location.pathname;

// Header dinâmico
function loadHeader() {
    const headerContainer = document.getElementById('navbar-js');
    if (!headerContainer) return;
    if (['login', 'register'].some(page => path.includes(page))) {
        headerContainer.innerHTML = '';
        return;
    }

    // Sessão 60 min
    const session = JSON.parse(localStorage.getItem("session"));

    if (!session) {
        window.location.href = './login.html';
        return;
    }
    const now = Date.now();
    const maxDuration = 60 * 60 * 1000;
    const sessionDuration = now - session.loginAt;
    if (sessionDuration > maxDuration) {
        localStorage.removeItem("session");
        alert("Sessão expirada! Faça login novamente.");
        window.location.href = './login.html';
        return;
    }

    // Saudação
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = users.find(user => user.email === session.email);
    if (!currentUser) {
        localStorage.removeItem("session");
        window.location.href = './login.html';
        return;
    }
    const username = `${currentUser.firstName} ${currentUser.lastName}`;

    headerContainer.innerHTML = `
    <nav class="navbar">
        <div class="navbar-flex container">
            <img src="assets/images/logo.png" alt="FlatFinder Logo" class="logo">
            <ul class="navbar-right">
                <li><a href="./index.html" class="index-link">PÁGINA INICIAL</a></li>
                <li><a href="./all-flats.html" class="all-link">TODOS OS IMÓVEIS</a></li>
                <li><a href="./new-flat.html" class="new-link">NOVO IMÓVEL</a></li>
                <li><a href="./profile.html" class="profile-link">PERFIL</a></li>
            </ul>
            <div class="navbar-session">
                <h4 id="welcome">Olá, <span id="username">${username}</span>!</h4>
                <button id="btn-logout">SAIR</button>
            </div>
        </div>
    </nav>
    `;

    // Logout
    const btnLogout = document.getElementById('btn-logout');
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem("session");
        window.location.href = './login.html';
    });

    // Link ativo
    if (window.location.href.includes("index.html")) {
        document.querySelector(".index-link")?.classList.add("active");
    }
    if (window.location.href.includes("all-flats.html")) {
        document.querySelector(".all-link")?.classList.add("active");
    }
    if (window.location.href.includes("new-flat.html")) {
        document.querySelector(".new-link")?.classList.add("active");
    }
    if (window.location.href.includes("profile.html")) {
        document.querySelector(".profile-link")?.classList.add("active");
    }

    // Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('navbar--scroll', window.scrollY > 0);
    });
}

// Footer dinâmico
function loadFooter() {
    const footerContainer = document.getElementById('footer-js');
    if (!footerContainer) return;

    if (['login', 'register'].some(page => path.includes(page))) {
        footerContainer.innerHTML = '';
        return;
    }

    footerContainer.innerHTML = `
    <footer class="footer">
        <div class="footer-container container">
            <div class="footer-left">
                <span class="footer-logo">FlatFinder</span>
                <span class="footer-location">Portugal</span>
            </div>
            <div class="footer-right">
                <a href="#"><i class="fab fa-linkedin"></i></a>
                <a href="#"><i class="fab fa-instagram"></i></a>
                <a href="#"><i class="fab fa-facebook"></i></a>
            </div>
        </div>
        <div class="footer-bottom">
            &copy; 2026 All rights reserved
        </div>
    </footer>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadFooter();
});

