const btnnValue = document.querySelectorAll(".btn");
const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");

let current = "";
let displayedExpr = "";
let lastWasEqual = false;

function formatExpression(expr) {
  if (!expr) return "";
  const numbersonhap = /[0-9]*\.?[0-9]+/g;
  let result = "";
  let lastIndex = 0;
  expr.replace(numbersonhap, (match, vitri) => {
    result += expr.slice(lastIndex, vitri);
    const formatted = Number(match).toLocaleString("vi-VN");
    result += formatted;
    lastIndex = vitri + match.length;
  });
  result += expr.slice(lastIndex);
  return result;
}

btnnValue.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.getAttribute("data-filter");
    if (value === "C") {
      current = "";
      displayedExpr = "";
      resultDisplay.textContent = "";

      expressionDisplay.textContent = "";
      lastWasEqual = true;
    } else if (value === "=") {
      try {
        if (!current) return;
        let computerExpr = current.replace(/([0-9.]+)%/g, "($1/100)");
        const rowResult = eval(computerExpr);
        resultDisplay.textContent = formatExpression(rowResult.toString());
        expressionDisplay.textContent = formatExpression(displayedExpr)
          .replace(/\*/g, "x")
          .replace(/\//g, "÷");
        current = rowResult.toString();
        lastWasEqual = true;
      } catch (err) {
        resultDisplay.textContent = "Error";
        expressionDisplay.textContent = displayedExpr;
      }
    } else if (value === "del") {
      current = current.slice(0, -1);
      displayedExpr = displayedExpr.slice(0, -1);
      resultDisplay.textContent = formatExpression(displayedExpr)
        .replace(/\*/g, "x")
        .replace(/\//g, "÷");
      lastWasEqual = false;
    } else if (value === "%") {
      if (lastWasEqual && /^[0-9.]+ $/.test(current)) {
        const percent = parseFloat(current) / 100;
        displayedExpr = current + "%";
        current = percent.toString();
        resultDisplay.textContent = formatExpression(current);
        expressionDisplay.textContent = displayedExpr;
        lastWasEqual = false;
      } else {
        const match = current.match(/([0-9.]+)$/);
        if (match) {
          const lastnum = match[1];
          current = current.replace(/([0-9.]+)$/, lastnum + "%");
          const tokens = displayedExpr.match(/([0-9.]+|[^0-9.]+)/g);
          if (tokens && tokens.length) {
            const last = tokens[tokens.length - 1];
            if (!last.includes("%")) {
              tokens[tokens.length - 1] = last + "%";
              displayedExpr = tokens.join("");
            }
          }
        }
        resultDisplay.textContent = formatExpression(current)
          .replace(/\*/g, "x")
          .replace(/\//g, "÷");
        lastWasEqual = false;
      }
    } else {
      if (lastWasEqual) {
        current = "";
        displayedExpr = "";
        lastWasEqual = false;
      }
      current += value;
      displayedExpr += value;
      resultDisplay.textContent = formatExpression(displayedExpr)
        .replace(/\*/g, "x")
        .replace(/\//g, "÷");
      expressionDisplay.textContent = "";
    }
  });
});

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}
