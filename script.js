const pages = document.querySelectorAll(".page");
const links = document.querySelectorAll(".nav-btn");

links.forEach(link =>{
    link.addEventListener("click", function(e) {
        e.preventDefault(); // empêche le scroll automatique

        const target = this.getAttribute("href").substring(1);

        // cacher toutes les pages
        pages.forEach(page => page.classList.remove("active"));

        // afficher la bonne page
        document.getElementById(target).classList.add("active");
    });
});

// -------------------
// Constellation
// -------------------

const canvas = document.getElementById("constellation");

if (canvas) {
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const projects = [
    { name: "App mobile", tasksDone: 3 },
    { name: "Portfolio", tasksDone: 7 },
    { name: "UI Refactor", tasksDone: 1 }
  ];

  projects.forEach(project => {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;

    const size = 2 + project.tasksDone * 2;

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  });
}

// ----------------------------
// CRUD Projets + LocalStorage
// ----------------------------

const STORAGE_KEY = "bopit_projects";

function loadProjects() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return projects; //garde demo au début
    try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
    }   catch {
        return [];
    }
}

function saveProjects() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

const projectForm = document.getElementById("projectForm");
const projectName = document.getElementById("projectName");
const projectDone = document.getElementById("projectDone");
const projectList = document.getElementById("projectList");

//charge
projects = loadProjects();
saveProjects();

function renderProjectList() {
    if (!projectList) return;
    projectList.innerHTML = "";

    projects.forEach((p, index) => {
        const li = document.createElement("li");
        li.className = "project-row";
        li.innerHTML = `
            <div>
                <strong>${p.name}</strong><br></br>
                <small>${p.tasksDone} tâches terminées</small>
            </div>

            <div>
                <button data-action = "plus" data-index="${index}">+1</button>
                <button data-action = "delete" data-index="${index}">Supprimer</button>
            </div>
            `;
        projectList.appendChild(li);
    });
}

if (projectForm) {
    projectForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const name = projectName.ariaValueMax.trim();
        const done = Number(projectDone.value || 0);

        if (!name) return;

        projects.push({
            id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
            name,
            tasksDone: Math.max(0, done),
        });

        saveProjects();
        renderProjectList();

        //Rebuild + redraw constellation
        if (canvas) {
            buildStars();
            draw();
        }

        projectName.value = "";
        projectDone.value = "0";
    });

    projectList.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        const index = Number(btn.dataset.index);
        const action = btn.dataset.action;

        if (!Number.isFinite(index) || !projects[index]) return;

        if (action === "delete") {
            projects.splice(index, 1);
        }

        if (action === "plus") {
            projects[index].tasksDone +=1;
        }

        saveProjects();
        renderProjectList();

        if (canvas) {
            buildStars();
            draw();
        }
    });
}

renderProjectList();

