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

      Swal.fire({
        title: `Ingrese un evento para el ${fechaSeleccionada.toLocaleDateString()}`,
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
          const textoTarea = result.value;

          const nuevaTarea = {
            texto: textoTarea,
            completado: false,
            fecha: fechaSeleccionada.toISOString()
          };

          let diaTarea = nuevaTarea.fecha.slice(8, 10);
          let mesTarea = nuevaTarea.fecha.slice(5, 7);

          guardartareas.push(nuevaTarea.texto + ` - ${diaTarea}/${mesTarea}`);
          localStorage.setItem("tareas", JSON.stringify(guardartareas));

          let li = document.createElement("li");
          let div = document.createElement("div");
          div.classList.add("div_li");

          li.innerHTML = `<p>${nuevaTarea.texto} - ${diaTarea}/${mesTarea}</p>`;

          let botonBorrarIndividual = document.createElement("button");
          botonBorrarIndividual.classList.add("botonBorrarIndividual");
          
          botonBorrarIndividual.addEventListener("click", () => {
            li.remove();
            eliminarTareaDeLocalStorage(nuevaTarea);
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

          if (parseInt(diaTarea) === new Date().getDate() && parseInt(mesTarea) === new Date().getMonth() + 1) {
            Toastify({
              text: "Es para hoy",
              position: "left",
              duration: 3000
            }).showToast();
          }
        }
      });
  }
});

let texto = document.getElementById("fecha");

function convertirFecha(fechaString) {
  let partes = fechaString.split('/');
  let dia = partes[0];
  let mes = partes[1];
  let año = partes[2];

  return new Date(`${año}-${mes}-${dia}`);
}

function calcularDiferenciaEnDias(fecha1, fecha2) {
  const diferenciaMs = fecha2 - fecha1;
  return Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
}

function consultarFeriados() {
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
          .filter(feriado => feriado.fechaObj >= fechaActual)
          .sort((a, b) => a.fechaObj - b.fechaObj)[0];

        if (feriadoMasCercano) {
          let dia = feriadoMasCercano.fechaObj.getDate();
          let mes = feriadoMasCercano.fechaObj.getMonth() + 1;

          let diasFaltantes = calcularDiferenciaEnDias(fechaActual, feriadoMasCercano.fechaObj );

          texto.innerHTML = `${dia}/${mes} ${feriadoMasCercano.nombre} , faltan ${diasFaltantes +1} días.`;
        } else {
          texto.innerHTML = 'No hay feriados futuros en este año';
        }
      })
      .catch(error => {
        console.error('Error:', error);
        texto.innerHTML = 'Error al cargar los feriados';
      });
}

consultarFeriados();
