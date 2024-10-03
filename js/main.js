let boton = document.getElementById("boton");
let input = document.getElementById("input");
let listaDeTareas = document.getElementById("listaDeTareas");
let botonBorrar = document.getElementById("borrar");
let fecha = document.getElementById("fechaCumple");
let resultado = document.getElementById("resultado");
let calcular = document.getElementById("calcular");
let mostrar = document.createElement("p");
let box = document.getElementById("box");
let guardartareas = JSON.parse(localStorage.getItem("tareas")) || [];

box.appendChild(mostrar);

// Función para mostrar las tareas almacenadas
const mostrarTareasGuardadas = () => {
    guardartareas.forEach(tarea => {
        let li = document.createElement("li");
        let div = document.createElement("div");
        div.classList.add("div_li");
        
        li.innerHTML = `<p>${tarea}</p>`;
        
        let botonBorrarIndividual = document.createElement("button");
        botonBorrarIndividual.classList.add("botonBorrarIndividual");
        
        botonBorrarIndividual.addEventListener("click", () => {
            li.remove();
            eliminarTareaDeLocalStorage(tarea);  // Eliminar la tarea del localStorage
            Toastify({
                text: "Completado",
                position: "left",
                duration: 3000
            }).showToast();
        });
        
        let iconoBorrar = document.createElement("i");
        iconoBorrar.classList.add("fas", "fa-check");
        botonBorrarIndividual.appendChild(iconoBorrar);
        
        li.appendChild(botonBorrarIndividual);
        listaDeTareas.appendChild(div);
        div.appendChild(li);
    });
};

// Función para agregar una nueva tarea
const agregarTarea = () => {
    if (input.value !== "") {
        let tarea = input.value;
        let li = document.createElement("li");
        let div = document.createElement("div");
        div.classList.add("div_li");

        li.innerHTML = `<p>${tarea}</p>`;
        
        let botonBorrarIndividual = document.createElement("button");
        botonBorrarIndividual.classList.add("botonBorrarIndividual");

        botonBorrarIndividual.addEventListener("click", () => {
            li.remove();
            eliminarTareaDeLocalStorage(tarea);  // Eliminar la tarea del localStorage
            Toastify({
                text: "Completado",
                position: "left",
                duration: 3000
            }).showToast();
        });

        let iconoBorrar = document.createElement("i");
        iconoBorrar.classList.add("fas", "fa-check");
        botonBorrarIndividual.appendChild(iconoBorrar);

        li.appendChild(botonBorrarIndividual);
        listaDeTareas.appendChild(div);
        div.appendChild(li);

        // Guardar la tarea en el localStorage
        guardartareas.push(tarea);
        localStorage.setItem("tareas", JSON.stringify(guardartareas));
        input.value = "";  // Limpiar el input
        
    } else {
        Toastify({
            text: "Por favor, escribe una tarea",
            duration: 1200,
            gravity: "top",
            position: "center",
            style: {
                background: "linear-gradient(to right, #e78c14, #e73314)"
            }
        }).showToast();
    }
};

// Función para borrar todas las tareas
const borrarTareas = () => {
    listaDeTareas.innerHTML = "";  // Borra todas las tareas de la lista
    localStorage.removeItem("tareas");  // Borra todas las tareas del localStorage
    guardartareas = [];  // Vaciar el array local
};

// Función para eliminar una tarea específica del localStorage
const eliminarTareaDeLocalStorage = (tarea) => {
    guardartareas = guardartareas.filter(item => item !== tarea);
    localStorage.setItem("tareas", JSON.stringify(guardartareas));
};

// Añadir los event listeners
boton.addEventListener("click", agregarTarea);
botonBorrar.addEventListener("click", borrarTareas);

// Mostrar las tareas almacenadas cuando se carga la página
mostrarTareasGuardadas();





// Funciones para el cálculo de edad y días hasta el cumpleaños
const calcularfecha = (fecha) => {
    const fechahoy = new Date();
    const diahoy = fechahoy.getDate();
    const meshoy = fechahoy.getMonth() + 1;
    const aniohoy = fechahoy.getFullYear();

    const diaCumple = parseInt(fecha.substring(8, 10));
    const mesCumple = parseInt(fecha.substring(5, 7));
    const anioCumple = parseInt(fecha.substring(0, 4));

    let edad = aniohoy - anioCumple;
    if (meshoy < mesCumple || (meshoy === mesCumple && diahoy < diaCumple)) {
        edad--;
    }
    return edad;
};


const calculardias = (fecha) => {
    const fechahoy = new Date();
    const diahoy = fechahoy.getDate();
    const meshoy = fechahoy.getMonth() + 1;
    const aniohoy = fechahoy.getFullYear();

    const diaCumple = parseInt(fecha.substring(8, 10));
    const mesCumple = parseInt(fecha.substring(5, 7));

    if (diahoy === diaCumple && meshoy === mesCumple) {
        Swal.fire({
            title: "¡Feliz cumpleaños!",
            imageUrl: "https://plus.unsplash.com/premium_vector-1682299666311-ef9c9836ae60?q=80&w=1368&auto=format&fit=crop",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Imagen de cumpleaños"
        });
    } else {
        let proximoCumple = new Date(aniohoy, mesCumple - 1, diaCumple);
        if (proximoCumple < fechahoy) {
            proximoCumple.setFullYear(aniohoy + 1);
        }
        const diferencia = Math.round((proximoCumple - fechahoy) / (1000 * 60 * 60 * 24));
        mostrar.innerText = `Faltan ${diferencia} días para tu cumpleaños (${proximoCumple.toLocaleDateString()})`;
    }
};

calcular.addEventListener("click", () => {
    if (!fecha.value) {
        Toastify({
            text: "Por favor, ingresa una fecha.",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "#f44336",
            stopOnFocus: true,
        }).showToast();
    } else {
        resultado.innerText = `Tu edad es ${calcularfecha(fecha.value)}`;
        calculardias(fecha.value);
    }
});
