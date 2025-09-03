fetch('menu.html')
    .then(response => response.text())
    .then(html => {
      document.querySelector('header').innerHTML = html;
    })
    .catch(err => console.error('Menu not loaded...', err));


fetch('footer.html')
    .then(response => response.text())
    .then(html => {
      document.querySelector('footer').innerHTML = html;
    })
    .catch(err => console.error('Footer not loaded:', err));


