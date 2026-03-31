document.addEventListener("DOMContentLoaded", () => {
    // Seleção de elementos
    const form = document.getElementById("profile-form");
    const inputs = form.querySelectorAll("input:not([readonly])");
    const btnEdit = document.querySelector(".btn-edit");
    const btnSave = document.querySelector(".btn-update");
    const btnRemove = document.querySelector(".btn-remove");

    const session = JSON.parse(localStorage.getItem("session"));
    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (!session) {
        window.location.href = "login.html";
        return;
    }

    const currentUser = users.find(u => u.email === session.email);
    if (!currentUser) return;

    // Preencher campos iniciais
    document.getElementById("first-name").value = currentUser.firstName;
    document.getElementById("last-name").value = currentUser.lastName;
    document.getElementById("email").value = currentUser.email;
    document.getElementById("birthdate").value = currentUser.birthDate;

    // Lógica de Alternar Edição
    btnEdit.addEventListener("click", () => {
        const isEditing = btnEdit.classList.toggle("editing");
        
        inputs.forEach(input => input.disabled = !isEditing);
        btnEdit.innerHTML = isEditing ? '<i class="fa-solid fa-xmark"></i> Cancelar' : '<i class="fa-solid fa-pen"></i> Editar Perfil';
        btnEdit.style.background = isEditing ? "#94a3b8" : "var(--color-primary2)";
        btnSave.style.display = isEditing ? "flex" : "none";
    });

    // Olhinho 
    document.querySelectorAll(".toggle-password").forEach(icon => {
        icon.addEventListener("click", () => {
            const input = icon.previousElementSibling;
            const isPass = input.type === "password";
            input.type = isPass ? "text" : "password";
            icon.classList.toggle("fa-eye", !isPass);
            icon.classList.toggle("fa-eye-slash", isPass);
        });
    });

    // Guardar Alterações
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const newPass = document.getElementById("password").value;
        const confirmPass = document.getElementById("confirm-password").value;

        // Validação simples de idade
        const birth = new Date(document.getElementById("birthdate").value);
        const age = new Date().getFullYear() - birth.getFullYear();
        if (age < 18) return alert("Tens de ter pelo menos 18 anos.");

        if (newPass && newPass !== confirmPass) return alert("As passwords não coincidem.");

        // Atualizar objeto
        currentUser.firstName = document.getElementById("first-name").value;
        currentUser.lastName = document.getElementById("last-name").value;
        currentUser.birthDate = document.getElementById("birthdate").value;
        if (newPass) currentUser.password = newPass;

        localStorage.setItem("users", JSON.stringify(users));
        alert("Perfil atualizado com sucesso!");
        location.reload();
    });

    // Apagar Conta
    btnRemove.addEventListener("click", () => {
        if (confirm("Tens a certeza? Todos os teus imóveis e dados serão apagados permanentemente!")) {
            const newUsers = users.filter(u => u.email !== session.email);
            localStorage.setItem("users", JSON.stringify(newUsers));

            let flats = JSON.parse(localStorage.getItem("flats")) || [];
            localStorage.setItem("flats", JSON.stringify(flats.filter(f => f.ownerEmail !== session.email)));

            localStorage.removeItem("session");
            window.location.href = "login.html";
        }
    });
});