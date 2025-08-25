const corners = ['top', 'bottom', 'left', 'right'];

// Toggles between the mobile and desktop headers
function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("show");
}

// Creates triangles for each section
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

// Configuration - Update these coordinates for your meeting location
const MEETING_LOCATION = {
    lat: 29.73333,
    lng: -95.81355,
    name: "Tompkins High School"
};

const RADIUS_METERS = 100; // meter radius

// Google Sheets Web App URL - Replace with your actual URL
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

let userLocation = null;
let locationVerified = false;

// Calculate distance between two coordinates in meters
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Update location status display
function updateLocationStatus(message, type) {
    const statusDiv = document.getElementById('locationStatus');
    const submitBtn = document.getElementById('submitBtn');
    
    statusDiv.className = `location-status location-${type}`;
    
    if (type === 'pending') {
        statusDiv.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${message}`;
        submitBtn.disabled = true;
        locationVerified = false;
    } else if (type === 'success') {
        statusDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        submitBtn.disabled = false;
        locationVerified = true;
    } else if (type === 'error') {
        statusDiv.innerHTML = `<i class="fas fa-times-circle"></i> ${message}`;
        submitBtn.disabled = true;
        locationVerified = false;
    }
}

// Get user's current location
function getUserLocation() {
    if (!navigator.geolocation) {
        updateLocationStatus('Geolocation is not supported by this browser', 'error');
        return;
    }
    
    updateLocationStatus('Getting your location...', 'pending');
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            const distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                MEETING_LOCATION.lat,
                MEETING_LOCATION.lng
            );
            
            if (distance <= RADIUS_METERS) {
                updateLocationStatus(`Location verified! You are ${Math.round(distance)}m from ${MEETING_LOCATION.name}.`, 'success');
            } else {
                updateLocationStatus(`You are too far from the meeting location (${Math.round(distance)}m away). Please come closer to ${MEETING_LOCATION.name}.`, 'error');
            }
        },
        function(error) {
            let errorMessage = 'Unable to get your location. ';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += 'Please enable location permissions and refresh the page.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage += 'Location request timed out.';
                    break;
                default:
                    errorMessage += 'An unknown error occurred.';
            }
            updateLocationStatus(errorMessage, 'error');
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }
    );
}

// Submit form data to Google Sheets
function submitToGoogleSheets(formData) {
    return fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData).toString()
    });
}

// Handle form submission
document.getElementById('signinForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!locationVerified) {
        showMessage('Please verify your location before signing in.', 'error');
        return;
    }
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    
    const formData = new FormData(this);
    
    // Add additional data
    formData.append('timestamp', new Date().toISOString());
    formData.append('userLat', userLocation.lat);
    formData.append('userLng', userLocation.lng);
    formData.append('meetingLat', MEETING_LOCATION.lat);
    formData.append('meetingLng', MEETING_LOCATION.lng);
    formData.append('distanceMeters', Math.round(calculateDistance(
        userLocation.lat, userLocation.lng,
        MEETING_LOCATION.lat, MEETING_LOCATION.lng
    )));
    
    // Convert FormData to object for submission
    const dataObject = {};
    for (let [key, value] of formData.entries()) {
        dataObject[key] = value;
    }
    
    submitToGoogleSheets(dataObject)
        .then(() => {
            showMessage('Successfully signed in! Thank you for attending.', 'success');
            this.reset();
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Signed In Successfully';
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In to Meeting';
                submitBtn.disabled = false;
            }, 3000);
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('There was an error submitting your sign-in. Please try again or contact an officer.', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In to Meeting';
        });
});

// Show message to user
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = '';
    }, 5000);
}

// Initialize location checking when page loads
window.addEventListener('DOMContentLoaded', function() {
    generateRandomTriangles();
    getUserLocation();
});

// Refresh location every 30 seconds
setInterval(getUserLocation, 30000);