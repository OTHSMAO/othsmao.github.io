const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top', 'bottom', 'left', 'right', 'top', 'bottom', 'left', 'right'];

function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("show");
}

function getRandomCorner() {
  return corners[Math.floor(Math.random() * corners.length)];
}

function generateRandomTriangles() {
  document.querySelectorAll('.triangles').forEach(section => {
    const numTriangles = Math.floor(Math.random() * 3) + 3;

    for (let i = 0; i < numTriangles; i++) {
      const corner = getRandomCorner();
      const triangle = document.createElement('div');
      triangle.classList.add('cornerTriangle');

      triangle.style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`;

      triangle.style.opacity = (Math.random() * 0.4 + 0.3).toFixed(2);
      const size = Math.floor(Math.random() * 40) + 60;
      triangle.style.width = `${size}px`;
      triangle.style.height = `${size}px`;

      if (corner.includes('top')) triangle.style.top = 0;
      if (corner.includes('bottom')) triangle.style.bottom = 0;
      if (corner.includes('left')) triangle.style.left = 0;
      if (corner.includes('right')) triangle.style.right = 0;
      
      section.appendChild(triangle);
    }
  });
}

window.addEventListener('DOMContentLoaded', generateRandomTriangles);
