const btnnValue = document.querySelectorAll(".btn");
const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");

let current = "";
let displayedExpr = "";
let lastWasEqual = false;

function formatExpression(expr) {
  const tokens = expr.match(/([0-9.]+|[^0-9.]+)/g);
  if (!tokens) return expr;
  return tokens
    .map((token) =>
      /^[0-9.]+$/.test(token)
        ? parseFloat(token).toLocaleString("vi-VN")
        : token
    )
    .join("");
}

btnnValue.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.getAttribute("data-filter");

    if (value === "C") {
      current = "";
      displayedExpr = "";
      lastWasEqual = false;
      resultDisplay.textContent = "0";
      expressionDisplay.textContent = "";
    } else if (value === "=") {
      try {
        if (!current) return;
        let computedExpr = current.replace(/([0-9.]+)%/g, "($1/100)");
        const rawResult = eval(computedExpr);
        resultDisplay.textContent = formatExpression(rawResult.toString());
        expressionDisplay.textContent = formatExpression(displayedExpr)
          .replace(/\*/g, "×")
          .replace(/\//g, "÷");
        current = rawResult.toString();
        lastWasEqual = true;
      } catch (err) {
        resultDisplay.textContent = "Error";
        expressionDisplay.textContent = displayedExpr;
      }
    } else if (value === "%") {
      if (lastWasEqual && /^[0-9.]+$/.test(current)) {
        const percent = parseFloat(current) / 100;
        displayedExpr = current + "%";
        current = percent.toString();
        resultDisplay.textContent = formatExpression(current);
        expressionDisplay.textContent = displayedExpr;
        lastWasEqual = false;
      } else {
        const match = current.match(/([0-9.]+)$/);
        if (match) {
          const lastNum = match[1];
          current = current.replace(/([0-9.]+)$/, lastNum + "%");

          const tokens = displayedExpr.match(/[^+\-*/()]+|[+\-*/()]/g);
          if (tokens && tokens.length) {
            const last = tokens[tokens.length - 1];
            if (!last.includes("%")) {
              tokens[tokens.length - 1] = last + "%";
              displayedExpr = tokens.join("");
            }
          }
        }
        resultDisplay.textContent = formatExpression(current)
          .replace(/\*/g, "×")
          .replace(/\//g, "÷");
        lastWasEqual = false;
      }
    } else if (value === "del") {
      current = current.slice(0, -1);
      displayedExpr = displayedExpr.slice(0, -1);
      resultDisplay.textContent = formatExpression(displayedExpr)
        .replace(/\*/g, "×")
        .replace(/\//g, "÷");
      expressionDisplay.textContent = "";
    } else {
      if (lastWasEqual) {
        current = "";
        displayedExpr = "";
        lastWasEqual = false;
      }
      current += value;
      displayedExpr += value;
      resultDisplay.textContent = formatExpression(displayedExpr)
        .replace(/\*/g, "×")
        .replace(/\//g, "÷");
      expressionDisplay.textContent = "";
    }
  });
});

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}
