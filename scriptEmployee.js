const jobOpportunities = [
    { id: 'job1', title: 'Package Handler - Downtown Hub', description: 'Handle and sort packages', date: '2024-06-15', time: '8:00 AM - 4:00 PM', location: '123 Main St, Springfield', claimed: false },
    { id: 'job2', title: 'Driver Assistant - North Station', description: 'Assist drivers with deliveries', date: '2024-06-20', time: '9:00 AM - 5:00 PM', location: '456 Oak Rd, Northville', claimed: false },
    { id: 'job3', title: 'Sorter - East Facility', description: 'Sort packages for efficient delivery', date: '2024-06-18', time: '2:00 PM - 10:00 PM', location: '789 Industrial Pkwy, Easttown', claimed: true }
];

// Function to populate job lists
function populateJobs(filteredJobs = jobOpportunities) {
    const jobList = document.getElementById('job-list');
    const claimedJobsList = document.getElementById('claimed-jobs-list');
    
    jobList.innerHTML = '';
    claimedJobsList.innerHTML = '';

    filteredJobs.forEach(job => {
        const jobElement = createJobElement(job);
        if (job.claimed) {
            claimedJobsList.appendChild(jobElement);
        } else {
            jobList.appendChild(jobElement);
        }
    });
}

// Function to create a job element
function createJobElement(job) {
    const jobElement = document.createElement('div');
    jobElement.className = 'job-item';
    jobElement.innerHTML = `
        <h3>${job.title}</h3>
        <p>${job.date} | ${job.time}</p>
        <p>${job.location}</p>
        <button onclick="toggleJobClaim('${job.id}')">${job.claimed ? 'Release' : 'Claim'}</button>
    `;
    return jobElement;
}

// Function to toggle job claim status
function toggleJobClaim(jobId) {
    const job = jobOpportunities.find(j => j.id === jobId);
    if (job) {
        job.claimed = !job.claimed;
        populateJobs();
    }
}

// Function to toggle notifications dropdown
function toggleNotifications() {
    const notificationDropdown = document.getElementById('notification-dropdown');
    const countElement = document.querySelector('.alert-icon .count');
    
    if (notificationDropdown.style.display === 'block') {
        notificationDropdown.style.display = 'none';
    } else {
        notificationDropdown.style.display = 'block';
        // Reset the counter to 0
        countElement.textContent = '0';
        // Hide the count element when it's 0
        countElement.style.display = 'none';
    }
}

// Function to toggle user dropdown
function toggleDropdown() {
    const dropdownMenu = document.getElementById('dropdown-menu');
    dropdownMenu.style.display = 
        dropdownMenu.style.display === 'block' ? 'none' : 'block';
}

// Function to handle logout
function logout() {
    // Redirect to login page
    window.location.href = 'index.html';
}

// Function to open Google Maps
function openGoogleMaps() {
    window.open('https://www.google.com/maps', '_blank');
}

// Function to show alert details
function showAlertDetails(alertType) {
    const popup = document.getElementById('alert-details-popup');
    const title = document.getElementById('alert-details-title');
    const content = document.getElementById('alert-details-content');
    
    let alertDetails = '';
    switch(alertType) {
        case 'shift-change':
            alertDetails = 'Your shift for Sorter - East Facility on June 18, 2024 has been updated. Please check the new timing.';
            break;
        case 'work-reminder':
            alertDetails = 'Remember, your shift as Sorter starts in 2 hours. Please arrive on time.';
            break;
        default:
            alertDetails = 'No details available for this alert.';
    }
    
    title.textContent = alertType === 'shift-change' ? 'Shift Change Alert' : 'Work Reminder';
    content.textContent = alertDetails;
    popup.style.display = 'block';
}

// Function to close alert details popup
function closeAlertDetails() {
    document.getElementById('alert-details-popup').style.display = 'none';
}

// Function to apply filters
function applyFilters() {
    const jobType = document.getElementById('job-type').value;
    const location = document.getElementById('location').value.toLowerCase();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value.toLowerCase();

    const filteredJobs = jobOpportunities.filter(job => {
        const matchType = 
            jobType === 'both' || 
            (jobType === 'available' && !job.claimed) || 
            (jobType === 'claimed' && job.claimed);
        
        const matchLocation = !location || 
            (location === 'downtown' && job.title.toLowerCase().includes('downtown')) ||
            (location === 'north-station' && job.title.toLowerCase().includes('north station')) ||
            (location === 'east-facility' && job.title.toLowerCase().includes('east facility'));
        
        const matchDate = !date || job.date === date;
        const matchTime = !time || (
            (time === "morning" && job.time.toLowerCase().includes("am")) ||
            (time === "afternoon" && job.time.toLowerCase().includes("pm") && parseInt(job.time.split(":")[0]) < 6) ||
            (time === "evening" && job.time.toLowerCase().includes("pm") && parseInt(job.time.split(":")[0]) >= 6)
        );

        return matchType && matchLocation && matchDate && matchTime;
    });

    populateJobs(filteredJobs);
}

// Function to search jobs
function searchJobs(searchTerm = "") {
    const filteredJobs = jobOpportunities.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    populateJobs(filteredJobs);
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const countElement = document.querySelector('.alert-icon .count');
    countElement.textContent = '2';
    countElement.style.display = 'block';
    
    populateJobs();
});
