document.addEventListener("DOMContentLoaded", () => {
    const formRegister = document.getElementById('register-form');
    const firstNameInput = document.getElementById("first-name");
    const lastNameInput = document.getElementById("last-name");
    const emailInput = document.getElementById("email");
    const birthDateInput = document.getElementById("birthdate");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");

    // Toggle password (olhinho)
    const toggleIcons = document.querySelectorAll(".toggle-password");
    toggleIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            const input = icon.previousElementSibling;
            if (input.type === "password") {
                input.type = "text";
                icon.classList.add("fa-eye-slash");
                icon.classList.remove("fa-eye");
            } else {
                input.type = "password";
                icon.classList.add("fa-eye");
                icon.classList.remove("fa-eye-slash");
            }
        });
    });

    // Submit do formulário
    formRegister.addEventListener("submit", (e) => {
        e.preventDefault();
        registerUser();
    });

    function registerUser() {
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const email = emailInput.value.trim();
        const birthValue = birthDateInput.value;
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // VALIDAÇÕES
        if (!firstName || firstName.length < 2) return alert("O primeiro nome deve ter pelo menos 2 caracteres.");
        if (!lastName || lastName.length < 2) return alert("O apelido deve ter pelo menos 2 caracteres.");

        if (!email) return alert("Por favor, preencha o email.");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return alert("Email inválido!");

        if (!birthValue) return alert("Por favor, preencha a data de nascimento.");
        const today = new Date();
        const birthDate = new Date(birthValue);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthCalc = today.getMonth() - birthDate.getMonth();
        if (monthCalc < 0 || (monthCalc === 0 && today.getDate() < birthDate.getDate())) age--;
        if (age < 18 || age > 120) return alert("Deve ter idade entre 18 e 120 anos.");

        if (!password) return alert("Por favor, preencha a password.");
        const rules = [
            [password.length >= 6, "A password deve ter pelo menos 6 caracteres."],
            [/[a-zA-Z]/.test(password), "A password deve conter pelo menos uma letra."],
            [/[0-9]/.test(password), "A password deve conter pelo menos um número."],
            [/[^a-zA-Z0-9]/.test(password), "A password deve conter pelo menos um carácter especial."]
        ];
        for (let [condition, message] of rules) {
            if (!condition) return alert(message);
        }

        if (password !== confirmPassword) return alert("As passwords não coincidem.");

        // Guarda vários users no localStorage
        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
        if (storedUsers.some(user => user.email === email)) {
            return alert("Email já registrado. Tente outro.");
        }

        // Cria use e guarda no localStorage
        const newUser = {
            firstName,
            lastName,
            email,
            birthDate: birthValue,
            password
        };

        storedUsers.push(newUser);
        localStorage.setItem("users", JSON.stringify(storedUsers));
        alert("Conta criada com sucesso!");
        window.location.href = "index.html";
    }
});
