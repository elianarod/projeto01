// Eliana Rodrigues, P1 WD2, FBAUP, 03.11.2021

// IMPORTANTE: Esta página só funciona no Google Chrome em Android.
// Para que funcione é necessária a ativação da seguinte flag relativa ao ambient light sensor: "chrome://flags/#enable-generic-sensor-extra-classes".

console.log("estou a funcionar");

// PRIVACY

// INPUT BOX (baseado em: http://jsfiddle.net/6eTcD/2/)

let form = document.querySelector("form");
form.addEventListener("submit", textForm);

let elem = document.createElement("div");

function textForm(e) {
  //O preventDefault cancela o evento, ou seja, previne que o botão 'submit' submeta o formulário
  e.preventDefault();

  //Descobre quais são as dimensões da janela atual
  let fullWidth = window.innerWidth;
  let fullHeight = window.innerHeight;

  let word = this.querySelector("input[type='password']").value;

  elem.textContent = word;
  elem.style.display = "block";
  elem.style.position = "absolute";
  elem.style.left = fullWidth / 10 + "px";
  elem.style.top = fullHeight / 2.5 + "px";
  elem.style.fontFamily =
    "GridlitePEVFTRIAL-All, Courier New, Courier, monospace";
  elem.style.fontVariationSettings = `"BACK" ${(1, 200)}, "ESHP" ${(1, 4)}`;
  elem.style.fontSize = 80 + "px";
  elem.style.wordBreak = "break-all";
  elem.style.textTransform = "uppercase";
  elem.style.cursor = "default";

  document.body.appendChild(elem);

  // Aplica a palavra escrita ao h1 da seguinte página
  document.querySelector("#transparency-h1").innerHTML =
    word +
    "<br>" +
    word +
    "<br>" +
    word +
    "<br>" +
    word +
    "<br>" +
    word +
    "<br>" +
    word +
    "<br>" +
    word;

  // GIROSCÓPIO
  window.addEventListener("deviceorientation", handleOrientation);

  function handleOrientation(event) {
    // beta: front to back motion: valores dos -180 a 180
    let beta = event.beta;

    // Restringir os valores de 0 a 90
    if (beta > 90) {
      beta = 90;
    }
    if (beta < 0) {
      beta = 0;
    }

    // Se beta for menor ou igual a 0
    if (beta <= 0) {
      elem.style.fontWeight = 0;
      elem.style.fontVariationSettings = `"BACK" ${1}, "ESHP" ${4}`;
    }

    // Se beta for maior que 0, vai escondendo a palavra
    if (beta > 0) {
      elem.style.fontWeight = 200;
      elem.style.fontVariationSettings = `"BACK" ${beta * 2.2}, "ESHP" ${
        90 / beta
      }`; // max: BACK (90 * 2.2 = 198), ESHP (90 / 90 = 1)
      elem.style.transition = "all 0.3s";
    }
  }
}

// Botão clear
document.querySelector("#btn-clear").addEventListener("click", clear);
function clear() {
  elem.remove();
  form.reset();
}

//---------------------------------------------------------------------------------------------------

// BOTÕES MUDAR DE PÁGINA

// Verifica se o 1º botão "->" foi clicado
let btnp = document.querySelector("#btn-p");
btnp.addEventListener("click", mudaPagina2);

function mudaPagina2() {
  console.log("o botão foi clicado");
  // Apagar elementos da PRIVACY
  document.querySelector(".privacy").style.display = "none";
  elem.remove();
  form.reset();

  // Adicionar elementos da TRANSPARENCY
  document.querySelector(".transparency").style.display = "flex";
  // Muda o título do documento
  document.title = "Access your data";
}

// Verifica se o 2º botão "->" foi clicado
let btnt = document.querySelector("#btn-t");
btnt.addEventListener("click", mudaPagina);

function mudaPagina() {
  console.log("o botão 2 foi clicado");
  // Apagar elementos da TRANSPARENCY
  document.querySelector("#erro").style.display = "none";
  document.querySelector(".transparency").style.display = "none";

  // Adicionar elementos da PRIVACY
  document.querySelector(".privacy").style.display = "flex";
  // Muda o título do documento
  document.title = "Protect your data";
}

//---------------------------------------------------------------------------------------------------

// TRANSPARENCY
// Ambient Light Sensor (basedo em: https://variablefonts.dev/posts/light-sensor-demo/)
let text = document.querySelector("h1");

text.addEventListener("input", function () {
  this.setAttribute("data-text", this.innerText);
});

// Valor mínimo e máximo de weight da fonte selecionada
const minAxisValue = 900;
const maxAxisValue = 100;

// Valor mínimo e máximo selecionados para o nível de luminosidade
const minEventValue = 0;
const maxEventValue = 1000;

text.style.setProperty("--axis", 100);

// Verifica se o ambient light sensor está a funcionar
if ("AmbientLightSensor" in window) {
  const sensor = new AmbientLightSensor();
  sensor.onreading = () => {
    fluidAxisVariation(
      minAxisValue,
      maxAxisValue,
      minEventValue,
      maxEventValue,
      sensor.illuminance,
      "--axis",
      text
    );
    // console.log('Current light level:', sensor.illuminance);
  };

  // Caso não haja acesso ao ambient light sensor
  sensor.onerror = (event) => {
    console.log(event.error.name, event.error.message);
    // Display mensagem de erro se o ecrã tiver menos de 768px de width (mobile)
    window.addEventListener("resize", function () {
      if (window.matchMedia("(max-width: 768px)").matches) {
        document.querySelector("#erro").style.display = "block";
      }
    });
  };
  sensor.start();
}

// Fluid Axis Variation Event
function fluidAxisVariation(
  minimumAxisValue,
  maximumAxisValue,
  minimumEventValue,
  maximumEventValue,
  eventValue,
  axisCustomPropertyName,
  element
) {
  const minAxisValue = minimumAxisValue;
  const maxAxisValue = maximumAxisValue;
  const minEventValue = minimumEventValue;
  const maxEventValue = maximumEventValue;
  const currentEventValue = eventValue;

  const eventPercent =
    (currentEventValue - minEventValue) / (maxEventValue - minEventValue);
  const fontAxisScale =
    eventPercent * (minAxisValue - maxAxisValue) + maxAxisValue;

  const newAxisValue =
    currentEventValue > maxEventValue
      ? minAxisValue
      : currentEventValue < minEventValue
      ? maxAxisValue
      : fontAxisScale;

  element.style.setProperty(axisCustomPropertyName, newAxisValue);
}
