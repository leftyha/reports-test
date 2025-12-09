<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Optolapp - Panel Ventas</title>

  <!-- Bootstrap -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

  <!-- Font Awesome -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">

  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script>

  <link rel="stylesheet" href="styles.css">
</head>

<body class="bg-light">

  <div class="container-fluid p-4">
    <h4 class="text-center fw-bold mb-4" id="titulo"></h4>

    <div class="row g-3" id="panels-root">
      <!-- Aquí van los paneles generados por JS -->
    </div>

    <div class="row mt-4">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header text-center fw-bold">Gráfica General</div>
          <div class="card-body">
            <canvas id="graficaGeneral" height="130"></canvas>
          </div>
        </div>
      </div>
    </div>

  </div>

  <script src="app.js"></script>
</body>
</html>
