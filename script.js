const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let expression = "";
let justEvaluated = false;

function updateDisplay(value) {
  display.textContent = value || "0";
}

function isOperator(value) {
  return ["+", "-", "*", "/"].includes(value);
}

function calculate() {
  if (!expression) return;

  try {
    if (!/^[-+*/.\d\s]+$/.test(expression)) return;

    const result = Function(`"use strict"; return (${expression})`)();
    if (!Number.isFinite(result)) throw new Error("Invalid result");

    expression = String(Number(result.toFixed(12)));
    updateDisplay(expression);
    justEvaluated = true;
  } catch {
    updateDisplay("Error");
    expression = "";
  }
}

buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const value = button.dataset.value;
  const action = button.dataset.action;

  if (action === "clear") {
    expression = "";
    justEvaluated = false;
    updateDisplay("0");
    return;
  }

  if (action === "backspace") {
    expression = expression.slice(0, -1);
    updateDisplay(expression);
    return;
  }

  if (action === "equals") {
    calculate();
    return;
  }

  if (justEvaluated) {
    expression = isOperator(value) ? expression : "";
    justEvaluated = false;
  }

  if (isOperator(value)) {
    if (!expression) {
      if (value === "-") expression = "-";
      return;
    }

    if (isOperator(expression.at(-1))) {
      expression = expression.slice(0, -1) + value;
    } else {
      expression += value;
    }
  } else if (value === ".") {
    const parts = expression.split(/[+*/-]/);
    if (!parts.at(-1).includes(".")) expression += ".";
  } else {
    expression += value;
  }

  updateDisplay(expression);
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9+*/.-]$/.test(event.key)) {
    const button = [...document.querySelectorAll("button")]
      .find((item) => item.dataset.value === event.key);
    button?.click();
  } else if (event.key === "Enter" || event.key === "=") {
    document.querySelector('[data-action="equals"]').click();
  } else if (event.key === "Backspace") {
    document.querySelector('[data-action="backspace"]').click();
  } else if (event.key === "Escape") {
    document.querySelector('[data-action="clear"]').click();
  }
});
