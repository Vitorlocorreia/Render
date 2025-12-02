// Lista de sensores
const sensores = [
  { id: 1, lat: -23.5505, lng: -46.6333, nome: 'Sensor Centro' },
  { id: 2, lat: -23.5590, lng: -46.6400, nome: 'Sensor Bairro A' },
  { id: 3, lat: -23.5450, lng: -46.6250, nome: 'Sensor Bairro B' }
];

// Cores de status para marcadores
const markerColors = {
  'Normal': 'green',
  'Alerta': 'yellow',
  'Risco': 'orange',
  'Situação Crítica': 'red'
};

document.addEventListener("DOMContentLoaded", function() {

  // Inicializa mapa
  const map = L.map('map').setView([-23.5505, -46.6333], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Garante que o mapa renderize corretamente
  setTimeout(() => map.invalidateSize(), 200);

  const sensorContainer = document.getElementById('sensor-cards');

  sensores.forEach(sensor => {
    // Cria card
    const card = document.createElement('div');
    card.className = 'sensor-card';
    card.id = `sensor-card-${sensor.id}`;
    card.innerHTML = `
      <strong>${sensor.nome}</strong>
      <span>Temperatura: <span id="temp-${sensor.id}" class="sensor-value">-- °C</span></span><br>
      <span>Umidade: <span id="hum-${sensor.id}" class="sensor-value">-- %</span></span><br>
      <span>Nível da Água: <span id="nivel-${sensor.id}" class="sensor-value">-- cm</span></span><br>
      <span>Status: <span id="status-${sensor.id}" class="sensor-value status-normal">Aguardando...</span></span>
    `;
    sensorContainer.appendChild(card);

    // Cria marcador colorido
    sensor.marker = L.circleMarker([sensor.lat, sensor.lng], {
      radius: 10,
      color: 'green',      // inicial
      fillColor: 'green',
      fillOpacity: 0.8
    }).addTo(map)
      .bindPopup(`${sensor.nome}<br>Atualizando...`);
  });

  function atualizarSensores() {
    const logList = document.getElementById('log-list');
    logList.innerHTML = '<li>Nenhum alerta até o momento.</li>';

    sensores.forEach(sensor => {
      const temperatura = (20 + Math.random() * 10).toFixed(1);
      const umidade = (50 + Math.random() * 30).toFixed(1);
      const nivelAgua = (Math.random() * 35).toFixed(1);

      let statusText = 'Normal';
      if(nivelAgua > 15 && nivelAgua <= 20) statusText = 'Alerta';
      if(nivelAgua > 20 && nivelAgua <= 25) statusText = 'Risco';
      if(nivelAgua > 25) statusText = 'Situação Crítica';

      // Atualiza lista de alertas
      if(statusText !== 'Normal') {
        logList.innerHTML += `<li>${sensor.nome}: ${statusText} (${nivelAgua} cm)</li>`;
      }

      // Atualiza popup do marcador
      sensor.marker.setStyle({
        color: markerColors[statusText],
        fillColor: markerColors[statusText]
      });
      sensor.marker.setPopupContent(`
        <strong>${sensor.nome}</strong><br>
        Temperatura: ${temperatura} °C<br>
        Umidade: ${umidade} %<br>
        Nível da Água: ${nivelAgua} cm<br>
        Status: <span class="sensor-value status-${statusText.replace(/ /g,'').toLowerCase()}">${statusText}</span>
      `);

      // Atualiza card
      document.getElementById(`temp-${sensor.id}`).innerText = temperatura + ' °C';
      document.getElementById(`hum-${sensor.id}`).innerText = umidade + ' %';
      document.getElementById(`nivel-${sensor.id}`).innerText = nivelAgua + ' cm';
      const statusEl = document.getElementById(`status-${sensor.id}`);
      statusEl.innerText = statusText;
      statusEl.className = 'sensor-value status-' + statusText.replace(/ /g,'').toLowerCase();
    });
  }

  atualizarSensores();
  setInterval(atualizarSensores, 5000);
});
