
let boton = document.getElementById("boton")
let input = document.getElementById("input")
let listaDeTareas = document.getElementById("listaDeTareas")
let botonBorrar = document.getElementById("borrar")

let fecha = document.getElementById("fechaCumple");
let resultado = document.getElementById("resultado");
let calcular = document.getElementById("calcular");
let mostrar = document.createElement("p")
let box = document.getElementById("box")





const agregarTarea = () => {
    if (input.value !== "") {
       
        let li = document.createElement("li")
        let div = document.createElement("div")
        div.classList.add("div_li")
        

     
        li.innerHTML = `<p>${input.value}</p> `

        
        let botonBorrarIndividual = document.createElement("button")
        
        botonBorrarIndividual.addEventListener("click", () => {
            li.remove() 
            Toastify({

                text: "Completado",
                position:"left",
                duration: 3000
                
                }).showToast();
        })
        botonBorrarIndividual.classList.add("botonBorrarIndividual")
        let iconoBorrar = document.createElement("i")
        iconoBorrar.classList.add("fas", "fa-check")
        botonBorrarIndividual.appendChild(iconoBorrar)

        // Añadir los botones al li
        
        li.appendChild(botonBorrarIndividual)

        // Añadir la nueva tarea al contenedor de tareas
        listaDeTareas.appendChild(div)
        div.appendChild(li)
        
    } else {
        Toastify({
            text: "Por favor, escribe una tarea",
            duration: 1200,
            destination: "",
            newWindow: true,
            close: false,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #e78c14, #e73314)",
            },
            onClick: function(){} // Callback after click
          }).showToast();
    }
    
    
}

// Función para borrar todas las tareas
const borrarTareas = () => {
    listaDeTareas.innerHTML = ""  // Borra todas las tareas de la lista
}

// Añadir los event listeners
boton.addEventListener("click", agregarTarea)
botonBorrar.addEventListener("click", borrarTareas)





box.appendChild(mostrar)

const calcularfecha = (fecha) => {
    
  const fechahoy = new Date()
    const diahoy = parseInt(fechahoy.getDate())
    const meshoy = parseInt(fechahoy.getMonth())+1
    const aniohoy = parseInt(fechahoy.getFullYear())
    
    const diaCumple = parseInt(String(fecha).substring(8,10))
    const mesCumple = parseInt(String(fecha).substring(5,7))
    const anioCumple = parseInt(String(fecha).substring(0,4))
  
    let edad = aniohoy - anioCumple
    if (meshoy < mesCumple) {
        edad--
    }else if(meshoy == mesCumple){ 
        if(diahoy < diaCumple){
            edad--
        }
    }

    return edad
}

const calculardias = (fecha) => {
      
  const fechahoy = new Date()
  const diahoy = parseInt(fechahoy.getDate())
  const meshoy = parseInt(fechahoy.getMonth())+1
  const aniohoy = parseInt(fechahoy.getFullYear())

  const diaCumple = parseInt(String(fecha).substring(8,10))
  const mesCumple = parseInt(String(fecha).substring(5,7))
  

 
  if (diahoy == diaCumple && meshoy == mesCumple) {
    Swal.fire({
        title: "Feliz cumpleaños.",
        
        imageUrl: "https://plus.unsplash.com/premium_vector-1682299666311-ef9c9836ae60?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: "Custom image"
      });
} else {
    // Calcular el próximo cumpleaños
    let proximoCumple = new Date(aniohoy, mesCumple - 1, diaCumple);
    if (proximoCumple < fechahoy) {
        proximoCumple.setFullYear(aniohoy + 1);
    }
    // Calcular la diferencia en días
    const diferencia = Math.round((proximoCumple - fechahoy) / (1000 * 60 * 60 * 24));
    
    mostrar.innerText = `Faltan ${diferencia} días para tu cumpleaños (${proximoCumple.toLocaleDateString()})`;
}
   
}

function guardafecha(fecha){
    localStorage.setItem("fecha", fecha.value)}

calcular.addEventListener("click", () => {
    resultado.innerText = `Tu edad es ${calcularfecha(fecha.value)}`
    calculardias(fecha.value)
    guardafecha(fecha.value)
   })
