function asignarSalida(matriz) {
    let filaSalida = Math.floor(Math.random() * matriz.length);
    let columnaSalida = Math.floor(Math.random() * matriz.length);

    // Verificar que la posición generada no sea la posición inicial ni un espacio que mate (0)
    while (
        (matriz[filaSalida][columnaSalida] == null)
    ) {
        filaSalida = Math.floor(Math.random() * matriz.length);
        columnaSalida = Math.floor(Math.random() * matriz.length);
    }

    matriz[filaSalida][columnaSalida] = 2; // Asignar la salida en la matriz
}



function obtenerPosicionInicialYFinal(matriz) {
    let posicionInicial, posicionFinal;

    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            if (matriz[i][j] === null) {
                posicionInicial = { fila: i, columna: j };
            } else if (matriz[i][j] === 2) {
                posicionFinal = { fila: i, columna: j };
            }
        }
    }

    return { posicionInicial, posicionFinal };
}

// Algoritmo A* (A estrella) para recorrer la matriz hasta hallar el camino
// funcion()= G + H 

const ROW = 5;
const COL = 5;

class celda {
    // Row and Column index of its padre
    // Note that 0 <= i <= ROW-1 & 0 <= j <= COL-1
    constructor(){
        this.padre_i = 0;
        this.padre_j = 0;
        this.f = 0;
        this.g = 0;
        this.h = 0;
    }
}

function esValido(row, col)
{
    // Returns true if row number and column number
    // is in range
    return (row >= 0) && (row < ROW) && (col >= 0) && (col < COL);
}

function isDestination(row, col, dest)
{
    if (row == dest[0] && col == dest[1])
        return (true);
    else
        return (false);
}

function calcularValorH(row, col, dest)
{
    // Return using the distance formula
    return (Math.sqrt((row - dest[0]) * (row - dest[0]) + (col - dest[1]) * (col - dest[1])));
}

function tracePath(matriz, cellDetails, dest)
{
    //console.log("El camino es: ");
    let row = dest[0];
    let col = dest[1];
 
    // stack<Pair> Path;
    let Path = [];
 
    while (!(cellDetails[row][col].padre_i == row && cellDetails[row][col].padre_j == col)) {
        Path.push([row, col]);
        let temp_row = cellDetails[row][col].padre_i;
        let temp_col = cellDetails[row][col].padre_j;
        row = temp_row;
        col = temp_col;
    }
 
    Path.push([row, col]);
    Path = Path.slice(1,-1);

    while (Path.length > 0) {
        let p = Path[0];
        Path.shift();
         
        matriz[p[0]][p[1]] = 1;
    }
 
    return;
}

function aStarSearch(grid, src, dest) {
    let listaCerrada = new Array(ROW);
    for(let i = 0; i < ROW; i++){
        listaCerrada[i] = new Array(COL).fill(false);
    }
 
    // Declare a 2D array of structure to hold the details
    // of that celda
    let cellDetails = new Array(ROW);
    for(let i = 0; i < ROW; i++){
        cellDetails[i] = new Array(COL);
    }
 
    let i, j;

    for (i = 0; i < ROW; i++) {
        for (j = 0; j < COL; j++) {
            cellDetails[i][j] = new celda();
            cellDetails[i][j].f = 2147483647;
            cellDetails[i][j].g = 2147483647;
            cellDetails[i][j].h = 2147483647;
            cellDetails[i][j].padre_i = -1;
            cellDetails[i][j].padre_j = -1;
        }
    }
    // Inicializar el nodo
    i = src[0], j = src[1];
    cellDetails[i][j].f = 0;
    cellDetails[i][j].g = 0;
    cellDetails[i][j].h = 0;
    cellDetails[i][j].padre_i = i;
    cellDetails[i][j].padre_j = j;

     /*
    Cree una lista abierta que tenga información como: <f, <i,j>>
     donde f = g + h, || i, j son el índice de fila y columna de esa celda
     Tenga en cuenta que 0 <= i <= FILA-1 y 0 <= j <= COL-1
     Esta lista abierta se implementa como un conjunto de un par de par.*/
    
    let listaAbierta = new Map();
    listaAbierta.set(0, [i, j]);

    let destinoEncontrado = false;

    while (listaAbierta.size > 0) {
        let p = listaAbierta.entries().next().value
 
        // Remove this vertex from the open list
        listaAbierta.delete(p[0]);
 
        // Add this vertex to the closed list
        i = p[1][0];
        j = p[1][1];
        listaCerrada[i][j] = true;

        let gNew, hNew, fNew;
        // Only process this celda if this is a valid one

        // NORTE
        if (esValido(i - 1, j) == true) {
            // If the destination celda is the same as the
            // current successor
            if (isDestination(i - 1, j, dest) == true) {
                // Set the padre of the destination celda
                cellDetails[i - 1][j].padre_i = i;
                cellDetails[i - 1][j].padre_j = j;
                //console.log("The destination celda is found\n");
                tracePath(grid, cellDetails, dest);
                destinoEncontrado = true;
                return;
            } else if (!listaCerrada[i - 1][j]) {
                gNew = cellDetails[i][j].g + 1;
                hNew = calcularValorH(i - 1, j, dest);
                fNew = gNew + hNew;
            /* Si no está en la lista abierta, agréguelo a
                la lista abierta. Haz el cuadrado actual
                el padre de este cuadrado. Registre el
                Costo f, g y h de la celda cuadrada
                O
                Si ya está en la lista abierta, verifique
                para ver si este camino a esa plaza es
                mejor, usando el costo 'f' como medida. */
                if (cellDetails[i - 1][j].f == 2147483647
                    || cellDetails[i - 1][j].f > fNew) {
                    listaAbierta.set(fNew, [i - 1, j]);

                    // Update the details of this celda
                    cellDetails[i - 1][j].f = fNew;
                    cellDetails[i - 1][j].g = gNew;
                    cellDetails[i - 1][j].h = hNew;
                    cellDetails[i - 1][j].padre_i = i;
                    cellDetails[i - 1][j].padre_j = j;
                    }
            }
        } 


    //  SUR
    if (esValido(i + 1, j) == true) {
        // If the destination celda is the same as the
        // current successor
        if (isDestination(i + 1, j, dest) == true) {
            // Set the padre of the destination celda
            cellDetails[i + 1][j].padre_i = i;
            cellDetails[i + 1][j].padre_j = j;
            //console.log("The destination celda is found\n");
            tracePath(grid, cellDetails, dest);
            destinoEncontrado = true;
            return;
        } else if (!listaCerrada[i + 1][j]) {
            gNew = cellDetails[i][j].g + 1;
            hNew = calcularValorH(i + 1, j, dest);
            fNew = gNew + hNew;
            if (cellDetails[i + 1][j].f == 2147483647
                || cellDetails[i + 1][j].f > fNew) {
                listaAbierta.set(fNew, [i + 1, j]);
                // Update the details of this celda
                cellDetails[i + 1][j].f = fNew;
                cellDetails[i + 1][j].g = gNew;
                cellDetails[i + 1][j].h = hNew;
                cellDetails[i + 1][j].padre_i = i;
                cellDetails[i + 1][j].padre_j = j;
            }
        }
    }
    // ESTE
    if (esValido(i, j + 1) == true) {
        // If the destination celda is the same as the
        // current successor
        if (isDestination(i, j + 1, dest) == true) {
            // Set the padre of the destination celda
            cellDetails[i][j + 1].padre_i = i;
            cellDetails[i][j + 1].padre_j = j;
            //console.log("The destination celda is found\n");
            tracePath(grid, cellDetails, dest);
            destinoEncontrado = true;
            return;
        }
        else if (!listaCerrada[i][j + 1]) {
            gNew = cellDetails[i][j].g + 1;
            hNew = calcularValorH(i, j + 1, dest);
            fNew = gNew + hNew;
            if (cellDetails[i][j + 1].f == 2147483647
                || cellDetails[i][j + 1].f > fNew) {
                listaAbierta.set(fNew, [i, j + 1]);

                // Update the details of this celda
                cellDetails[i][j + 1].f = fNew;
                cellDetails[i][j + 1].g = gNew;
                cellDetails[i][j + 1].h = hNew;
                cellDetails[i][j + 1].padre_i = i;
                cellDetails[i][j + 1].padre_j = j;
            }
        }
    }
    // OESTE
    if (esValido(i, j - 1) == true) {
        // If the destination celda is the same as the
        // current successor
        if (isDestination(i, j - 1, dest) == true) {
            // Set the padre of the destination celda
            cellDetails[i][j - 1].padre_i = i;
            cellDetails[i][j - 1].padre_j = j;
            //console.log("The destination celda is found\n");
            tracePath(grid, cellDetails, dest);
            destinoEncontrado = true;
            return;
        }
        else if (!listaCerrada[i][j - 1]) {
            gNew = cellDetails[i][j].g + 1;
            hNew = calcularValorH(i, j - 1, dest);
            fNew = gNew + hNew;
            if (cellDetails[i][j - 1].f == 2147483647
                || cellDetails[i][j - 1].f > fNew) {
                listaAbierta.set(fNew, [i, j - 1]);

                // Update the details of this celda
                cellDetails[i][j - 1].f = fNew;
                cellDetails[i][j - 1].g = gNew;
                cellDetails[i][j - 1].h = hNew;
                cellDetails[i][j - 1].padre_i = i;
                cellDetails[i][j - 1].padre_j = j;
                }
            }
        }    
    }

}



function generarCamino(matriz) {
    asignarSalida(matriz);
    const { posicionInicial, posicionFinal } = obtenerPosicionInicialYFinal(matriz);

    aStarSearch(matriz, [posicionInicial.fila, posicionInicial.columna], [posicionFinal.fila, posicionFinal.columna]);
    //console.log(matriz);
    return matriz;


    }


