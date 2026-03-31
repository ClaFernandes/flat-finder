document.addEventListener("DOMContentLoaded", () => {
    let flats = JSON.parse(localStorage.getItem("flats")) || [];
    const session = JSON.parse(localStorage.getItem("session"));

    if (!session) {
        window.location.href = "login.html";
        return;
    }

    const tbody = document.getElementById("flats-body");
    const inputs = ["filter-city", "filter-price-min", "filter-price-max", "filter-area-min", "filter-area-max", "sort-by", "order"];
    
    // Captura todos os elementos de filtro de uma vez
    const elements = {};
    inputs.forEach(id => elements[id] = document.getElementById(id));

    function renderTable(flatsArray) {
        tbody.innerHTML = "";

        if (flatsArray.length === 0) {
            tbody.innerHTML = `<tr><td colspan="12" style="text-align:center; padding: 2rem;">Nenhum imóvel encontrado.</td></tr>`;
            return;
        }

        flatsArray.forEach((flat) => {
            const tr = document.createElement("tr");
            const isOwner = flat.ownerEmail === session.email;

            // Conteúdo das colunas básicas
            tr.innerHTML = `
                <td>${flat.type}</td>
                <td>${flat.city}</td>
                <td>${flat.address}</td>
                <td>${flat.houseNumber}</td>
                <td>${flat.area}</td>
                <td>${flat.hasAC ? "Sim" : "Não"}</td>
                <td>${flat.yearBuilt}</td>
                <td>${new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(flat.price)}</td>
                <td>${flat.availableFrom}</td>
            `;

            // 1. Coluna Favorito
            const tdFav = document.createElement("td");
            const btnFav = document.createElement("button");
            btnFav.className = "favorite-btn";
            btnFav.innerHTML = flat.isFavorite ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
            btnFav.onclick = () => {
                flat.isFavorite = !flat.isFavorite;
                localStorage.setItem("flats", JSON.stringify(flats));
                renderTable(flatsArray); 
            };
            tdFav.appendChild(btnFav);
            tr.appendChild(tdFav);

            // 2. Coluna Editar
            const tdEdit = document.createElement("td");
            const btnEdit = document.createElement("button");
            btnEdit.className = "edit-btn";
            btnEdit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
            btnEdit.disabled = !isOwner;
            btnEdit.onclick = () => {
                localStorage.setItem("flatToEdit", JSON.stringify(flat));
                window.location.href = "new-flat.html";
            };
            tdEdit.appendChild(btnEdit);
            tr.appendChild(tdEdit);

            // 3. Coluna Remover
            const tdRem = document.createElement("td");
            const btnRem = document.createElement("button");
            btnRem.className = "remove-btn";
            btnRem.innerHTML = '<i class="fa-solid fa-trash"></i>';
            btnRem.disabled = !isOwner;
            btnRem.onclick = () => {
                if(confirm("Deseja remover este imóvel?")) {
                    flats = flats.filter(f => f.id !== flat.id);
                    localStorage.setItem("flats", JSON.stringify(flats));
                    applyFilterSort();
                }
            };
            tdRem.appendChild(btnRem);
            tr.appendChild(tdRem);

            tbody.appendChild(tr);
        });
    }

    function applyFilterSort() {
        let filtered = [...flats];

        // Filtros
        const city = elements["filter-city"].value.toLowerCase();
        if (city) filtered = filtered.filter(f => f.city.toLowerCase().includes(city));
        
        const pMin = Number(elements["filter-price-min"].value);
        if (pMin) filtered = filtered.filter(f => f.price >= pMin);
        
        const pMax = Number(elements["filter-price-max"].value);
        if (pMax) filtered = filtered.filter(f => f.price <= pMax);

        // Ordenação
        const field = elements["sort-by"].value;
        const order = elements["order"].value;

        filtered.sort((a, b) => {
            let res = 0;
            if (field === "name") res = a.city.localeCompare(b.city);
            if (field === "price") res = a.price - b.price;
            if (field === "date") res = new Date(a.availableFrom) - new Date(b.availableFrom);
            return order === "asc" ? res : -res;
        });

        renderTable(filtered);
    }

    // Event Listeners
    Object.values(elements).forEach(el => el.addEventListener("input", applyFilterSort));
    document.getElementById("clear-filters").onclick = () => {
        Object.values(elements).forEach(el => el.value = "");
        applyFilterSort();
    };

    applyFilterSort();
});