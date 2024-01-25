let matriz = generarCamino([
  [null, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0]
]);
//console.log(matriz);

let casillasCorrectas = 0;
  
matriz.forEach(fila => {  
  for (elemento of fila) {
    if (elemento === 1 || elemento === 2) {
      casillasCorrectas ++;
    } 
  }
});
console.log(casillasCorrectas);



// Null = Go, 1 = Camino posible, 0 = Te mata, 2 = Salida

function crearTablero () {
//  let indexMeme = 1;
  let laberinto = document.getElementById('laberinto');

  laberinto.innerHTML = '<div class="juego1"> </div>';
  laberinto.setAttribute('data-casillas-descubiertas', 0);
  
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
      casilla.addEventListener('click', juego);
      laberinto.appendChild(casilla);
    }

  }); 
  
}

function juego(evento){

  if (window.finalizado) return;
  let casilla = evento.target;
  if (casilla.id.startsWith('fail')) {
    casilla.classList.add('fail'); 
    document.getElementById('audio').play();
    setTimeout(crearTablero, 2000);
  } else if (casilla.classList.contains('o')) {
    casilla.classList.add('verde');
    document.getElementById('audio1').play();
    if (casilla.getAttribute('data-descubierta') === 'false') descubrirCasilla(casilla);
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
  laberinto.setAttribute('data-casillas-descubiertas', ++contador);
  casilla.setAttribute('data-descubierta', true);
  console.log(contador);
  console.log(casillasCorrectas);
  if (contador === casillasCorrectas) {
    window.finalizado = true;
  }
}

document.addEventListener('DOMContentLoaded', crearTablero);
