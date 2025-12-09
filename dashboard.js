const DUMMY_ACTIVE = true;

const PARAMS = {
  startDate: "2025-11-01",
  endDate: "2025-11-09",
  branch: "Sambil Candelaria",
  commerce: "Optolapp"
};

const API = {
  title: "/api/dashboard/title",
  sales: "/api/dashboard/sales",
  comparison: "/api/dashboard/comparison",
  paymentMethods: "/api/dashboard/payment-methods",
  summary: "/api/dashboard/summary",
  incomeExpense: "/api/dashboard/income-expense",
  collected: "/api/dashboard/collected",
  chart: "/api/dashboard/chart"
};

function buildUrl(base, params) {
  const q = new URLSearchParams(params).toString();
  return `${base}?${q}`;
}

function getDummy() {
  const start = PARAMS.startDate.split("-").reverse().join("/");
  const end   = PARAMS.endDate.split("-").reverse().join("/");

  return {
    title: `${PARAMS.commerce} ${PARAMS.branch} del ${start} al ${end}`,
    sales: {
      total: 26522,
      avgPrevMonth: 2791,
      avgMonth: 2947,
      avgLastWeek: 2906,
      lastWeek: 20340
    },
    comparison: {
      commerceA: { name: "Cashea", amount: 18309, percent: 69, image: "cashea-logo.jpg" },
      commerceB: { name: "OpticaHD", amount: 8213, percent: 31, image: "optica-hd.webp" }
    },
    paymentMethods: [
      { name: "Efectivo", amount: 1775 },
      { name: "P. Móvil / Zelle", amount: 1410 },
      { name: "Cashea", amount: 11793 },
      { name: "Punto", amount: 10993 }
    ],
    summary: {
      cash: 12378,
      credit: 12800,
      deposit: 1344,
      productsSold: 271,
      maxClientsDay: 48,
      dayAvg: 4557
    },
    incomeExpense: {
      income: 25715,
      expense: 22820
    },
    collected: {
      cash: 1580,
      cashea: 930,
      total: 2510,
      pending: 420
    },
    chart: {
      dates: ["01/11/25","02/11/25","03/11/25","04/11/25","05/11/25","06/11/25","07/11/25","08/11/25","09/11/25"],
      sales: [1250,980,1430,1600,1520,1780,1650,1900,2040],
      collected: [900,750,1100,1300,1250,1500,1400,1650,1780],
      products: [12,10,14,15,13,17,16,19,21]
    }
  };
}

async function apiFetch(url, params = {}) {
  const finalUrl = buildUrl(url, params);
  const res = await fetch(finalUrl);
  if (!res.ok) throw new Error("Error en fetch: " + finalUrl);
  return res.json();
}

function fetchTitle()          { return apiFetch(API.title, PARAMS); }
function fetchSales()          { return apiFetch(API.sales, PARAMS); }
function fetchComparison()     { return apiFetch(API.comparison, PARAMS); }
function fetchMethods()        { return apiFetch(API.paymentMethods, PARAMS); }
function fetchSummary()        { return apiFetch(API.summary, PARAMS); }
function fetchIncomeExpense()  { return apiFetch(API.incomeExpense, PARAMS); }
function fetchCollected()      { return apiFetch(API.collected, PARAMS); }
function fetchChart()          { return apiFetch(API.chart, PARAMS); }

async function loadDashboard() {
  let data;

  if (DUMMY_ACTIVE) {
    data = getDummy();
  } else {
    data = {
      title:          await fetchTitle(),
      sales:          await fetchSales(),
      comparison:     await fetchComparison(),
      paymentMethods: await fetchMethods(),
      summary:        await fetchSummary(),
      incomeExpense:  await fetchIncomeExpense(),
      collected:      await fetchCollected(),
      chart:          await fetchChart()
    };
  }

  renderDashboard(data);
}

function renderDashboard(data) {
  document.getElementById('dashboard-title').textContent = data.title;

  document.getElementById('sales-total').textContent = "$" + data.sales.total.toLocaleString();
  document.getElementById('sales-last-week').textContent = "$" + data.sales.lastWeek.toLocaleString();
  document.getElementById('sales-avg-prev-month').textContent = data.sales.avgPrevMonth.toLocaleString();
  document.getElementById('sales-avg-month').textContent = data.sales.avgMonth.toLocaleString();
  document.getElementById('sales-avg-last-week').textContent = data.sales.avgLastWeek.toLocaleString();

  const CA = data.comparison.commerceA;
  const CB = data.comparison.commerceB;

  document.getElementById("commerceA-icon").src = CA.image;
  document.getElementById("commerceA-amount").textContent = "$" + CA.amount.toLocaleString();
  document.getElementById("commerceA-percent").textContent = CA.percent + "%";

  document.getElementById("commerceB-icon").src = CB.image;
  document.getElementById("commerceB-amount").textContent = "$" + CB.amount.toLocaleString();
  document.getElementById("commerceB-percent").textContent = CB.percent + "%";

  new Chart(document.getElementById("donut-comparison"), {
    type: "doughnut",
    data: {
      labels: [CB.name, CA.name],
      datasets: [{
        data: [CB.percent, CA.percent],
        backgroundColor: ["#136765", "#fdfe02"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "50%",
      plugins: { legend: { display: false } }
    }
  });

  const listContainer = document.getElementById("payment-methods-list");
  listContainer.innerHTML = data.paymentMethods
    .map(m => `
      <div class="col-md-12 col-lg-5 m-1 p-2 border rounded bg-light">
        <div class="small">${m.name}</div>
        <div class="fs-5 fw-bold">$${m.amount.toLocaleString()}</div>
      </div>
    `)
    .join("");

  new Chart(document.getElementById("payment-methods-pie"), {
    type: "pie",
    data: {
      labels: data.paymentMethods.map(m => m.name),
      datasets: [{
        data: data.paymentMethods.map(m => m.amount),
        backgroundColor: ["#136765", "#fdfe02", "#3b82f6", "#999999", "#6f42c1"]
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  document.getElementById("kpi-cash").textContent = "$" + data.summary.cash.toLocaleString();
  document.getElementById("kpi-credit").textContent = "$" + data.summary.credit.toLocaleString();
  document.getElementById("kpi-deposit").textContent = "$" + data.summary.deposit.toLocaleString();
  document.getElementById("kpi-products-sold").textContent = data.summary.productsSold.toLocaleString();
  document.getElementById("kpi-max-day").textContent = data.summary.maxClientsDay.toLocaleString();

  document.getElementById("available-amount").textContent =
    "$" + (data.incomeExpense.income - data.incomeExpense.expense).toLocaleString();

  function nextScale(v){
    const n = v.toString().length - 1;
    return Math.ceil(v / Math.pow(10,n)) * Math.pow(10,n);
  }

  const maxVal = nextScale(Math.max(data.incomeExpense.income, data.incomeExpense.expense));

  new Chart(document.getElementById("income-expense-chart"), {
    type: "bar",
    data: {
      labels: [""],
      datasets: [
        { label:"Egresos", data:[-data.incomeExpense.expense], backgroundColor:"#d40000", barThickness:16, borderRadius:3 },
        { label:"Ingresos", data:[data.incomeExpense.income], backgroundColor:"#00d42b", barThickness:16, borderRadius:3 }
      ]
    },
    options:{
      indexAxis:"y",
      plugins:{ legend:{ display:false } },
      scales:{
        x:{ min:-maxVal, max:maxVal, grid:{display:false} },
        y:{ grid:{display:false} }
      }
    }
  });

  document.getElementById("collected-cash").textContent = "$" + data.collected.cash;
  document.getElementById("collected-cashea").textContent = "$" + data.collected.cashea;
  document.getElementById("collected-total").textContent = "$" + data.collected.total;
  document.getElementById("collected-pending").textContent = "$" + data.collected.pending;

  new Chart(document.getElementById("main-chart"), {
    type: "bar",
    data: {
      labels: data.chart.dates,
      datasets: [
        { label:"Venta $", data:data.chart.sales, backgroundColor:"rgba(54,162,235,0.7)", borderColor:"rgba(54,162,235,1)" },
        { label:"Total Cobrado", data:data.chart.collected, backgroundColor:"rgba(75,192,75,0.7)", borderColor:"rgba(75,192,75,1)" },
        {
          label:"Productos Vendidos",
          data:data.chart.products,
          type:"line",
          yAxisID:"y2",
          borderColor:"red",
          backgroundColor:"red",
          pointRadius:4,
          borderWidth:2,
          tension:0.3
        }
      ]
    },
    options:{
      maintainAspectRatio:false,
      scales:{
        y:{ beginAtZero:true, ticks:{ callback:v=>"$"+v.toLocaleString() } },
        y2:{ beginAtZero:true, position:"right", grid:{ drawOnChartArea:false } }
      }
    },
    plugins:[ChartDataLabels]
  });
}

loadDashboard();
