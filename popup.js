function renderPages(pages){
    const list = document.getElementById("pageList");
    list.innerHTML = "";

    pages.forEach((page, index) => {
        const li = document.createElement("li");
        li.style.alignItems = "center";

        const link = document.createElement("a");
        link.href = page.url;
        link.target = "_blank";
        link.textContent = page.title;
        link.style.width = "150px";
        link.style.paddingLeft = "0px";

        const noteText = document.createElement("div");
        noteText.textContent = page.note;
        noteText.style.fontSize = "11px";
        noteText.style.fontSize = "#105";
        noteText.style.width = "75px";


        const deleteBtn = document.createElement("button");
        deleteBtn.id = "deleteBtn"
        deleteBtn.textContent = "X";
        deleteBtn.style.height = "40px";
        deleteBtn.addEventListener("click", async() => {
            pages.splice(index,1);
            await chrome.storage.local.set({savedPages: pages});
            renderPages(pages);
        });

        li.appendChild(link);
        li.appendChild(deleteBtn);
        li.appendChild(noteText);
        list.appendChild(li);
    });
}

(async ()=>{
    const{ savedPages = [] } = await chrome.storage.local.get("savedPages");
    renderPages(savedPages);
})();

document.getElementById("saveBtn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true});
    const note = document.getElementById("noteInput").value;

    const { savedPages = [] } = await chrome.storage.local.get("savedPages");

    savedPages.push({ title: tab.title, url: tab.url, note});

    await chrome.storage.local.set({savedPages});

    document.getElementById("noteInput").value = "";
    allPages = savedPages;
    renderPages(savedPages);
});

let allPages = [];

(async () => {
    const {savedPages = [] } = await chrome.storage.local.get("savedPages");
    allPages = savedPages;
    renderPages(allPages);
})();

document.getElementById("searchInput").addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();

    const filtered = allPages.filter(page => 
        page.title.toLowerCase().includes(term) || 
        page.note.toLowerCase().includes(term)
    );
    renderPages(filtered);
});
