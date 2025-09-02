const sheetID = "1wFitGIdToNAtnOy_f4m-TkyxZpRq6Azc09yZYiUXTFg"; // Встав сюди свій ID Google Таблиці
const query = encodeURIComponent(
  // "SELECT A, B, C, D, E, F, G, H, I, J, K, L, M, N, O"
  "SELECT *"
); // Зміни на відповідні колонки
const sheetName = "2090188722"; // Назва аркуша таблиці
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?gid=${sheetName}&tq=${query}`;

const cardList = document.getElementById("card-list");
const detailView = document.getElementById("detail-view");
let cards = {};
let lab = {};

let list = document.getElementById("card-list");
let detail = document.getElementById("detail-view");

let labels = [
  "Pages",
  "Elixir",
  "Life",
  "Attack",
  "Defense",
  "Ninjutsu",
  "Resistance",
  "Critical",
  "Injury",
  "COMBO",
  "Control",
  "Inintiative",
];

fetch(url)
  .then(res => {
    console.log('Fetch response status:', res.status);
    return res.text();
  })
  .then((rep) => {
    console.log('Response text length:', rep.length);
    try {
    const json = JSON.parse(rep.substring(47).slice(0, -2));
    const rows = json.table.rows;

    let last_label = ""; // параметр який змінюється
    let irow = 0;
    let name = "";
    rows.forEach(function (row) {
      const c = row.c;
      if (c) {
        if (c[14] && isNaN(parseInt(c[14].v))) {
          last_label = c[14].v;
        }

        if (c[0]) {
          if (!cards[c[0].v]) {
            irow = 0;
            name = c[0]?.v || "";
            if (name=="Inner Focus") last_label = json.table.cols.map(col => col.label)[14];
            cards[name] = [];
            
          } else {
            irow++;
          }

          cards[name][irow] = {};
          lab[name] = [...labels, "Aditional " + last_label]
          lab[name].forEach(function (leb, i) {
            cards[name][irow][leb] = c[i + 2]?.v || "-";
          });
          cards[name][irow]["Aditional " + last_label] = +c[14]?.v || 0;
        }
      }
    });
    } catch(e) {
      console.error('Error parsing JSON:', e);
    }
    renderCardList();
    console.log("Cards Ready!");})
  .catch(err => {
    console.error('Fetch error:', err);
  });


  
// --- ТУТ створюємо ліві кнопки для карток ---
function renderCardList() {
  cardList.innerHTML = "";
  Object.keys(cards).forEach((cardName, index) => {
    const cardItem = document.createElement("div");
    cardItem.className = "card-item";
    cardItem.innerHTML = `
        <img src="img/secret-scroll/${cardName}.png" alt="${cardName}" class="thumb">
        <p>${cardName}</p>
      `;
    cardItem.addEventListener("click", () => showCardDetails(cardName));
    cardList.appendChild(cardItem);
    if (index === 0) {
      showCardDetails(cardName);
    }
  });
}

function showCardDetails(cardName) {
  const details = cards[cardName];
  if (!details) {
    detailView.innerHTML = "<p>No data</p>";
    return;
  }

  // Приклад: виведемо таблицю з деталями
              console.log(lab);
  let html = `<h2>${cardName}</h2><table class="Secret-Table"><thead><tr>`;
  // Заголовки
  html += `<th>Level</th>`;
  lab[cardName].forEach((label) => {
    html += `<th>${label}</th>`;
  });
  html += "</tr></thead><tbody>";
  
  details.forEach((row, index) => {
    if (index<18){
    html += `<tr>`;
    html += `<td>${index + 1}</ td>`;
    } else if (index==18) {
      html += `<tr class="bold-row">`;
      html += `<td>Total</ td>`;
    }
    if (index<19) {
      lab[cardName].forEach((label) => {
      html += `<td>${row[label] || ""}</td>`;
    });
    html += `</tr>`;
    } 
    
  });
  html += `</tbody></table>`;
  if (details.length>19){
  html += `<p class="bold-row">Predicted Power: ${details[19][labels[0]]}</p>`}
  detailView.innerHTML = html;
};