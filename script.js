const data = [
    { codigo: "3", nombre: "Biología Celular y Molecular", semestre: 1, requisitos: [] },
    { codigo: "10", nombre: "Histoembriología Veterinaria", semestre: 2, requisitos: ["3"] },
    { codigo: "15", nombre: "Fisiología Veterinaria", semestre: 3, requisitos: ["10"] },
    { codigo: "20", nombre: "Etología y Bienestar Animal", semestre: 4, requisitos: ["15"] },
    { codigo: "32", nombre: "Semiología Veterinaria", semestre: 6, requisitos: ["20"] }
];

const container = document.getElementById("malla-container");

function crearTabla() {
    const agrupado = {};

    data.forEach(ramo => {
        if (!agrupado[ramo.semestre]) agrupado[ramo.semestre] = [];
        agrupado[ramo.semestre].push(ramo);
    });

    for (const [semestre, ramos] of Object.entries(agrupado)) {
        const semestreDiv = document.createElement("div");
        semestreDiv.classList.add("semestre", `semestre-${semestre}`);
        semestreDiv.innerHTML = `<h2>Semestre ${semestre}</h2>`;

        ramos.forEach(ramo => {
            const asignaturaDiv = document.createElement("div");
            asignaturaDiv.classList.add("asignatura");
            asignaturaDiv.dataset.codigo = ramo.codigo;
            asignaturaDiv.dataset.requisitos = JSON.stringify(ramo.requisitos);
            asignaturaDiv.innerHTML = `<h3>${ramo.nombre}</h3><p>Código: ${ramo.codigo}</p>`;
            semestreDiv.appendChild(asignaturaDiv);
        });

        container.appendChild(semestreDiv);
    }
}

function actualizarEstado() {
    const completados = JSON.parse(localStorage.getItem("ramos_aprobados") || "[]");

    document.querySelectorAll(".asignatura").forEach(asignatura => {
        const reqs = JSON.parse(asignatura.dataset.requisitos);
        const habilitado = reqs.every(r => completados.includes(r));

        asignatura.classList.remove("aprobado", "deshabilitado");

        if (completados.includes(asignatura.dataset.codigo)) {
            asignatura.classList.add("aprobado");
        } else if (!habilitado) {
            asignatura.classList.add("deshabilitado");
        }
    });
}

function manejarClick(e) {
    const asignatura = e.target.closest(".asignatura");
    if (!asignatura || asignatura.classList.contains("deshabilitado")) return;

    const completados = JSON.parse(localStorage.getItem("ramos_aprobados") || "[]");
    const codigo = asignatura.dataset.codigo;

    if (completados.includes(codigo)) {
        // Desaprobar
        const index = completados.indexOf(codigo);
        completados.splice(index, 1);
    } else {
        // Aprobar
        completados.push(codigo);
    }

    localStorage.setItem("ramos_aprobados", JSON.stringify(completados));
    actualizarEstado();
}

crearTabla();
actualizarEstado();
container.addEventListener("click", manejarClick);
