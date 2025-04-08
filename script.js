const data = {
  "Санкт-Петербург": {
    "Орех": [
      { name: "ТБЗ", min: 10, price: 3500 },
      { name: "Small", min: 10, price: 2500 },
      { name: "Middle", min: 10, price: 2500 },
      { name: "Big", min: 10, price: 2500 },
      { name: "Max", min: 10, price: 2500 }
    ],
    "Окуневая": [
      { name: "Закрытие без программы", min: 12, price: 3200 },
      { name: "Артефакты/Руны", min: 6, price: 2800 }
    ]
  },
  "Москва": {
    "Варика": [
      { name: "Тотем", min: 6, price: 3000 },
      { name: "Выпускной", min: 6, price: 3200 }
    ]
  }
};

const citySelect = document.getElementById("city");
const parkSelect = document.getElementById("park");
const programSelect = document.getElementById("program");
const peopleCountInput = document.getElementById("peopleCount");
const prepaymentSpan = document.getElementById("prepayment");
const remainderSpan = document.getElementById("remainder");

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

parkSelect.addEventListener("change", () => {
  const city = citySelect.value;
  const park = parkSelect.value;

  programSelect.innerHTML = `<option value="">Выберите программу</option>`;

  if (data[city] && data[city][park]) {
    data[city][park].forEach(prog => {
      const opt = document.createElement("option");
      opt.value = prog.name;
      opt.textContent = prog.name;
      programSelect.appendChild(opt);
    });
    programSelect.disabled = false;
  } else {
    programSelect.disabled = true;
  }
});

function calculate() {
  const city = citySelect.value;
  const park = parkSelect.value;
  const programName = programSelect.value;
  const people = parseInt(peopleCountInput.value) || 0;

  const program = data[city]?.[park]?.find(p => p.name === programName);
  if (program) {
    const minPay = program.min * program.price;
    const fullPay = people * program.price;
    const rest = fullPay - minPay;

    const prepaymentSpan = document.getElementById("prepayment");
    const remainderSpan = document.getElementById("remainder");
    const fullAmountSpan = document.getElementById("fullAmount");

    prepaymentSpan.textContent = minPay.toLocaleString("ru-RU");
    remainderSpan.textContent = rest > 0 ? rest.toLocaleString("ru-RU") : 0;
    fullAmountSpan.textContent = fullPay.toLocaleString("ru-RU");
  }
}

peopleCountInput.addEventListener("input", calculate);
programSelect.addEventListener("change", calculate);
