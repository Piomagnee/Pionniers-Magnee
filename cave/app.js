"use strict";
const BENEFICIARY = "Desmaré Guillaume"; // EPC QR: ASCII-compatible beneficiary name
const IBAN = "BE60082938809470";
const BIC = "GKCCBEBB";
const COMMUNICATION = "Cave a biere PI Magnee";
const input = document.getElementById("amount");
const display = document.getElementById("display");
const canvas = document.getElementById("qr");
const error = document.getElementById("error");
function paymentPayload(amount){return ["BCD","002","1","SCT",BIC,BENEFICIARY,IBAN,"EUR"+amount.toFixed(2),"","",COMMUNICATION].join("\n");}
function drawQR(payload){
  const qr = new OfflineQRCode(0, OfflineQRErrorLevel.M);
  qr.addData(payload); qr.make();
  const n=qr.getModuleCount(), quiet=4, unit=8, total=(n+quiet*2)*unit;
  canvas.width=total;canvas.height=total;
  const ctx=canvas.getContext("2d",{alpha:false});ctx.fillStyle="#fff";ctx.fillRect(0,0,total,total);ctx.fillStyle="#000";
  for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(qr.isDark(r,c))ctx.fillRect((c+quiet)*unit,(r+quiet)*unit,unit,unit);
}
function createPayment(amount){
  if(!Number.isFinite(amount)||amount<=0||amount>1000){error.textContent="Entre un montant supérieur à 0 € et inférieur ou égal à 1 000 €.";return;}
  error.textContent="";
  try {drawQR(paymentPayload(amount));display.textContent=amount.toLocaleString("fr-BE",{style:"currency",currency:"EUR"});}
  catch(e){error.textContent="Impossible de générer le QR code.";console.error(e);}
}
input.addEventListener("input",()=>{const value=input.value.trim().replace(",",".");if(!/^\d+(?:\.\d{0,2})?$/.test(value)){error.textContent="Montant invalide (2 décimales maximum).";return;}createPayment(Number(value));});
document.querySelectorAll("[data-value]").forEach(b=>b.addEventListener("click",()=>{input.value=b.dataset.value;createPayment(Number(b.dataset.value));}));
document.getElementById("reset").addEventListener("click",()=>{input.value="";createPayment(17);input.focus();});
createPayment(17);
