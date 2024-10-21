let boton = document.getElementById("boton");
let input = document.getElementById("input");
let descripcion = document.getElementById("descripcion");
let listaDeTareas = document.getElementById("listaDeTareas");
let botonBorrar = document.getElementById("borrar");
let filtroPrioridad = document.getElementById("filtroPrioridad");
let prioridad = document.getElementById("prioridad");
let buscador = document.getElementById("buscador");
let botonDeshacer = document.getElementById("deshacer");

let guardartareas = JSON.parse(localStorage.getItem("tareas")) || [];
let tareasEliminadas = []; // Array para almacenar las últimas tareas eliminadas

// Contenedor para notificaciones de tareas pendientes
let contenedorNotificaciones = document.createElement("div");
contenedorNotificaciones.classList.add("notificaciones");
document.body.appendChild(contenedorNotificaciones);

// Función para actualizar las notificaciones
const actualizarNotificaciones = () => {
    let tareasAltas = guardartareas.filter(tarea => tarea.prioridad === "alta" && !tarea.completado).length;
    let tareasMedias = guardartareas.filter(tarea => tarea.prioridad === "media" && !tarea.completado).length;
    let tareasBajas = guardartareas.filter(tarea => tarea.prioridad === "baja" && !tarea.completado).length;

    contenedorNotificaciones.innerHTML = `

        <p class="notificacionAlta">${tareasAltas}</p>
        <p class="notificacionMedia"> ${tareasMedias}</p>
        <p class="notificacionBaja"> ${tareasBajas}</p>
    `;
};

// Mostrar tareas al cargar la página
const mostrarTareasGuardadas = () => {
    listaDeTareas.innerHTML = '';  // Limpiar lista
    let filtro = filtroPrioridad.value;
    let busqueda = buscador.value.toLowerCase();

    guardartareas.filter(tarea => 
        (filtro === "todas" || tarea.prioridad === filtro) &&
        tarea.titulo.toLowerCase().includes(busqueda)
    ).forEach(tarea => {
        let li = document.createElement("li");
        let div = document.createElement("div");
        div.classList.add("div_li");

        // Mostrar la fecha solo si existe, sino solo el título y la prioridad
        if (tarea.fecha) {
            const fechaTarea = new Date(tarea.fecha);
            const diaTarea = fechaTarea.getDate();
            const mesTarea = fechaTarea.getMonth() + 1;
            li.innerHTML = `<p>${diaTarea}/${mesTarea} - <strong>${tarea.titulo} </strong><span class="prioridad">(${tarea.prioridad})<span>  <span class="salto"> ${tarea.descripcion}</span></p>`;
        } else {
            li.innerHTML = `<p><strong>${tarea.titulo} :</strong> (${tarea.prioridad})<span class="salto">${tarea.descripcion}<span></p>`;
        }

        let botonCompletar = document.createElement("button");
    botonCompletar.innerHTML = tarea.completado ? "Deshacer" : "Completar";
    botonCompletar.classList.add("botonCompletar");

    botonCompletar.addEventListener("click", () => {
    tarea.completado = !tarea.completado;  // Alterna entre completado y no completado

    if (tarea.completado) {
        li.classList.add("completada");  // Agrega la clase para mostrarla como completada
        botonCompletar.innerHTML = "Deshacer";  // Cambia el texto del botón
    } else {
        li.classList.remove("completada");  // Quita la clase de completada
        botonCompletar.innerHTML = "Completar";  // Cambia el texto del botón
    }

    actualizarLocalStorage();  // Actualiza el localStorage con el nuevo estado de la tarea
    actualizarNotificaciones();  // Actualiza las notificaciones
});


        let botonEditar = document.createElement("button");
        botonEditar.innerHTML = "Editar";
        botonEditar.classList.add("botonEditar");
        botonEditar.addEventListener("click", () => {
            Swal.fire({
                title: 'Editar tarea',
                html: `
        <input id="nuevoTitulo" class="swal2-input" value="${tarea.titulo}" placeholder="Nuevo título">
        <input id="nuevaDescripcion" class="swal2-input" value="${tarea.descripcion}" placeholder="Nueva descripción">
        <select id="nuevaPrioridad" class="swal2-input">
            <option value="alta" ${tarea.prioridad === 'alta' ? 'selected' : ''}>Alta</option>
            <option value="media" ${tarea.prioridad === 'media' ? 'selected' : ''}>Media</option>
            <option value="baja" ${tarea.prioridad === 'baja' ? 'selected' : ''}>Baja</option>
        </select>
    `,
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                  const nuevoTitulo = Swal.getPopup().querySelector('#nuevoTitulo').value;
                  const nuevaDescripcion = Swal.getPopup().querySelector('#nuevaDescripcion').value;
                  const nuevaPrioridad = Swal.getPopup().querySelector('#nuevaPrioridad').value;
                  if (!nuevoTitulo || !nuevaDescripcion) {
                    Swal.showValidationMessage('Ambos campos son requeridos');
                  }
                  return { nuevoTitulo, nuevaDescripcion, nuevaPrioridad };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    tarea.titulo = result.value.nuevoTitulo;
                    tarea.descripcion = result.value.nuevaDescripcion;
                    tarea.prioridad = result.value.nuevaPrioridad;
                    actualizarLocalStorage();
                    mostrarTareasGuardadas();
                    Swal.fire({
                        title: 'Actualizado',
                        text: 'La tarea ha sido actualizada',
                        icon: 'success',
                        timer: 1500
                    });
                }
            });
        });

        let botonBorrarIndividual = document.createElement("button");
        botonBorrarIndividual.innerHTML = "Borrar";
        botonBorrarIndividual.classList.add("botonBorrarIndividual");
        botonBorrarIndividual.addEventListener("click", () => {
            tareasEliminadas.push(tarea);  // Agregar la tarea al array de eliminadas
            li.remove();  // Remover la tarea de la lista
            eliminarTareaDeLocalStorage(tarea);

            Toastify({
                text: "Tarea eliminada",
                position: "right",
                duration: 3000
            }).showToast();
            actualizarNotificaciones();
        });

        li.appendChild(botonCompletar);
        li.appendChild(botonEditar);
        li.appendChild(botonBorrarIndividual);
        div.appendChild(li);
        listaDeTareas.appendChild(div);
    });
    actualizarNotificaciones();
};

// Función para agregar una nueva tarea
const agregarTarea = () => {
    if (input.value !== "" && descripcion.value !== "") {
        let tarea = {
            titulo: input.value,
            descripcion: descripcion.value,
            prioridad: prioridad.value,
            completado: false,
            fecha: null  // No se asigna fecha si no se agrega desde el calendario
        };
        
        guardartareas.push(tarea);
        localStorage.setItem("tareas", JSON.stringify(guardartareas));
        mostrarTareasGuardadas();
        input.value = "";  // Limpiar input
        descripcion.value = "";  // Limpiar descripción
    } else {
        Toastify({
            text: "Por favor, completa todos los campos.",
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
    listaDeTareas.innerHTML = "";
    localStorage.removeItem("tareas");
    guardartareas = [];
    actualizarNotificaciones();
};

// Función para eliminar una tarea específica del localStorage
const eliminarTareaDeLocalStorage = (tarea) => {
    guardartareas = guardartareas.filter(item => item !== tarea);
    localStorage.setItem("tareas", JSON.stringify(guardartareas));
};

// Función para actualizar el localStorage
const actualizarLocalStorage = () => {
    localStorage.setItem("tareas", JSON.stringify(guardartareas));
};

// Función para deshacer el último borrado (restaurar la última tarea eliminada)
const deshacerBorrado = () => {
    if (tareasEliminadas.length > 0) {
        let tareaRestaurada = tareasEliminadas.pop();  // Recuperar la última tarea eliminada
        guardartareas.push(tareaRestaurada);
        actualizarLocalStorage();
        mostrarTareasGuardadas();

        Toastify({
            text: "Tarea restaurada",
            position: "right",
            duration: 3000
        }).showToast();
        actualizarNotificaciones();
    } else {
        Toastify({
            text: "No hay tareas para deshacer",
            position: "right",
            duration: 3000,
            style: {
                background: "#f44336"
            }
        }).showToast();
    }
};

// Event listeners
boton.addEventListener("click", agregarTarea);
botonBorrar.addEventListener("click", borrarTareas);
filtroPrioridad.addEventListener("change", mostrarTareasGuardadas);
buscador.addEventListener("input", mostrarTareasGuardadas);
botonDeshacer.addEventListener("click", deshacerBorrado);

// Mostrar tareas al cargar la página
mostrarTareasGuardadas();

// Función para aplicar colores a las opciones según la prioridad
function aplicarColoresPrioridad() {
    const select = document.getElementById("prioridad");
    
    // Iterar sobre cada opción dentro del select
    for (let i = 0; i < select.options.length; i++) {
        let option = select.options[i];
        
        // Cambiar el color según el valor de la opción
        if (option.value === "alta") {
            option.style.backgroundColor = "#ff4d4d";  // Rojo para alta prioridad
            option.style.color = "white";
        } else if (option.value === "media") {
            option.style.backgroundColor = "#ffcc00";  // Amarillo para media prioridad
            option.style.color = "black";
        } else if (option.value === "baja") {
            option.style.backgroundColor = "#4caf50";  // Verde para baja prioridad
            option.style.color = "white";
        }
    }
}

// Llamar a la función cuando la página esté cargada
document.addEventListener("DOMContentLoaded", aplicarColoresPrioridad);




diahoy = new Date();
document.getElementById("diahoy").innerHTML = diahoy.toLocaleDateString();






