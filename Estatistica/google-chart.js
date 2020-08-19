$(document).ready(function() {
    carregarArquivo($('#arquivo-csv').prop('files')[0]);
});

function calcularTicksHoras(qtd) {
    const ticks = [];
    for (let i = 0; i <= qtd; i++) {
        ticks.push({v: HORA_SEGUNDO * i, f: segundosToString(HORA_SEGUNDO * i)})
    }
    return ticks;
}

function format(dt, column) {
    for (var i = 0; i < dt.getNumberOfRows(); i++) {
        dt.setFormattedValue(i, column, segundosToString(dt.getValue(i, column)));
    }
}

function formatarDatas(dataTable, inicio) {
    for (let i = inicio; i < dataTable.getNumberOfColumns(); i++) {
        format(dataTable, i);
    }
    return dataTable;
}

function desenharGraficos(tabelaHorarios) {
    const tiposArray = {
        diasDaSemana: TabelaHorarios.getArraySegundos(
            TabelaHorarios.getArrayDiasSemanaAgrupados(
                TabelaHorarios.getArrayTableSemTotal(tabelaHorarios.arrayTable)
            )
        ),
        aplicativos: TabelaHorarios.getArraySegundos( 
            TabelaHorarios.getArrayTableSemTotal(
                TabelaHorarios.getArrayTablePequenosAgrupados(tabelaHorarios.arrayTable)
            )
        ),
        aplicativosPorDia: TabelaHorarios.getArraySegundos(
            TabelaHorarios.diasPrimeiro(
                TabelaHorarios.getArrayTableSemTotal(
                    TabelaHorarios.getArrayTablePequenosAgrupados(tabelaHorarios.arrayTable)
                )
            )
        )
    }
    const tiposArraySoValores = {
        diasDaSemana: TabelaHorarios.semRotulos(tiposArray.diasDaSemana).map(linha => linha[0]),
        aplicativos: TabelaHorarios.semRotulos(tiposArray.aplicativos).map((linha) => linha.reduce(soma)),
        aplicativosPorDia: TabelaHorarios.semRotulos(tiposArray.aplicativosPorDia).map((linha) => linha.reduce(soma))
    }
    const tiposMedicoes = {
        horasNormais: (segundos) => segundos,
        horasInteiras: (segundos) => Math.round(segundos / HORA_SEGUNDO) * HORA_SEGUNDO
    }
    const options = {
        title:'Horarios',
        height:500,
        vAxis: {
            ticks: calcularTicksHoras(document.getElementById('ticks').value),
            baseline: 0
        },
        isStacked: document.getElementById('agrupar').checked
    };
    const desenhaAtualizaMedicoes = () => {
        chart.draw(formatarDatas(google.visualization.arrayToDataTable(tiposArray[mudaTipo.value]), 1), options);
        atualizaMedicoes(calcularTemposEmSegundos(tiposArraySoValores[mudaTipo.value]));
    }
    const calcularTemposEmSegundos = (arrayTable) => {
        const soValores = arrayTable;
        const temposEmSegundos = soValores.map(
                                    linha => tiposMedicoes[tipoMedicao.value](linha)
                                );
        return temposEmSegundos
    }
    const chart = new google.visualization.ColumnChart(document.getElementById('demo'));

    const mudaTipo = document.getElementById('muda-tipo');
    mudaTipo.innerHTML = '';
    appendMultipleChilds(mudaTipo, criaOpcoes(Object.keys(tiposArray)));
    mudaTipo.onchange = desenhaAtualizaMedicoes;

    const agrupar = document.getElementById('agrupar');
    agrupar.onchange = (event) => {options.isStacked = event.target.checked; desenhaAtualizaMedicoes();};

    const ticks = document.getElementById('ticks');
    ticks.onchange = (event) => {options.vAxis.ticks = calcularTicksHoras(event.target.value); desenhaAtualizaMedicoes();};
    
    const tipoMedicao = document.getElementById('tipo-medicao');
    tipoMedicao.innerHTML = '';
    appendMultipleChilds(tipoMedicao, criaOpcoes(Object.keys(tiposMedicoes)));
    tipoMedicao.onchange = desenhaAtualizaMedicoes;

    desenhaAtualizaMedicoes();
}
function soma(a, b) {
    return a + b;
}

function converteCamelCase(str) {
    return str.replace(/([A-Z])/g, ' $1')
                .toLowerCase()
                .replace(/^./, function(str){ return str.toUpperCase(); });
}

function appendMultipleChilds(pai, filhos) {
    filhos.forEach(filho => pai.appendChild(filho));
}

function criaOpcoes(opcoes) {
    const options = [];
    opcoes.forEach(
        (opcao) => {
            const option = document.createElement("option");
            option.value = opcao;
            option.text = converteCamelCase(opcao);
            options.push(option);
        }
    );
    return options;
}

function atualizaMedicoes(temposEmSegundos) {
    const media = _media(...temposEmSegundos);
    const moda = _moda(...temposEmSegundos);
    const mediana = _mediana(...temposEmSegundos);
    const desvio = _desvioPadraoAmostral(...temposEmSegundos);
    const variancia = _varianciaAmostral(...temposEmSegundos);
    document.getElementById('media').innerHTML = segundosToString(media);
    document.getElementById('moda').innerHTML = typeof moda === 'number' ? segundosToString(moda) : moda;
    document.getElementById('mediana').innerHTML = segundosToString(mediana);
    document.getElementById('desvio').innerHTML = desvio / 3600;
    document.getElementById('variancia').innerHTML = variancia / (3600 * 3600);
}

function segundoQuadradoToString(segundoQuadrado) {
    return segundosToString(segundoQuadrado / HORA_SEGUNDO);
}

function segundosToString(secs) {
    var sec_num = parseInt(secs, 10)
    var hours   = Math.floor(sec_num / HORA_SEGUNDO)
    var minutes = Math.floor(sec_num / MINUTO_SEGUNDO) % MINUTO_SEGUNDO
    var seconds = sec_num % MINUTO_SEGUNDO; 

    return [hours,minutes,seconds]
        .map(v => v < 10 ? "0" + v : v)
        .join(":");
}

function carregarArquivo(arquivo) {
    if (arquivo == null) return;
    CSVParaTabelaHorarios(arquivo, 
        tabelaHorarios => {
            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(() => desenharGraficos(tabelaHorarios));
    });
}

function CSVParaTabelaHorarios(arquivo, callback) {
    const leitor = new FileReader();
    leitor.readAsText(arquivo);
    leitor.onload = () => {
        callback(new TabelaHorarios(leitor.result));
    };
}

function criarArrayInteiro(ini, fim) {
    const retorno = [];
    for (let i = ini; i <= fim; i++) {
        retorno.push(i);
    }
    return retorno;
}