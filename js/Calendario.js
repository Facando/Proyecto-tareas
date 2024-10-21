const contenedorDias = document.querySelector(".days");


const botonSiguiente = document.querySelector(".next");
const botonAnterior = document.querySelector(".prev");
const botonHoy = document.querySelector(".today");
const mesElemento = document.querySelector(".month");

const meses = [
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

const diasSemana = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

const fechaActual = new Date();
let mesActual = fechaActual.getMonth();
let añoActual = fechaActual.getFullYear();

const actualizarCalendario = () => {
  fechaActual.setDate(1);
  const primerDia = new Date(añoActual, mesActual, 1);
  const ultimoDia = new Date(añoActual, mesActual + 1, 0);
  const indiceUltimoDia = ultimoDia.getDay();
  const fechaUltimoDia = ultimoDia.getDate();
  const ultimoDiaMesAnterior = new Date(añoActual, mesActual, 0);
  const fechaUltimoDiaMesAnterior = ultimoDiaMesAnterior.getDate();
  const diasSiguientes = 7 - indiceUltimoDia - 1;

  mesElemento.innerHTML = `${meses[mesActual]} ${añoActual}`;

  let dias = "";

  for (let x = primerDia.getDay(); x > 0; x--) {
    dias += `<div class="day prev">${fechaUltimoDiaMesAnterior - x + 1}</div>`;
  }

  for (let i = 1; i <= fechaUltimoDia; i++) {
    if (
      i === new Date().getDate() &&
      mesActual === new Date().getMonth() &&
      añoActual === new Date().getFullYear()
    ) {
      dias += `<div class="day today">${i}</div>`;
    } else {
      dias += `<div class="day">${i}</div>`;
    }
  }

  for (let j = 1; j <= diasSiguientes; j++) {
    dias += `<div class="day next">${j}</div>`;
  }

  contenedorDias.innerHTML = dias;
  ocultarBotonHoy();
};

botonSiguiente.addEventListener("click", () => {
  mesActual++;
  if (mesActual > 11) {
    mesActual = 0;
    añoActual++;
  }
  actualizarCalendario();
});

botonAnterior.addEventListener("click", () => {
  mesActual--;
  if (mesActual < 0) {
    mesActual = 11;
    añoActual--;
  }
  actualizarCalendario();
});

botonHoy.addEventListener("click", () => {
  mesActual = fechaActual.getMonth();
  añoActual = fechaActual.getFullYear();
  actualizarCalendario();
});

function ocultarBotonHoy() {
  if (
    mesActual === new Date().getMonth() &&
    añoActual === new Date().getFullYear()
  ) {
    botonHoy.style.display = "none";
  } else {
    botonHoy.style.display = "flex";
  }
}

actualizarCalendario();

contenedorDias.addEventListener("click", (e) => {
  if (e.target.classList.contains("day") && !e.target.classList.contains("prev") && !e.target.classList.contains("next")) {
      const dia = e.target.innerText;
      const fechaSeleccionada = new Date(añoActual, mesActual, dia);

      // Mostrar SweetAlert para ingresar título, descripción y prioridad
      Swal.fire({
        title: `Agregar tarea para el ${fechaSeleccionada.toLocaleDateString()}`,
        html: `
          <input id="tituloTarea" class="swal2-input" placeholder="Título de la tarea">
          <input id="descripcionTarea" class="swal2-input" placeholder="Descripción de la tarea">
          <select id="prioridadTarea" class="swal2-input">
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        `,
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          const titulo = Swal.getPopup().querySelector('#tituloTarea').value;
          const descripcion = Swal.getPopup().querySelector('#descripcionTarea').value;
          const prioridad = Swal.getPopup().querySelector('#prioridadTarea').value;
          if (!titulo || !descripcion) {
            Swal.showValidationMessage('Por favor, ingresa todos los campos');
          }
          return { titulo, descripcion, prioridad };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const nuevaTarea = {
            titulo: result.value.titulo,
            descripcion: result.value.descripcion,
            prioridad: result.value.prioridad,
            fecha: fechaSeleccionada.toISOString()
          };
         

          // Guardar la tarea en localStorage
          let tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];
          tareasGuardadas.push(nuevaTarea);
          localStorage.setItem("tareas", JSON.stringify(tareasGuardadas));

          // Mostrar tarea en la lista
          
          

          
        }
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        
        Toast.fire({
          icon: "success",
          title: ' Tarea agregada correctamente\n click para ver la Lista de Tareas.<a href="index.html" style="color: white;"> la Lista de Tareas.</a>'
        });
        
      });
  }
});

function convertirFecha(fechaString) {
  let partes = fechaString.split('-');
  let año = partes[0];
  let mes = partes[1] - 1;  // Los meses en JavaScript son de 0 a 11
  let dia = partes[2];
  return new Date(año, mes, dia);
}

function calcularDiferenciaEnDias(fecha1, fecha2) {
  const diferenciaMs = fecha2 - fecha1;
  return Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
}

function consultarFeriados() {
  const texto = document.getElementById('textoFeriado');

  fetch("https://api.argentinadatos.com/v1/feriados/2024")
    .then(response => response.json())
    .then(data => {
      let fechaActual = new Date();

      let feriadoMasCercano = data
        .map(feriado => {
          return {
            ...feriado,
            fechaObj: convertirFecha(feriado.fecha)
          };
        })
        .filter(feriado => feriado.fechaObj >= fechaActual)  // Feriados futuros
        .sort((a, b) => a.fechaObj - b.fechaObj)[0];  // Ordenar y obtener el más cercano

      if (feriadoMasCercano) {
        let dia = feriadoMasCercano.fechaObj.getDate();
        let mes = feriadoMasCercano.fechaObj.getMonth() + 1;

        let diasFaltantes = calcularDiferenciaEnDias(fechaActual, feriadoMasCercano.fechaObj);

        texto.innerHTML = `${dia}/${mes} - ${feriadoMasCercano.nombre}. Faltan ${diasFaltantes + 1} días.`;
      } else {
        texto.innerHTML = 'No hay feriados futuros en este año';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      texto.innerHTML = 'Error al cargar los feriados';
    });
}

document.addEventListener("DOMContentLoaded", () => {
  consultarFeriados();  // Llamada a la función al cargar la página
});

