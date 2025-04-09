let data = {};

const citySelect = document.getElementById("city");
const parkSelect = document.getElementById("park");
const programSelect = document.getElementById("program");
const peopleCountInput = document.getElementById("peopleCount");
const prepaymentSpan = document.getElementById("prepayment");
const remainderSpan = document.getElementById("remainder");
const fullAmountSpan = document.getElementById("fullAmount");
const dateInput = document.getElementById("date");
const occasionSelect = document.getElementById("occasion");

const getDayType = (dateStr) => {
  const day = new Date(dateStr).getDay();
  return (day === 0 || day === 6) ? "Выходные" : "Будни";
};

function filterPrograms() {
  const city = citySelect.value;
  const park = parkSelect.value;
  const dateStr = dateInput.value;
  const occasion = occasionSelect.value;

  programSelect.innerHTML = `<option value="">Выберите программу</option>`;
  programSelect.disabled = true;

  if (!data[city] || !data[city][park] || !dateStr) return;

  const dayType = getDayType(dateStr);

  const programs = data[city][park].filter(p => {
    const matchDay = p.days === "Ежедневно" || p.days === dayType;
    const matchOccasion = occasion === "Прогулка по билетам" ? p.walkOnly : true;
    return matchDay && matchOccasion;
  });

  programs.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.name;
    opt.textContent = p.name;
    programSelect.appendChild(opt);
  });

  programSelect.disabled = false;
}

function calculate() {
  const city = citySelect.value;
  const park = parkSelect.value;
  const programName = programSelect.value;
  const people = parseInt(peopleCountInput.value) || 0;

  const program = data[city]?.[park]?.find(p => p.name === programName);
  if (program) {
    const minPay = program.fixed || ((program.min || 0) * (program.price || 0));
    const fullPay = (people || 0) * (program.price || 0);
    const rest = fullPay - minPay;

    prepaymentSpan.textContent = minPay.toLocaleString("ru-RU");
    remainderSpan.textContent = rest > 0 ? rest.toLocaleString("ru-RU") : 0;
    fullAmountSpan.textContent = fullPay.toLocaleString("ru-RU");
  }
}

// Подгружаем данные из JSON
fetch('https://raw.githubusercontent.com/KelaBlack/npbitrix-app/main/data.json')
  .then(response => response.json())
  .then(json => {
    data = json;
    const event = new Event("change");
    citySelect.dispatchEvent(event);
  });

citySelect.addEventListener("change", () => {
  const city = citySelect.value;
  parkSelect.innerHTML = `<option value="">Выберите парк</option>`;
  programSelect.innerHTML = `<option>Сначала выберите парк</option>`;
  programSelect.disabled = true;
  if (data[city]) {
    Object.keys(data[city]).forEach(park => {
      const opt = document.createElement("option");
      opt.value = park;
      opt.textContent = park;
      parkSelect.appendChild(opt);
    });
    parkSelect.disabled = false;
  } else {
    parkSelect.disabled = true;
  }
});

dateInput.addEventListener("change", filterPrograms);
occasionSelect.addEventListener("change", filterPrograms);
parkSelect.addEventListener("change", filterPrograms);
programSelect.addEventListener("change", calculate);
peopleCountInput.addEventListener("input", calculate);
