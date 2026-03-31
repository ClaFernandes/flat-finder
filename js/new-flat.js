document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("new-flat-form");
    const pageTitle = document.querySelector(".page-title h1");
    const btnText = document.querySelector(".btn-save");

    // Dados e Sessão
    let flats = JSON.parse(localStorage.getItem("flats")) || [];
    const session = JSON.parse(localStorage.getItem("session"));
    const flatToEdit = JSON.parse(localStorage.getItem("flatToEdit"));

    if (!session) {
        window.location.href = "login.html";
        return;
    }

    // Se for EDIÇÃO, preenche os campos e muda o título
    if (flatToEdit) {
        pageTitle.textContent = "Editar Imóvel";
        btnText.innerHTML = '<i class="fa-solid fa-check"></i> Salvar Alterações';
        
        document.getElementById("flat-type").value = flatToEdit.type;
        document.getElementById("flat-city").value = flatToEdit.city;
        document.getElementById("flat-address").value = flatToEdit.address;
        document.getElementById("flat-number").value = flatToEdit.houseNumber;
        document.getElementById("flat-area").value = flatToEdit.area;
        document.getElementById("flat-ac").value = flatToEdit.hasAC ? "yes" : "no";
        document.getElementById("flat-year").value = flatToEdit.yearBuilt;
        document.getElementById("flat-price").value = flatToEdit.price;
        document.getElementById("flat-available").value = flatToEdit.availableFrom;
    }

    // Evento de Envio
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const newFlat = {
            id: flatToEdit ? flatToEdit.id : crypto.randomUUID(),
            ownerEmail: session.email,
            type: document.getElementById("flat-type").value.trim(),
            city: document.getElementById("flat-city").value.trim(),
            address: document.getElementById("flat-address").value.trim(),
            houseNumber: Number(document.getElementById("flat-number").value),
            area: Number(document.getElementById("flat-area").value),
            price: Number(document.getElementById("flat-price").value),
            hasAC: document.getElementById("flat-ac").value === "yes",
            yearBuilt: Number(document.getElementById("flat-year").value),
            availableFrom: document.getElementById("flat-available").value,
            isFavorite: flatToEdit ? flatToEdit.isFavorite : false
        };

        // Validação básica de data
        const dateInput = new Date(newFlat.availableFrom);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dateInput <= today && !flatToEdit) {
            alert("Por favor, selecione uma data futura para a disponibilidade.");
            return;
        }

        // Atualizar ou Criar
        if (flatToEdit) {
            const index = flats.findIndex(f => f.id === flatToEdit.id);
            if (index !== -1) flats[index] = newFlat;
            localStorage.removeItem("flatToEdit"); 
        } else {
            flats.push(newFlat);
        }

        localStorage.setItem("flats", JSON.stringify(flats));
        
        alert(flatToEdit ? "Imóvel atualizado com sucesso!" : "Imóvel publicado com sucesso!");
        window.location.href = "all-flats.html";
    });
});