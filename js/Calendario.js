

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
            title: "Feliz cumpleaños.",
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
    resultado.innerText = `Tu edad es ${calcularfecha(fecha.value)}`;
    calculardias(fecha.value);
});



const daysContainer = document.querySelector(".days");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
const todayBtn = document.querySelector(".today");
const month = document.querySelector(".month");

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const date = new Date();
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();

const renderCalendar = () => {
  date.setDate(1);
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const lastDayIndex = lastDay.getDay();
  const lastDayDate = lastDay.getDate();
  const prevLastDay = new Date(currentYear, currentMonth, 0);
  const prevLastDayDate = prevLastDay.getDate();
  const nextDays = 7 - lastDayIndex - 1;

  month.innerHTML = `${months[currentMonth]} ${currentYear}`;

  let days = "";

  for (let x = firstDay.getDay(); x > 0; x--) {
    days += `<div class="day prev">${prevLastDayDate - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDayDate; i++) {
    if (
      i === new Date().getDate() &&
      currentMonth === new Date().getMonth() &&
      currentYear === new Date().getFullYear()
    ) {
      days += `<div class="day today">${i}</div>`;
    } else {
      days += `<div class="day">${i}</div>`;
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next">${j}</div>`;
  }

  daysContainer.innerHTML = days;
  hideTodayBtn();
};

nextBtn.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
});

prevBtn.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
});

todayBtn.addEventListener("click", () => {
  currentMonth = date.getMonth();
  currentYear = date.getFullYear();
  renderCalendar();
});

function hideTodayBtn() {
  if (
    currentMonth === new Date().getMonth() &&
    currentYear === new Date().getFullYear()
  ) {
    todayBtn.style.display = "none";
  } else {
    todayBtn.style.display = "flex";
  }
}

renderCalendar();

// Evento de clic para los días del calendario
daysContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("day") && !e.target.classList.contains("prev") && !e.target.classList.contains("next")) {
      const day = e.target.innerText;  // Capturar el día seleccionado
      const selectedDate = new Date(currentYear, currentMonth, day);  // Crear la fecha con el año y mes actual

      // Mostrar SweetAlert para ingresar la tarea
      Swal.fire({
        title: `Ingrese un evento para el ${selectedDate.toLocaleDateString()}`,
        input: 'text',
        
        inputPlaceholder: 'Escriba su tarea aquí',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return 'Debe ingresar una tarea válida.';
          }
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const taskText = result.value;

          // Crear una nueva tarea
          const newTask = {
            text: taskText,  // La tarea ingresada por el usuario
            completed: false,
            date: selectedDate.toISOString()
          };

          let diaTarea = newTask.date.slice(8, 10);
          let mesTarea = newTask.date.slice(5, 7);

          // Agregar la nueva tarea a la lista
          guardartareas.push(newTask);
          localStorage.setItem("tareas", JSON.stringify(guardartareas));  // Guardar en localStorage

          // Mostrar la nueva tarea en la lista
          let li = document.createElement("li");
          let div = document.createElement("div");
          div.classList.add("div_li");

          li.innerHTML = `<p>${newTask.text} - ${diaTarea}/${mesTarea}</p>`;
          let botonBorrarIndividual = document.createElement("button");
          botonBorrarIndividual.classList.add("botonBorrarIndividual");

          botonBorrarIndividual.addEventListener("click", () => {
            li.remove();
            eliminarTareaDeLocalStorage(newTask);  // Eliminar la tarea del localStorage
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
          div.appendChild(li);
          listaDeTareas.appendChild(div);

          // Si la tarea es para hoy, mostrar alerta
          if(diaTarea == new Date().getDate() && mesTarea == new Date().getMonth() + 1){
            alert("Tarea programada para hoy");
          }
        }
      });
  }
});
