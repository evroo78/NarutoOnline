const sheetID = "1wFitGIdToNAtnOy_f4m-TkyxZpRq6Azc09yZYiUXTFg";
const sheetName = "Refine Fragments";
const query = encodeURIComponent("SELECT A, B, C");
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tq=${query}&sheet=${sheetName}`;

const tableBody = document.querySelector("#myTable tbody");
const searchInput = document.getElementById("search");
const pageSizeSelect = document.getElementById("page-size");
const paginationDiv = document.getElementById("pagination");

let data = []; // всі рядки
let filteredData = [];
let currentPage = 0;
let pageSize = +pageSizeSelect.value;;



// Завантаження даних з Google Таблиці
fetch(url)
  .then((res) => res.text())
  .then((rep) => {
    console.log("Rep", rep); // глянути сирий текст
    const json = JSON.parse(rep.substring(47).slice(0, -2));
    console.log("json", json);
    if (!json.table.rows || json.table.rows.length === 0) {
      console.warn("Data no found!");
      tableBody.innerHTML = "<tr><td colspan='3'>None</td></tr>";
      return;
    }
    data = json.table.rows.map((r) => [
      r.c[0]?.v || "",
      r.c[1]?.v || "",
      r.c[2]?.v || "",
    ]);
    filteredData = data;
    renderTable();
    renderPagination();
  })
  .catch((e) => {
    tableBody.innerHTML =
      "<tr><td colspan='3'>Не вдалося завантажити дані</td></tr>";
    console.error(e);
  });

// Рендер таблиці по сторінках і фільтрах
function renderTable() {
  const start = currentPage * pageSize;
  const end = pageSize === -1 ? filteredData.length : start + pageSize;
  const rows = filteredData.slice(start, end);

  tableBody.innerHTML = "";
  if (!rows.length) {
    tableBody.innerHTML = "<tr><td colspan='3'>None</td></tr>";
    return;
  }

  rows.forEach((r,i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td>${i + 1}</td>
      <td>${r[0]}</td>
      <td>${r[1]}</td>
      <!--<td>${r[2]}</td>-->
    `;
    tableBody.appendChild(tr);
  });
}

// Фільтрація
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  filteredData = data.filter((r) =>
    r.some((c) => c.toString().toLowerCase().includes(term))
  );
  currentPage = 0;
  renderTable();
  renderPagination();
});

// Пагінація
pageSizeSelect.addEventListener("change", () => {
  pageSize = +pageSizeSelect.value;
  currentPage = 0;
  renderTable();
  renderPagination();
});

function renderPagination() {
  if (pageSize === -1 || filteredData.length <= pageSize) {
    paginationDiv.innerHTML = "";
    return;
  }
  const pageCount = Math.ceil(filteredData.length / pageSize);
  paginationDiv.innerHTML = "";

  for (let i = 0; i < pageCount; i++) {
    const btn = document.createElement("button");
    btn.textContent = i + 1;
    btn.disabled = i === currentPage;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderTable();
      renderPagination();
    });
    paginationDiv.appendChild(btn);
  }
}

// Сортування
document.querySelectorAll("#myTable thead th").forEach((th) => {
  th.style.cursor = "pointer";
  th.addEventListener("click", () => {
    const col = +th.dataset.col;
    const asc = !th.classList.contains("asc");
    document
      .querySelectorAll("#myTable thead th")
      .forEach((t) => t.classList.remove("asc", "desc"));
    th.classList.add(asc ? "asc" : "desc");
    filteredData.sort((a, b) => {
      if (a[col] < b[col]) return asc ? -1 : 1;
      if (a[col] > b[col]) return asc ? 1 : -1;
      return 0;
    });
    currentPage = 0;
    renderTable();
    renderPagination();
  });
});
