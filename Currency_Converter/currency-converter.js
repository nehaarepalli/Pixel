const EXCHANGE_API_KEY = "25316001d45bca8baa0a60d0";

const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const convertButton = document.getElementById("convert-button");
const result = document.getElementById("result");
const error = document.getElementById("error");

const addedCodes = [];

const backupCurrencies = [
  ["USD", "United States Dollar"],
  ["INR", "Indian Rupee"],
  ["EUR", "Euro"],
  ["GBP", "British Pound"],
  ["JPY", "Japanese Yen"],
  ["AUD", "Australian Dollar"],
  ["CAD", "Canadian Dollar"],
  ["AED", "UAE Dirham"],
];

function showResult(text) {
  result.textContent = text;
  result.classList.remove("hidden");
  error.classList.add("hidden");
}

function showError() {
  error.textContent = "An error occurred, please try again later";
  error.classList.remove("hidden");
  result.classList.add("hidden");
}
function format(number) {
  return Number(number.toFixed(2)).toLocaleString("en-US", {
    minimumFractionDigits: 2,
  });
}
function makeFlag(code) {
  const country = code.slice(0, 2).toUpperCase();
  const first = 127397 + country.charCodeAt(0);
  const second = 127397 + country.charCodeAt(1);
  return String.fromCodePoint(first, second);
}
function addCurrency(code, name) {
  if (addedCodes.includes(code)) return; 
  addedCodes.push(code);

  const text = makeFlag(code) + " " + code + " - " + name;

  const option1 = document.createElement("option");
  option1.value = code;
  option1.textContent = text;
  fromCurrency.appendChild(option1);

  const option2 = document.createElement("option");
  option2.value = code;
  option2.textContent = text;
  toCurrency.appendChild(option2);
}

async function loadCurrencies() {
  const url =
    "https://v6.exchangerate-api.com/v6/" + EXCHANGE_API_KEY + "/codes";

  try {
    const response = await fetch(url);
    const data = await response.json();

    const list = data.supported_codes;

    for (let i = 0; i < list.length; i++) {
      addCurrency(list[i][0], list[i][1]);
    }
  } catch (problem) {
    
    for (let i = 0; i < backupCurrencies.length; i++) {
      addCurrency(backupCurrencies[i][0], backupCurrencies[i][1]);
    }
  }

  fromCurrency.value = "USD";
  toCurrency.value = "INR";
}

async function convert() {
  const amount = amountInput.value;
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (amount === "" || Number(amount) <= 0) {
    showError();
    return;
  }

  const url =
    "https://v6.exchangerate-api.com/v6/" +
    EXCHANGE_API_KEY +
    "/pair/" +
    from +
    "/" +
    to;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const rate = data.conversion_rate;
    const converted = Number(amount) * rate;

    showResult(amount + " " + from + " = " + format(converted) + " " + to);
  } catch (problem) {
    showError();
  }
}

convertButton.addEventListener("click", convert);

loadCurrencies();
