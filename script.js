const corners = ['top', 'bottom', 'left', 'right'];

function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("show");
}

function getRandomCorner() {
  return corners[Math.floor(Math.random() * corners.length)];
}

function generateRandomTriangles() {
  document.querySelectorAll('.triangles').forEach(section => {
    const numTriangles = Math.floor(section.offsetHeight / 200) + 2;

    for (let i = 0; i < numTriangles; i++) {
      const side = corners[Math.floor(Math.random() * corners.length)];
      const triangle = document.createElement('div');
      triangle.classList.add('cornerTriangle');

      const width = Math.floor(Math.random() * 50) + 60;
      const height = Math.floor(Math.random() * 50) + 60;
      triangle.style.width = `${width}px`;
      triangle.style.height = `${height}px`;

      triangle.style.opacity = (Math.random() * 0.2 + 0.3).toFixed(2);
      triangle.style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`;
      triangle.style.position = 'absolute';

      if (side === 'top') {
        triangle.style.top = '0';
        triangle.style.left = `${Math.random() * 100}%`;
        triangle.style.transform += ' translateX(-50%)';
      }
      else if (side === 'bottom') {
        triangle.style.bottom = '0';
        triangle.style.left = `${Math.random() * 100}%`;
        triangle.style.transform += ' translateX(-50%)';
      }
      else if (side === 'left') {
        triangle.style.left = '0';
        triangle.style.top = `${Math.random() * 100}%`;
        triangle.style.transform += ' translateY(-50%)';
      }
      else if (side === 'right') {
        triangle.style.right = '0';
        triangle.style.top = `${Math.random() * 100}%`;
        triangle.style.transform += ' translateY(-50%)';
      }
      section.appendChild(triangle);
    }
  });
}


window.addEventListener('DOMContentLoaded', generateRandomTriangles);
