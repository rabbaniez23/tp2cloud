document.addEventListener("DOMContentLoaded", () => {
    const titleEl = document.getElementById("katalog-title");
    const nameEl = document.getElementById("owner-name");
    const nimEl = document.getElementById("owner-nim");
    const listEl = document.getElementById("item-list");
    const messageEl = document.getElementById("message");
    
    const backendUrlInput = document.getElementById("backend-url");
    const btnRefresh = document.getElementById("btn-refresh");
    const itemInput = document.getElementById("new-item");
    const btnAdd = document.getElementById("btn-add");

    const BASE_URL = '/api';

    const loadData = async () => {
        try {
            messageEl.textContent = "Memuat...";
            messageEl.className = "message";
            const res = await fetch(`${BASE_URL}/info`);
            if(!res.ok) throw new Error("Gagal terhubung ke backend");
            
            const data = await res.json();
            titleEl.textContent = data.judul_katalog;
            nameEl.textContent = `Nama: ${data.pemilik}`;
            nimEl.textContent = `NIM: ${data.nim}`;
            
            listEl.innerHTML = "";
            data.items.forEach(item => {
                const li = document.createElement("li");
                li.textContent = "🎵 " + item;
                listEl.appendChild(li);
            });
            messageEl.textContent = "";
        } catch (err) {
            console.error(err);
            messageEl.textContent = "Error: Pastikan URL Backend benar dan server menyala.";
            messageEl.className = "message msg-error";
        }
    };

    const addItem = async () => {
        const itemVal = itemInput.value.trim();
        if(!itemVal) {
            messageEl.textContent = "Masukkan nama lagu terlebih dahulu.";
            messageEl.className = "message msg-error";
            return;
        }

        try {
            messageEl.textContent = "Menyimpan...";
            const res = await fetch(`${BASE_URL}/add-item`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ item: itemVal })
            });

            if(!res.ok) throw new Error("Gagal menambah data");
            const data = await res.json();
            
            messageEl.textContent = data.message;
            messageEl.className = "message msg-success";
            itemInput.value = "";
            
            // Render ulang list
            listEl.innerHTML = "";
            data.items.forEach(item => {
                const li = document.createElement("li");
                li.textContent = "🎵 " + item;
                listEl.appendChild(li);
            });
            
            setTimeout(() => {
                if(messageEl.textContent === data.message) messageEl.textContent = "";
            }, 3000);

        } catch(err) {
            console.error(err);
            messageEl.textContent = "Gagal menambah data.";
            messageEl.className = "message msg-error";
        }
    };

    btnRefresh.addEventListener("click", loadData);
    btnAdd.addEventListener("click", addItem);
    itemInput.addEventListener("keypress", (e) => {
        if(e.key === "Enter") addItem();
    });

    // Auto load on init
    loadData();
});
