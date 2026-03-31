document.addEventListener("DOMContentLoaded", () => {
    // Recupera os dados
    let flats = JSON.parse(localStorage.getItem("flats")) || [];
    const sessionData = JSON.parse(localStorage.getItem("session"));
    const userEmail = sessionData?.email || "";

    // Bloqueio de segurança
    if (!userEmail) {
        window.location.href = "login.html";
        return;
    }

    const tbody = document.getElementById("favorites-body");

    // Função para desenhar a tabela
    function renderTable() {
        // Filtra apenas os favoritos do usuário logado
        const favFlats = flats.filter(f => f.ownerEmail === userEmail && f.isFavorite);
        
        tbody.innerHTML = "";

        if (favFlats.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" style="text-align:center; padding: 4rem; color: #a0aec0; font-style: italic;">
                        Sua lista de favoritos está vazia. <br>
                        Vá em "Todos os Imóveis" e clique na estrela!
                    </td>
                </tr>`;
            return;
        }

        favFlats.forEach((flat) => {
            const tr = document.createElement("tr");

            // Formatação de Preço
            const priceFormatted = new Intl.NumberFormat("pt-PT", { 
                style: "currency", 
                currency: "EUR" 
            }).format(flat.price);

            // Injeta o conteúdo HTML da linha
            tr.innerHTML = `
                <td>${flat.type}</td>
                <td>${flat.city}</td>
                <td>${flat.address}</td>
                <td>${flat.houseNumber}</td>
                <td>${flat.area} m²</td>
                <td>${flat.hasAC ? "Sim" : "Não"}</td>
                <td>${flat.yearBuilt}</td>
                <td style="font-weight: 700; color: var(--color-primary1);">${priceFormatted}</td>
                <td>${flat.availableFrom}</td>
            `;

            // Criação do botão de estrela 
            const tdAction = document.createElement("td");
            const btnStar = document.createElement("button");
            btnStar.className = "btn-star";
            btnStar.innerHTML = '<i class="fa-solid fa-star"></i>';
            btnStar.title = "Remover dos favoritos";

            btnStar.addEventListener("click", () => {
                // Remove o favorito no array original
                const flatToUpdate = flats.find(f => f.id === flat.id);
                if (flatToUpdate) {
                    flatToUpdate.isFavorite = false;
                    localStorage.setItem("flats", JSON.stringify(flats));
                    renderTable(); 
                }
            });

            tdAction.appendChild(btnStar);
            tr.appendChild(tdAction);
            tbody.appendChild(tr);
        });
    }

    // Execução inicial
    renderTable();
});