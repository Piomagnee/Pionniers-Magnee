
"use strict";

const BENEFICIARY = "Desmaré Guillaume";
const IBAN = "BE60082938809470";
const BIC = "GKCCBEBB";
const COMMUNICATION = "Backyard PI Magnee";

const input = document.getElementById("amount");
const display = document.getElementById("display");
const canvas = document.getElementById("qr");
const error = document.getElementById("error");

function paymentPayload(amount) {
  return [
    "BCD",
    "002",
    "1",
    "SCT",
    BIC,
    BENEFICIARY,
    IBAN,
    "EUR" + amount.toFixed(2),
    "",
    "",
    COMMUNICATION
  ].join("\n");
}

function drawQR(payload) {
  const qr = new OfflineQRCode(0, OfflineQRErrorLevel.M);

  qr.addData(payload);
  qr.make();

  const n = qr.getModuleCount();
  const quiet = 4;
  const unit = 8;
  const total = (n + quiet * 2) * unit;

  canvas.width = total;
  canvas.height = total;

  const ctx = canvas.getContext("2d", { alpha: false });

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, total, total);
  ctx.fillStyle = "#000000";

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.isDark(r, c)) {
        ctx.fillRect(
          (c + quiet) * unit,
          (r + quiet) * unit,
          unit,
          unit
        );
      }
    }
  }
}

function createPayment(amount) {
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1000) {
    error.textContent = "Entre un montant compris entre 0,01 € et 1 000 €.";
    return;
  }

  error.textContent = "";

  try {
    drawQR(paymentPayload(amount));

    display.textContent = amount.toLocaleString("fr-BE", {
      style: "currency",
      currency: "EUR"
    });
  } catch (e) {
    error.textContent = "Impossible de générer le QR code.";
    console.error(e);
  }
}

input.addEventListener("input", () => {
  const value = input.value.trim().replace(",", ".");

  if (!/^\d+(?:\.\d{0,2})?$/.test(value)) {
    error.textContent = "Montant invalide (2 décimales maximum).";
    return;
  }

  createPayment(Number(value));
});

document.querySelectorAll("[data-value]").forEach(button => {
  button.addEventListener("click", () => {
    input.value = button.dataset.value;
    createPayment(Number(button.dataset.value));
  });
});

document.getElementById("reset").addEventListener("click", () => {
  input.value = "";
  createPayment(10);
  input.focus();
});

createPayment(10);
