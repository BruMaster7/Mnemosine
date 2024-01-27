function matrizNueva() {
  let matriz = generarCamino([
    [null, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ]);
  //console.log(matriz);
  return matriz;
}

function casillasCorrectas (matriz) {
  let casillasCorrectas = 0;
    
  matriz.forEach(fila => {  
    for (elemento of fila) {
      if (elemento === 1 || elemento === 2) {
        casillasCorrectas ++;
      } 
    }
  });
  return casillasCorrectas;
}

function inicializar () {
  let laberinto = document.getElementById('laberinto');
  let matriz = matrizNueva();
  window.audioCorrecto = 0;
  window.finalizado = false;
  laberinto.setAttribute('data-casillas-correctas', casillasCorrectas(matriz));
  crearTablero(matriz);
}

// Null = Go, 1 = Camino posible, 0 = Te mata, 2 = Salida

function crearTablero (matriz) {
//  let indexMeme = 1;
  let laberinto = document.getElementById('laberinto');
  laberinto.setAttribute('data-casillas-descubiertas', 0);
  laberinto.innerHTML = '<div class="juego1"> </div>';

  matriz.forEach(fila => {  
    for (elemento of fila) {
      if (elemento == null) continue; // Si el elemento de la matriz es nulo, saltea el elemento

      let casilla = document.createElement('div');
      casilla.setAttribute('data-descubierta', false);
      casilla.classList.add('juego');

      if (elemento == 1) {
        casilla.classList.add('o');
      } else if (elemento == 0) {
        casilla.id = 'fail';
  //      indexMeme++;
        casilla.classList.add('x');
      } else if (elemento == 2) {
        casilla.id = 'salida';
      }
      casilla.addEventListener('click', (e) => juego(matriz, e));
      laberinto.appendChild(casilla);
    }

  }); 
  
}

function juego(matriz, evento) {

  if (window.finalizado) return;
  let casilla = evento.target;
  if (casilla.id.startsWith('fail')) {
    casilla.classList.add('fail'); 
    document.getElementById('audio').play();
    window.finalizado = true;
    setTimeout(() => {
      crearTablero(matriz),
      window.finalizado = false;
    }, 1000);
  } else if (casilla.classList.contains('o')) {
    casilla.classList.add('verde');
    document.getElementById(`audio${window.audioCorrecto}`).play();
    window.audioCorrecto = (window.audioCorrecto + 1) % 2;
    if (casilla.getAttribute('data-descubierta') === 'false') {
      window.finalizado = true;
      descubrirCasilla(casilla);
      setTimeout(() => {
        window.finalizado = false;
      }, 1000);
    }

  } else if (casilla.id == 'salida') {
    casilla.classList.add('salida');
    if (casilla.getAttribute('data-descubierta') === 'false') descubrirCasilla(casilla);
    document.getElementById('audio2').play();
    console.log(Boolean(casilla.getAttribute('data-descubierta')));
  }


}

function descubrirCasilla (casilla) {
  let laberinto = document.getElementById('laberinto');
  let contador = Number(laberinto.getAttribute('data-casillas-descubiertas'));
  let casillasCorrectas = Number(laberinto.getAttribute('data-casillas-correctas'));

  laberinto.setAttribute('data-casillas-descubiertas', ++contador);
  casilla.setAttribute('data-descubierta', true);
  console.log(contador);
  console.log(casillasCorrectas);
  if (contador === casillasCorrectas) {
    window.finalizado = true;
  }
}

document.addEventListener('DOMContentLoaded', inicializar);

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("genPath").addEventListener("click", inicializar);
});
