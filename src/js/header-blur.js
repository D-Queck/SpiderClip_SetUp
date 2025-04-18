window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
      navbar.classList.add('blurred');
    } else {
      navbar.classList.remove('blurred');
    }
  });
  