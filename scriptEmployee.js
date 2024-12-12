// Sample data for job opportunities
const jobOpportunities = [
    { id: 'job1', title: 'Package Handler - Downtown Hub', description: 'Handle and sort packages', date: '2024-06-15', time: '8:00 AM - 4:00 PM', location: '123 Main St, Springfield', claimed: false },
    { id: 'job2', title: 'Driver Assistant - North Station', description: 'Assist drivers with deliveries', date: '2024-06-20', time: '9:00 AM - 5:00 PM', location: '456 Oak Rd, Northville', claimed: false },
    { id: 'job3', title: 'Sorter - East Facility', description: 'Sort packages for efficient delivery', date: '2024-06-18', time: '2:00 PM - 10:00 PM', location: '789 Industrial Pkwy, Easttown', claimed: true }
];

// Function to populate job lists
function populateJobs(filteredJobs = null) {
    const jobList = document.getElementById('job-list');
    const claimedJobsList = document.getElementById('claimed-jobs-list');
    const claimedOpportunitiesSection = document.getElementById('claimed-opportunities-section');
    
    jobList.innerHTML = '';
    claimedJobsList.innerHTML = '';

    const jobsToDisplay = filteredJobs || jobOpportunities;

    jobsToDisplay.forEach(job => {
        const jobElement = createJobElement(job);
        if (job.claimed) {
            claimedJobsList.appendChild(jobElement);
        } else {
            jobList.appendChild(jobElement);
        }
    });

    // Hide "My Claimed Opportunities" if empty
    if (claimedJobsList.children.length === 0) {
        claimedOpportunitiesSection.style.display = 'none';
    } else {
        claimedOpportunitiesSection.style.display = 'block';
    }
}

// Function to create a job element
function createJobElement(job) {
    const jobElement = document.createElement('div');
    jobElement.className = 'job-item';
    jobElement.innerHTML = `
        <h3>${job.title}</h3>
        <p>${formatDate(job.date)} | ${job.time}</p>
        <p>${job.location}</p>
        <button onclick="toggleJobClaim('${job.id}')">${job.claimed ? 'Release' : 'Claim'}</button>
    `;
    return jobElement;
}

// Helper function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString(undefined, options);
}

// Function to toggle job claim status
function toggleJobClaim(jobId) {
    const job = jobOpportunities.find(j => j.id === jobId);
    if (job) {
        job.claimed = !job.claimed;
        populateJobs();
    }
}

// Function to toggle notifications
function toggleNotifications() {
    const notificationDropdown = document.getElementById('notification-dropdown');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const filtersModal = document.getElementById('filters-modal');
    const filtersDesktopModal = document.getElementById('filters-desktop-modal');

    // Close other menus
    closeAllMenusExcept('notifications');

    // Toggle notifications dropdown
    notificationDropdown.classList.toggle('show');
}

// Function to toggle user dropdown
function toggleDropdown() {
    const dropdownMenu = document.getElementById('dropdown-menu');
    const notificationDropdown = document.getElementById('notification-dropdown');
    const filtersModal = document.getElementById('filters-modal');
    const filtersDesktopModal = document.getElementById('filters-desktop-modal');

    // Close other menus
    closeAllMenusExcept('user');

    // Toggle user dropdown
    dropdownMenu.classList.toggle('show');
}

// Function to toggle filters modal
function toggleFilters() {
    const filtersModal = document.getElementById('filters-modal');
    const filtersDesktopModal = document.getElementById('filters-desktop-modal');
    const notificationDropdown = document.getElementById('notification-dropdown');
    const dropdownMenu = document.getElementById('dropdown-menu');

    // Close other menus
    closeAllMenusExcept('filters');

    // Check screen width to determine which modal to toggle
    if (window.innerWidth <= 768) {
        filtersModal.classList.toggle('show');
    } else {
        filtersDesktopModal.classList.toggle('show');
    }
}

// Function to close all menus except the one specified
function closeAllMenusExcept(openMenu) {
    const notificationDropdown = document.getElementById('notification-dropdown');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const filtersModal = document.getElementById('filters-modal');
    const filtersDesktopModal = document.getElementById('filters-desktop-modal');

    if (openMenu !== 'notifications') {
        notificationDropdown.classList.remove('show');
    }
    if (openMenu !== 'user') {
        dropdownMenu.classList.remove('show');
    }
    if (openMenu !== 'filters') {
        filtersModal.classList.remove('show');
        filtersDesktopModal.classList.remove('show');
    }
}

// Function to handle logout
function logout() {
    alert('Logging out...');
    // Implement actual logout logic here
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
    popup.classList.add('show');
}

// Function to close alert details popup
function closeAlertDetails() {
    const popup = document.getElementById('alert-details-popup');
    popup.classList.remove('show');
}

// Function to apply filters
function applyFilters() {
    // Get filter values from all possible sources
    const jobType = document.getElementById('job-type').value || document.getElementById('job-type-modal')?.value || document.getElementById('job-type-desktop')?.value;
    const location = document.getElementById('location').value || document.getElementById('location-modal')?.value || document.getElementById('location-desktop')?.value;
    const date = document.getElementById('date').value || document.getElementById('date-modal')?.value || document.getElementById('date-desktop')?.value;
    const time = document.getElementById('time').value || document.getElementById('time-modal')?.value || document.getElementById('time-desktop')?.value;

    // Filter logic
    let filteredJobs = jobOpportunities.filter(job => {
        let matches = true;
        if (jobType !== 'both') {
            matches = matches && (job.claimed ? jobType === 'claimed' : jobType === 'available');
        }
        if (location) {
            matches = matches && job.location.toLowerCase().includes(location.toLowerCase());
        }
        if (date) {
            matches = matches && (new Date(job.date).toISOString().split('T')[0] === date);
        }
        if (time) {
            matches = matches && (job.time.toLowerCase().includes(time.toLowerCase()));
        }
        return matches;
    });

    // Update job lists
    populateJobs(filteredJobs);

    // Close filters modal if open
    closeFilters();
}

// Function to search jobs
function searchJobs() {
    const searchInput = document.getElementById('search-jobs-input').value.toLowerCase();
    const filteredJobs = jobOpportunities.filter(job => job.title.toLowerCase().includes(searchInput));
    populateJobs(filteredJobs);
}

// Function to close all menus
function closeAllMenus() {
    const notificationDropdown = document.getElementById('notification-dropdown');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const filtersModal = document.getElementById('filters-modal');
    const filtersDesktopModal = document.getElementById('filters-desktop-modal');
    const popup = document.getElementById('alert-details-popup');

    notificationDropdown.classList.remove('show');
    dropdownMenu.classList.remove('show');
    filtersModal.classList.remove('show');
    filtersDesktopModal.classList.remove('show');
    popup.classList.remove('show');
}

// Function to close filters modal
function closeFilters() {
    const filtersModal = document.getElementById('filters-modal');
    const filtersDesktopModal = document.getElementById('filters-desktop-modal');
    filtersModal.classList.remove('show');
    filtersDesktopModal.classList.remove('show');
}

// Close popups/modals when clicking outside of them
window.onclick = function(event) {
    const notificationDropdown = document.getElementById('notification-dropdown');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const filtersModal = document.getElementById('filters-modal');
    const filtersDesktopModal = document.getElementById('filters-desktop-modal');
    const alertDetailsPopup = document.getElementById('alert-details-popup');

    // If the target is the notification dropdown background
    if (notificationDropdown.classList.contains('show') && event.target === notificationDropdown) {
        notificationDropdown.classList.remove('show');
    }

    // If the target is the dropdown menu background
    if (dropdownMenu.classList.contains('show') && event.target === dropdownMenu) {
        dropdownMenu.classList.remove('show');
    }

    // If the target is the filters modal background
    if (filtersModal.classList.contains('show') && event.target === filtersModal) {
        filtersModal.classList.remove('show');
    }

    // If the target is the desktop filters modal background
    if (filtersDesktopModal.classList.contains('show') && event.target === filtersDesktopModal) {
        filtersDesktopModal.classList.remove('show');
    }

    // If the target is the alert details popup background
    if (alertDetailsPopup.classList.contains('show') && event.target === alertDetailsPopup) {
        alertDetailsPopup.classList.remove('show');
    }
};

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', function() {
    populateJobs();
});
