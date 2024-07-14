let currentChart = null; // Variable para mantener la referencia al gráfico actual

document
  .getElementById("convertButton")
  .addEventListener("click", convertCurrency);

const offlineData = {
  version: "1.7.0",
  autor: "mindicador.cl",
  fecha: "2022-08-04T20:00:00.000Z",
  uf: {
    codigo: "uf",
    nombre: "Unidad de fomento (UF)",
    unidad_medida: "Pesos",
    fecha: "2022-08-04T04:00:00.000Z",
    valor: 33455.92,
  },
  ivp: {
    codigo: "ivp",
    nombre: "Indice de valor promedio (IVP)",
    unidad_medida: "Pesos",
    fecha: "2022-08-04T04:00:00.000Z",
    valor: 34000.48,
  },
  dolar: {
    codigo: "dolar",
    nombre: "Dólar observado",
    unidad_medida: "Pesos",
    fecha: "2022-08-04T04:00:00.000Z",
    valor: 907.82,
  },
  dolar_intercambio: {
    codigo: "dolar_intercambio",
    nombre: "Dólar acuerdo",
    unidad_medida: "Pesos",
    fecha: "2014-11-13T03:00:00.000Z",
    valor: 758.87,
  },
  euro: {
    codigo: "euro",
    nombre: "Euro",
    unidad_medida: "Pesos",
    fecha: "2022-08-04T04:00:00.000Z",
    valor: 922.21,
  },
  ipc: {
    codigo: "ipc",
    nombre: "Indice de Precios al Consumidor (IPC)",
    unidad_medida: "Porcentaje",
    fecha: "2022-06-01T04:00:00.000Z",
    valor: 0.9,
  },
  utm: {
    codigo: "utm",
    nombre: "Unidad Tributaria Mensual (UTM)",
    unidad_medida: "Pesos",
    fecha: "2022-08-01T04:00:00.000Z",
    valor: 58772,
  },
  imacec: {
    codigo: "imacec",
    nombre: "Imacec",
    unidad_medida: "Porcentaje",
    fecha: "2022-06-01T04:00:00.000Z",
    valor: 3.7,
  },
  tpm: {
    codigo: "tpm",
    nombre: "Tasa Política Monetaria (TPM)",
    unidad_medida: "Porcentaje",
    fecha: "2022-08-04T04:00:00.000Z",
    valor: 9.75,
  },
  libra_cobre: {
    codigo: "libra_cobre",
    nombre: "Libra de Cobre",
    unidad_medida: "Dólar",
    fecha: "2022-08-04T04:00:00.000Z",
    valor: 3.54,
  },
  tasa_desempleo: {
    codigo: "tasa_desempleo",
    nombre: "Tasa de desempleo",
    unidad_medida: "Porcentaje",
    fecha: "2022-06-01T04:00:00.000Z",
    valor: 7.81,
  },
  bitcoin: {
    codigo: "bitcoin",
    nombre: "Bitcoin",
    unidad_medida: "Dólar",
    fecha: "2022-08-01T04:00:00.000Z",
    valor: 23298.94,
  },
};

async function fetchExchangeRates() {
  try {
    const response = await fetch("https://mindicador.cl/api");
    if (!response.ok) {
      throw new Error("Error al obtener datos de la API");
    }
    return await response.json();
  } catch (error) {
    displayError(error.message);
    return offlineData;
  }
}

async function convertCurrency() {
  const amount = document.getElementById("amount").value;
  const currency = document.getElementById("currency").value;

  const data = await fetchExchangeRates();
  if (!data) return;

  let rate = 0;
  switch (currency) {
    case "dolar":
      rate = data.dolar.valor;
      break;
    case "euro":
      rate = data.euro.valor;
      break;
    default:
      displayError("Moneda no soportada");
      return;
  }

  const convertedAmount = (amount / rate).toFixed(2);
  document.getElementById(
    "result"
  ).innerText = `Resultado: ${convertedAmount} ${currency.toUpperCase()}`;

  fetchHistoricalData(currency);
}

function displayError(message) {
  document.getElementById("error").innerText = `Error: ${message}`;
}

async function fetchHistoricalData(currency) {
  try {
    const response = await fetch(`https://mindicador.cl/api/${currency}`);
    if (!response.ok) {
      throw new Error("Error al obtener datos históricos de la API");
    }
    const data = await response.json();
    renderChart(data.serie.slice(0, 10));
  } catch (error) {
    displayError(error.message);
  }
}

function renderChart(data) {
  if (currentChart) {
    currentChart.destroy();
  }

  const labels = data.map((item) => new Date(item.fecha).toLocaleDateString());
  const values = data.map((item) => item.valor);

  const ctx = document.getElementById("myChart").getContext("2d");
  currentChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Valor en los últimos 10 días",
          data: values,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
}

/* termine por optar agregando ambas apis tanto la online como offline, se aplicaron estilos con archivo externo css,
se realizo una estructura basica en html, se agregaron ambas moneda dolar y euro al cual se puede cambiar presionando el boton select,
se agregaron ambos graficos de manera correcta*/