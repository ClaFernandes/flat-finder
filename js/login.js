document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const toggleIcons = document.querySelectorAll(".toggle-password");
    const btnReset = document.querySelector(".btn-reset");

    // Alternar visualização da senha
    toggleIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            const input = icon.previousElementSibling;
            const isPass = input.type === "password";
            input.type = isPass ? "text" : "password";
            icon.classList.toggle("fa-eye", !isPass);
            icon.classList.toggle("fa-eye-slash", isPass);
        });
    });

    // Lógica de Login
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.email === email);

        if (!user) {
            alert("Este e-mail não está registado.");
            return;
        }

        if (user.password !== password) {
            alert("A palavra-passe está incorreta.");
            return;
        }

        // Criar Sessão
        localStorage.setItem("session", JSON.stringify({
            email: user.email,
            name: user.firstName,
            loginAt: new Date().toISOString()
        }));

        window.location.href = "index.html";
    });

    // Lógica de "Reset" (Eliminar Conta)
    btnReset.addEventListener("click", () => {
        const emailInput = prompt("Introduza o e-mail da conta que deseja eliminar permanentemente:");
        if (!emailInput) return;

        const email = emailInput.trim().toLowerCase();
        let users = JSON.parse(localStorage.getItem("users")) || [];
        const userExists = users.find(u => u.email === email);

        if (!userExists) {
            alert("E-mail não encontrado no sistema.");
            return;
        }

        if (confirm("Tem a certeza? Todos os seus imóveis e dados serão apagados. Esta ação é irreversível!")) {
            // Remove o usuário
            users = users.filter(u => u.email !== email);
            localStorage.setItem("users", JSON.stringify(users));

            // Remove os imóveis do usuário
            let flats = JSON.parse(localStorage.getItem("flats")) || [];
            flats = flats.filter(f => f.ownerEmail !== email);
            localStorage.setItem("flats", JSON.stringify(flats));

            // Se for o usuário atual logado, limpa a sessão
            const session = JSON.parse(localStorage.getItem("session"));
            if (session && session.email === email) {
                localStorage.removeItem("session");
            }

            alert("A conta e todos os dados associados foram eliminados.");
            window.location.href = "register.html";
        }
    });
});