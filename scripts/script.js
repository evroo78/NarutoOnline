fetch('menu.html')
    .then(response => response.text())
    .then(html => {
      document.querySelector('header').innerHTML = html;
    })
    .catch(err => console.error('Меню не завантажено:', err));

