const aleatorio = _arrayInteirosAleatorio(20);

function _media(...numeros) {
    return numeros.reduce((total, n) => total + n) / numeros.length;
}

function _moda(...array) {
    moda = _todosIndicesMaiorValor(_valoresQuantidades(array));
    return moda.length != 1 ? '-' : Number(moda[0]);
}

function _mediana(...numeros) {
    return _numeroDoMeio(numeros.sort(comparacaoCrescente));
}

function _desvioPadraoAmostral(...numeros) {
    return Math.sqrt(_varianciaAmostral(...numeros));
}

function _varianciaAmostral(...numeros) {
    const media = _media(...numeros);
    const soma = numeros.reduce((acc, n) => acc += Math.pow((n - media), 2));
    return soma / (numeros.length - 1)
}

function comparacaoCrescente(a, b) {
    return a - b;
}

function _valoresQuantidades(valores) {
    const valoresQuantidades = {};
    valores.forEach((n) => valoresQuantidades[n] = valoresQuantidades[n] == null ? 1 : valoresQuantidades[n] + 1);
    return valoresQuantidades;
}

function _todosIndicesMaiorValor(objeto) {
    return _todasOcorrencias(_maiorValor(Object.values(objeto)), objeto);
}

function _maiorValor(array) {
    return array.reduce((maiorValor, n) => maiorValor = Math.max(maiorValor, n));
}

function _todasOcorrencias(valor, objeto) {
    const todasOcorrencias = [];
    Object.entries(objeto).forEach(([key, value]) => {if (value === valor) todasOcorrencias.push(key)})
    return todasOcorrencias;
}

function _numeroDoMeio(numeros) {
    return numeros.length % 2 == 0 ? _meioPar(numeros) : _meioImpar(numeros);
}
function _meioPar(array) {
    const metade = (array.length) / 2
    return _media(...array.slice(metade - 1, metade + 1));
}

function _meioImpar(array) {
    return array[(array.length - 1) / 2];
}

function _arrayInteirosAleatorio(quantidade) {
    const array = [];
    for (let i = 0; i < quantidade; i++) {
        array.push(_inteiroAleatorioAte100());
    }
    return array;
}

function _inteiroAleatorioAte100() {
    return _inteiroAleatorio(1, 10)
}

function _inteiroAleatorio(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}