const MINUTO_SEGUNDO = 60;
const HORA_SEGUNDO = 60 * MINUTO_SEGUNDO;
class TabelaHorarios {
    constructor(textoCSV) {
        this.arrayTable = 
            this.arrayTableSemZeros(
                this.linhasParaDataTable(
                    this.linhasAntesTotal(
                        textoCSV.split('\r\n')
                    )
                )
            );
        this.arrayTable[0][0] = 'Aplicativos';
    }
    arrayTableSemZeros(arrayTable) {
        const arrayResultado = [arrayTable[0].slice()];
        arrayTable.slice(1).forEach(
            linha => {
                if (!linha.ultimo().startsWith('0')) {
                    arrayResultado.push(this.converteParaLinhaTimeOfDay(linha));
                }
            }
        )
        return arrayResultado;
    }

    converteParaLinhaTimeOfDay(linha) {
        return [linha.primeiro(), ...linha.slice(1).map(horario => TabelaHorarios.horarioToTimeOfDay(horario))];
    }

    linhasParaDataTable(linhas) {
        return linhas.map(linha => linha.split(';'))
    }
    linhasAntesTotal(linhas) {
        const _linhasAntesTotal = linhas.slice();
        let linha;
        do {
            linha = _linhasAntesTotal.pop();
        } while (linha != null && !linha.startsWith('Total;'))
        return _linhasAntesTotal;
    }

    arrayTable = [];
}

TabelaHorarios.getArrayTablePequenosAgrupados = function(arrayTable) {
    const valorPequeno = timeOfDayToSegundo([0, 30, 0]);
    const arrayTableCopia = [arrayTable.primeiro()];
    let totalAgrupados = [];
    arrayTable.slice(1).forEach(
        (linha) => {
            if (valorPequeno > timeOfDayToSegundo(linha.ultimo())) {
                totalAgrupados = somaArrayDeArrays(linha.slice(1), totalAgrupados)
            } else {
                arrayTableCopia.push(linha.slice())
            }
        }
    )
    arrayTableCopia.push(['Outros', ...totalAgrupados]);
    return arrayTableCopia;
}
TabelaHorarios.getArrayDiasSemanaAgrupados = function(arrayTable) {
    const agrupados = []; 
    agrupados.push(['Dia da semana', 'Tempo'])
    const dias = arrayTable.primeiro().slice(1);
    let tempo = [];
    arrayTable.slice(1).forEach((linha) => {
        tempo = somaArrayDeArrays(linha.slice(1), tempo);
    })
    dias.forEach((dia, i) => {agrupados.push([dia, tempo[i]])})
    return agrupados;
}
TabelaHorarios.getArrayTableSemTotal = function(arrayTable) {
    let copia = arrayTable.slice();
    const iTotal = copia[0].indexOf('Total');
    copia = copia.map(linha => linha = linha.slice())
    copia.forEach(linha => linha.splice(iTotal, 1));
    return copia;
}
TabelaHorarios.horarioToTimeOfDay = (string) => {
    const copia = string.split('');
    const data = [];
    const chars = ['h', 'm', 's']
    chars.forEach(
        char => {
            i = copia.indexOf(char);
            data.push(i === -1 ? 0 : primeiroTempoSemNome(copia, i));
        }
    )
    return data;
}
TabelaHorarios.diasPrimeiro = (arrayTable) => {
    return arrayTable.transpose();
}
TabelaHorarios.semRotulos = (arrayTable) => {
    const copia = [];
    arrayTable.slice(1).forEach(
        (linha) => copia.push(linha.slice(1))
    );
    return copia;
}
TabelaHorarios.getArraySegundos = (arrayTable) => {
    const copia = [];
    arrayTable.forEach((linha, i) => {
        copia[i] = [];
        linha.forEach((dado) => {
            copia[i].push(Array.isArray(dado) ? timeOfDayToSegundo(dado) : dado);
        })
    });
    return copia;
}
 
function primeiroTempoSemNome(array, posicaoString) {
    const numero = Number.parseInt(array.splice(0, posicaoString).join(''));
    array.splice(0, 2);
    return numero;
}

function somaArrays(array1, array2) {
    if (array2 == null) {
        return array1;
    }
    if (array1 == null) {
        return array2;
    }
    return array1.map((valor, i) => valor + array2[i]);
}

function timeOfDayToSegundo(timeOfDay) {
    return (timeOfDay[0] * HORA_SEGUNDO) + (timeOfDay[1] * MINUTO_SEGUNDO) + timeOfDay[2];
}

function somaArrayDeArrays(array1, array2) {
    return array1.map((valor, i) => somaArrays(valor, array2[i]));
}

Array.prototype.isZero = function() {
    return this.every(o => o === 0);
}

Array.prototype.ultimo = function() {
    return this[this.length - 1];
}

Array.prototype.primeiro = function() {
    return this[0];
}

Array.prototype.transpose = function() {

    // Calculate the width and height of the Array
    var largura = this.length || 0;
    var altura = this[0] instanceof Array ? this[0].length : 0;

    // In case it is a zero matrix, no transpose routine needed.
    if(altura === 0 || largura === 0) { return []; }

    let resultado = [];

    for(let i = 0; i < altura; i++) {
    resultado[i] = [];
    for(let j = 0; j < largura; j++) {
        resultado[i][j] = this[j][i];
    }
    }
    return resultado;
}