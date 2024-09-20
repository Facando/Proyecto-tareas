// Seleccionamos los elementos del DOM
let boton = document.getElementById("boton")
let input = document.getElementById("input")
let listaDeTareas = document.getElementById("listaDeTareas")
//let fecha = document.getElementById("fecha")
let botonBorrar = document.getElementById("borrar")
const guardarfecha = localStorage.getItem("fecha")





// Función para agregar una tarea
const agregarTarea = () => {
    if (input.value !== "") {
        // Crear un nuevo elemento de lista
        let li = document.createElement("li")
        
        /* Obtener los valores de la fecha
        let fechaSeleccionada = new Date(fecha.value)
        let dia = fechaSeleccionada.getDate() + 1
        let mes = fechaSeleccionada.getMonth() + 1;// Obtener el mes (getMonth() devuelve 0 para enero)
        let año = fechaSeleccionada.getFullYear()*/

        // Configurar el contenido del elemento li
        li.innerHTML = `${input.value} `

        // Crear el botón de borrar individual
        let botonBorrarIndividual = document.createElement("button")
        
        botonBorrarIndividual.addEventListener("click", () => {
            li.remove() // Eliminar solo la tarea correspondiente
        })
        botonBorrarIndividual.classList.add("botonBorrarIndividual")
        let iconoBorrar = document.createElement("i")
        iconoBorrar.classList.add("fas", "fa-check")
        botonBorrarIndividual.appendChild(iconoBorrar)

        // Añadir los botones al li
        
        li.appendChild(botonBorrarIndividual)

        // Añadir la nueva tarea al contenedor de tareas
        listaDeTareas.appendChild(li)
        
    } else {
        alert("Debes agregar una tarea")
    }
    
    
}

// Función para borrar todas las tareas
const borrarTareas = () => {
    listaDeTareas.innerHTML = ""  // Borra todas las tareas de la lista
}

// Añadir los event listeners
boton.addEventListener("click", agregarTarea)
botonBorrar.addEventListener("click", borrarTareas)




// Función para calcular la edad y días hasta el próximo cumpleaños
const calcularEdadYDias = () => {
    let fechaCumple = document.getElementById("fechaCumple").value;
    if (!fechaCumple) {
        alert("Por favor, selecciona una fecha.");
        return
    }

    let hoy = new Date()
    let cumple = new Date(fechaCumple)

    // Calcular edad
    let edad = hoy.getFullYear() - cumple.getFullYear()
    let proximoCumple = new Date(hoy.getFullYear(), cumple.getMonth(), cumple.getDate())
    // Si el cumpleaños ya pasó este año, calcular para el próximo año
    if (hoy > proximoCumple) {
        proximoCumple.setFullYear(hoy.getFullYear() + 1)
        edad++
    }else if (hoy < proximoCumple) {
        
    }

    // Calcular días restantes
    let milisegundosPorDia = 1000 * 60 * 60 * 24
    let diasRestantes = Math.ceil((proximoCumple - hoy) / milisegundosPorDia)
    if (cumple == hoy) {    
        document.getElementById("resultado").innerText = "¡Felices cumpleaños!"
        return
    }
    // Mostrar resultado en pantalla
    let resultado = `Tienes ${edad} años y faltan ${diasRestantes} días para tu próximo cumpleaños.`
    document.getElementById("resultado").innerText = resultado
}

// Añadir event listener para el botón de calcular
document.getElementById("calcular").addEventListener("click", calcularEdadYDias)
