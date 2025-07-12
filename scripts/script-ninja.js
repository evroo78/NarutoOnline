const sheetID = "1wFitGIdToNAtnOy_f4m-TkyxZpRq6Azc09yZYiUXTFg"; // Встав сюди свій ID Google Таблиці
const query = encodeURIComponent("SELECT A, B, C, D, E"); // Зміни на відповідні колонки
const sheetName = "Ninja Assist"; // Назва аркуша таблиці
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tq=${query}&sheet=${sheetName}`;

function formatHighlightTags(text) {
  // Спочатку обробимо з тегами [tag:текст]
  text = text.replace(/\[(\w+):(.*?)\]/g, (_, style, content) => {
    switch (style.toLowerCase()) {
      case "red":
      case "blue":
      case "green":
        return `<span class="${style.toLowerCase()}">${content}</span>`;
      case "bold":
      case "strong":
        return `<strong>${content}</strong>`;
      case "italic":
        return `<em>${content}</em>`;
      default:
        return content; // невідомий стиль
    }
  });

  // Потім — окремо обробимо [текст] без тегу як <strong>
  text = text.replace(/\[([^\[\]:]+?)\]/g, (_, content) => {
    return `<span class='highlight'>${content}</span>`;
  });

  return text;
}

fetch(url)
  .then((res) => res.text())
  .then((rep) => {
    const json = JSON.parse(rep.substring(47).slice(0, -2));

    const rows = json.table.rows;
    console.log(rows);
    const container = document.getElementById("ninja-container");
    container.innerHTML = "";

    rows.forEach((row) => {
      const name = row.c[1]?.v || "Unknown";
      const effect = formatHighlightTags(row.c[2]?.v || "No description");
      const videoURL = row.c[3]?.v || "";
      const isImg = parseInt(row.c[4]?.v) || 0;
      const card = document.createElement("div");
      card.className = "ninja-card";

      if (videoURL) {
        card.innerHTML = `
        <div class="ninja-info">
          <div class="ninja-img-wrapper">
            <img src="img/${name}.png" alt="${name}" class="ninja-img">
            <a href="${videoURL}" target="_blank" class="youtube-overlay youtube-url"> Watch video</a>
          </div>
          <h3 class="ninja-name">${name}</h3>
          <p class="ninja-desc">${effect}</p>
        </div>
      `;
      } else {
        card.innerHTML = `
        <div class="ninja-info">
          <div class="ninja-img-wrapper">
            <img src="img/${name}.png" alt="${name}" class="ninja-img">
          </div>
          <h3 class="ninja-name">${name}</h3>
          <p class="ninja-desc">${effect}</p>
        </div>
        `;
      }
      // if (isImg) {
      //   const img = new Image();
      //   img.src = `img/${name}.png`;
      //   img.alt = name;
      //   img.className = "ninja-img";
      //   card.insertBefore(img, card.firstChild);
      // }
      container.appendChild(card);
    });
  })
  .catch((err) => {
    document.getElementById("ninja-container").textContent =
      "Failed to load data 😢";
    console.error(err);
  });
