const conciertos = [
  {
    fecha: '2026-06-15',
    banda: 'CRYPTA & BLOODHUNTER',
    genero: 'Death Metal',
    detalles: '19:30 Apertura de puertas\n20:00 - 20:45 BloodHunter\n21:05 - 22:20 Crypta',
    imagen: 'https://img.youtube.com/vi/t5pobBaJlv8/maxresdefault.jpg',
    youtubeLink: 'https://youtu.be/t5pobBaJlv8?si=OVD6fKL__n5hlAiM'
  },
  {
    fecha: '2026-06-17',
    banda: 'CROSS ROAD & UNDER WISH',
    genero: 'Grupos juveniles',
    detalles: 'ENTRADA GRATUITA\nVen a apoyar a las nuevas promesas del rock',
    imagen: 'https://www.urbanrockconcept.com/wp-content/uploads/2026/06/260617-Cross-Road-Under-Wish-Concierto-grupos-juveniles-El-Ensayadero-en-Vitoria-Gasteiz.webp',
    youtubeLink: 'https://youtu.be/VMYAEHE2GrM?si=Cep_2EsohtDcbbCA'
  },
  {
    fecha: '2026-06-21',
    banda: 'NICK DITTMEIER & THE SAWDUSTERS',
    genero: 'Country Rock',
    detalles: 'ENTRADA GRATUITA',
    imagen: 'https://nickdittmeier.com/wp-content/uploads/2026/02/monarch-apparition.jpg',
    youtubeLink: 'https://youtu.be/4FgiYUkxOPQ?si=ckgPnnEyWDIz0UN7'
  },
];

// ============================================
// Calendario - no tocar
// ============================================
const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

let currentDate = new Date();
let viewMonth = currentDate.getMonth();
let viewYear = currentDate.getFullYear();

const monthYearEl = document.getElementById('monthYear');
const daysGrid = document.getElementById('daysGrid');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const todayBtn = document.getElementById('todayBtn');
const concertInfoEl = document.getElementById('concertInfo');

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getConcertByDate(dateStr) {
  return conciertos.find(c => c.fecha === dateStr);
}

function renderCalendar() {
  monthYearEl.textContent = `${monthNames[viewMonth]} ${viewYear}`;
  daysGrid.innerHTML = '';

  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  let startOffset = (firstDay.getDay() + 6) % 7;

  const todayStr = formatDate(new Date());

  // Días del mes anterior
  const prevMonthLastDay = new Date(viewYear, viewMonth, 0).getDate();
  for (let i = startOffset - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const dayDate = new Date(viewYear, viewMonth - 1, dayNum);
    daysGrid.appendChild(createDayEl(dayNum, dayDate, true, todayStr));
  }

  // Días del mes actual
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dayDate = new Date(viewYear, viewMonth, d);
    daysGrid.appendChild(createDayEl(d, dayDate, false, todayStr));
  }

  // Rellenar cuadrícula
  const totalCells = daysGrid.children.length;
  const remaining = (Math.ceil(totalCells / 7) * 7) - totalCells;
  for (let d = 1; d <= remaining; d++) {
    const dayDate = new Date(viewYear, viewMonth + 1, d);
    daysGrid.appendChild(createDayEl(d, dayDate, true, todayStr));
  }
}

function createDayEl(num, date, isOtherMonth, todayStr) {
  const el = document.createElement('div');
  el.className = 'day';
  el.textContent = num;
  const dateStr = formatDate(date);
  const concert = getConcertByDate(dateStr);

  if (isOtherMonth) el.classList.add('other-month');
  if (dateStr === todayStr) el.classList.add('today');
  if (concert) el.classList.add('has-concert');

  el.addEventListener('click', () => {
    // Quitar selección anterior
    document.querySelectorAll('.day.selected').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');

    if (concert) {
      showConcert(concert, date);
    } else {
      concertInfoEl.innerHTML = '<p class="no-concert">No hay concierto programado este día</p>';
    }
  });

  return el;
}

function showConcert(concert, date) {
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const fechaFormateada = date.toLocaleDateString('es-ES', options);
  
  concertInfoEl.innerHTML = `
    <h3>${concert.banda}</h3>
    <div class="concert-date">📅 ${fechaFormateada} · ${concert.genero}</div>
    <div class="concert-details">${concert.detalles}</div>
  `;
  
  // Mostrar imagen del concierto con enlace a YouTube
  const concertImageEl = document.getElementById('concertImage');
  if (concert.imagen && concert.youtubeLink) {
    concertImageEl.innerHTML = `
      <a href="${concert.youtubeLink}" target="_blank" rel="noopener noreferrer" class="concert-image-link">
        <img src="${concert.imagen}" alt="${concert.banda}">
        <div class="play-overlay">▶</div>
      </a>
    `;
    concertImageEl.style.display = 'block';
  } else if (concert.imagen) {
    concertImageEl.innerHTML = `<img src="${concert.imagen}" alt="${concert.banda}">`;
    concertImageEl.style.display = 'block';
  } else {
    concertImageEl.innerHTML = '';
    concertImageEl.style.display = 'none';
  }
}

// Navegación
prevBtn.addEventListener('click', () => {
  viewMonth--;
  if (viewMonth < 0) { viewMonth = 11; viewYear--; }
  renderCalendar();
});

nextBtn.addEventListener('click', () => {
  viewMonth++;
  if (viewMonth > 11) { viewMonth = 0; viewYear++; }
  renderCalendar();
});

todayBtn.addEventListener('click', () => {
  const now = new Date();
  viewMonth = now.getMonth();
  viewYear = now.getFullYear();
  renderCalendar();
});

// Inicializar
const concertImageEl = document.getElementById('concertImage');
if (concertImageEl) {
  concertImageEl.innerHTML = '🎸 Selecciona un concierto';
  concertImageEl.style.display = 'flex';
}

renderCalendar();
