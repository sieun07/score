document.addEventListener('DOMContentLoaded', () => {
    const rows = document.querySelectorAll('.log_page tr');
  
    rows.forEach(row => {
      row.style.cursor = 'pointer';
      row.addEventListener('click', () => {
        const href = row.getAttribute('data-href');
        if (href) {
          window.location.href = href;
        }
      });
    });
  });
  