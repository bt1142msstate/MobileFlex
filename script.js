
// Sample data for job opportunities
const jobOpportunities = [
    { 
        id: 'job2', 
        title: 'Package Sorter - Downtown Hub',
        date: 'June 15, 2024',
        time: '8:00 AM - 4:00 PM',
        totalPositions: 10,
        filledPositions: 0
    },
    { 
        id: 'job1', 
        title: 'Sorter - North Station',
        date: 'June 18, 2024',
        time: '2:00 PM - 10:00 PM',
        totalPositions: 15,
        filledPositions: 0
    },
    { 
        id: 'job3', 
        title: 'Driver Assistant - North Station',
        date: 'June 20, 2024',
        time: '9:00 AM - 5:00 PM',
        totalPositions: 5,
        filledPositions: 0
    },
    { 
        id: 'job6', 
        title: 'Package Sorter - West Hub',
        date: 'June 21, 2024',
        time: '7:00 AM - 3:00 PM',
        totalPositions: 8,
        filledPositions: 0
    },
    { 
        id: 'job7', 
        title: 'Warehouse Handler - South Facility',
        date: 'June 22, 2024',
        time: '1:00 PM - 9:00 PM',
        totalPositions: 12,
        filledPositions: 0
    },
    { 
        id: 'job8', 
        title: 'Loading Dock Worker - Central Hub',
        date: 'June 23, 2024',
        time: '6:00 AM - 2:00 PM',
        totalPositions: 6,
        filledPositions: 0
    }
];
let savedJobs = [];
let currentView = null;
let selectedFilterOption = null;
let isEditing = false;
let editedJobs = [];
const ITEMS_PER_PAGE = 6;
let currentPage = 1;
// Sample data for claimed jobs
const claimedJobs = [
    { 
        id: 'job5', 
        title: 'Package Handler - Downtown Hub',
        date: 'June 15, 2024',
        time: '8:00 AM - 4:00 PM',
        totalPositions: 12,
        filledPositions: 8
    },
    { 
        id: 'job4', 
        title: 'Sorter - East Facility',
        date: 'June 18, 2024',
        time: '2:00 PM - 10:00 PM',
        totalPositions: 20,
        filledPositions: 15
    }
];
function sortJobsChronologically(jobs) {
    return jobs.sort((a, b) => {
        const dateA = new Date(parseDate(a.date));
        const dateB = new Date(parseDate(b.date));
        
        if (dateA.getTime() === dateB.getTime()) {
            // If dates are the same, sort by start time
            const [timeA] = a.time.split(' - ');
            const [timeB] = b.time.split(' - ');
            const timeADate = new Date(`2000/01/01 ${timeA}`);
            const timeBDate = new Date(`2000/01/01 ${timeB}`);
            return timeADate - timeBDate;
        }
        
        return dateA - dateB;
    });
}
// Function to populate job lists
function populateJobs() {
    updateJobDisplay([...jobOpportunities, ...claimedJobs]);
}
function createJobCard(job) {
    const isClaimed = job.filledPositions > 0;
    const isUnpublished = job.published === false;
    const card = document.createElement('div');
    card.className = 'job-card';
    card.setAttribute('data-job-id', job.id);
    
    if (job.filledPositions === job.totalPositions) {
        card.classList.add('status-filled');
    } else if (job.filledPositions > 0) {
        card.classList.add('status-partial');
    } else {
        card.classList.add('status-empty');
    }
    
    if (isUnpublished) {
        card.classList.add('unpublished-job');
    }
    
    // Add contenteditable attributes based on isEditing state
    const editableAttr = isEditing ? 'contenteditable="true"' : '';
    const editableClass = isEditing ? 'editable' : '';
    
    card.innerHTML = `
        <div class="status-indicator"></div>
        <h3 class="${editableClass}" ${editableAttr}>${job.title}</h3>
        <div class="job-details">
            <div class="${editableClass}" ${editableAttr}>${job.date}</div>
            <div class="${editableClass}" ${editableAttr}>${job.time}</div>
            <div class="positions-info">Positions: ${job.filledPositions}/${job.totalPositions}</div>
        </div>
        <div class="job-actions">
            ${isClaimed ? 
                `<button class="report-btn" onclick="showReport('${job.id}')">View Report</button>` 
                : ''}
            ${isUnpublished ? 
                `<button class="publish-btn" onclick="publishSavedJob('${job.id}')">Publish</button>`
                : ''}
        </div>
    `;
    
    return card;
}
function createPagination(totalPages) {
    const pagination = document.createElement('div');
    pagination.className = 'pagination';
    
    // Previous button
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = '←';
        prevButton.onclick = () => {
            currentPage--;
            updateJobDisplay([...jobOpportunities, ...claimedJobs]);
        };
        pagination.appendChild(prevButton);
    }
    
    // Page buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = i === currentPage ? 'active' : '';
        pageButton.onclick = () => {
            currentPage = i;
            updateJobDisplay([...jobOpportunities, ...claimedJobs]);
        };
        pagination.appendChild(pageButton);
    }
    
    // Next button
    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = '→';
        nextButton.onclick = () => {
            currentPage++;
            updateJobDisplay([...jobOpportunities, ...claimedJobs]);
        };
        pagination.appendChild(nextButton);
    }
    
    return pagination;
}
// Function to create a job item
function createJobItem(job, isClaimed) {
    const template = document.getElementById('job-item-template');
    const jobItem = template.content.cloneNode(true);
    
    // Populate job details
    jobItem.querySelector('.job-title').textContent = job.title;
    jobItem.querySelector('.job-date-time').textContent = `${job.date} | ${job.time}`;
    jobItem.querySelector('.job-positions').textContent = `Positions: ${job.filledPositions}/${job.totalPositions}`;
    
    const actionsContainer = jobItem.querySelector('.job-actions');
    
    // Change this check to look for filledPositions > 0 instead of isClaimed
    if (job.filledPositions > 0) {
        const reportButton = document.createElement('button');
        reportButton.textContent = 'View Report';
        reportButton.className = 'report-btn';
        reportButton.onclick = () => showReport(job.id);
        actionsContainer.appendChild(reportButton);
    }
    
    return jobItem.querySelector('.job-item');
}
// Helper function to get weather forecast (mock data)
function getWeatherForecast(location) {
    // In a real application, this would call a weather API
    const forecasts = ['Sunny, 75°F', 'Cloudy, 68°F', 'Rainy, 62°F', 'Partly Cloudy, 70°F'];
    return forecasts[Math.floor(Math.random() * forecasts.length)];
}
// Function to publishSaved job
function publishSavedJob(jobId) {
    const jobIndex = savedJobs.findIndex(job => job.id === jobId);
    if (jobIndex !== -1) {
        const job = { ...savedJobs[jobIndex] };
        job.published = true;
        jobOpportunities.push(job);
        savedJobs.splice(jobIndex, 1);
        
        // Sort the jobOpportunities array chronologically
        sortJobsChronologically(jobOpportunities);
        
        updateJobDisplay([...jobOpportunities, ...savedJobs, ...claimedJobs]);
        updateDashboardCounts();
        addNotification("Job Published", `${job.title} has been published successfully`);
    }
}
// Function to toggle notifications
function toggleNotifications() {
    const notificationDropdown = document.getElementById('notification-dropdown');
    const alertIcon = document.querySelector('.alert-icon');
    const countElement = alertIcon.querySelector('.count');
    if (notificationDropdown.style.display === 'none' || notificationDropdown.style.display === '') {
        notificationDropdown.style.display = 'block';
        // Reset the counter to 0
        countElement.textContent = '0';
        // Hide the count element when it's 0
        countElement.style.display = 'none';
    } else {
        notificationDropdown.style.display = 'none';
    }
}
function addNotification(title, message) {
    const notificationDropdown = document.getElementById('notification-dropdown');
    const alertIcon = document.querySelector('.alert-icon');
    const countElement = alertIcon.querySelector('.count');
    // Create new notification item
    const notificationItem = document.createElement('div');
    notificationItem.className = 'notification-item';
    notificationItem.innerHTML = `
        <h4>${title}</h4>
        <p>${message}</p>
    `;
    notificationDropdown.appendChild(notificationItem);
    // Update the counter
    let currentCount = parseInt(countElement.textContent);
    countElement.textContent = currentCount + 1;
    countElement.style.display = 'block';
}
// Function to toggle user dropdown
function toggleDropdown() {
    const dropdownMenu = document.getElementById('dropdown-menu');
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
}
// Function to toggle job form
function toggleForm() {
    const formContainer = document.getElementById('job-form');
    formContainer.classList.toggle('hidden');
}
function initializeEditFunctionality() {
    // Update selector to match your exact HTML class
    const editBtn = document.querySelector('.btn.edit-btn');
    if (editBtn) {
        // Remove existing click handlers
        editBtn.removeEventListener('click', toggleEditing);
        // Add new click handler
        editBtn.addEventListener('click', toggleEditing);
    } else {
        console.error("Edit button not found - selector: .btn.edit-btn");
    }
}
// Function to toggle editing mode
function toggleEditing() {
    console.log('toggleEditing called');  // Debug log
    isEditing = !isEditing;
    
    // Update button text - Use the exact class from your HTML
    const editBtn = document.querySelector('.edit-btn');
    console.log('Edit button found:', editBtn);  // Debug log
    
    if (editBtn) {
        editBtn.textContent = isEditing ? 'Save Changes' : 'Edit Opportunities';
        editBtn.classList.toggle('editing', isEditing);
    }
    
    // Make all job cards editable/non-editable
    const jobCards = document.querySelectorAll('.job-card');
    console.log('Found job cards:', jobCards.length);  // Debug log
    
    jobCards.forEach(card => {
        const titleElement = card.querySelector('h3');
        const detailsElements = card.querySelectorAll('.job-details div:not(.positions-info)');
        
        if (titleElement) {
            titleElement.contentEditable = isEditing;
            titleElement.classList.toggle('editable', isEditing);
        }
        
        detailsElements.forEach(detail => {
            detail.contentEditable = isEditing;
            detail.classList.toggle('editable', isEditing);
        });
    });
    
    // If we're turning off editing, save changes
    if (!isEditing) {
        saveChanges();
    }
}
// Function to save changes
function saveChanges() {
    try {
        const jobCards = document.querySelectorAll('.job-card');
        let updatedCount = 0;
        
        jobCards.forEach(card => {
            const jobId = card.getAttribute('data-job-id');
            const titleElement = card.querySelector('h3');
            const detailsElements = card.querySelectorAll('.job-details div:not(.positions-info)');
            
            let jobToUpdate = findJobById(jobId);
            if (!jobToUpdate) return;
            
            if (titleElement) {
                jobToUpdate.title = titleElement.textContent.trim();
                updatedCount++;
            }
            
            if (detailsElements[0]) {
                jobToUpdate.date = detailsElements[0].textContent.trim();
            }
            
            if (detailsElements[1]) {
                jobToUpdate.time = detailsElements[1].textContent.trim();
            }
        });
        
        // Refresh the display
        updateJobDisplay([...jobOpportunities, ...savedJobs, ...claimedJobs]);
        
        // Add notification
        if (updatedCount > 0) {
            addNotification("Changes Saved", `Successfully updated ${updatedCount} job opportunities`);
        }
    } catch (error) {
        console.error("Error saving changes:", error);
        addNotification("Error", "Failed to save changes. Please try again.");
    }
}
function findJobById(jobId) {
    return jobOpportunities.find(job => job.id === jobId) ||
           savedJobs.find(job => job.id === jobId) ||
           claimedJobs.find(job => job.id === jobId);
}
// Function to apply filters
function applyFilters() {
    const location = document.getElementById('location-filter').value;
    const dateFilterType = document.getElementById('date-filter-type').value;
    const timeFilter = document.getElementById('time-filter').value;
    
    // Get jobs based on current view
    let filteredJobs;
    if (currentView === 'claimed') {
        filteredJobs = [...claimedJobs];
    } else if (currentView === 'unpublished') {
        filteredJobs = [...savedJobs];
    } else if (currentView === 'work') {
        filteredJobs = [...jobOpportunities, ...savedJobs];
    } else {
        filteredJobs = [...jobOpportunities, ...savedJobs, ...claimedJobs];
    }
    
    // Filter by location
    if (location) {
        filteredJobs = filteredJobs.filter(job => 
            job.title.toLowerCase().includes(location.toLowerCase())
        );
    }
    
    // Apply date filters
    if (dateFilterType) {
        filteredJobs = filteredJobs.filter(job => {
            const jobDateStr = parseDate(job.date);
            if (!jobDateStr) return false;
            const jobDate = new Date(jobDateStr);
            switch(dateFilterType) {
                case 'specific': {
                    const specificDateStr = document.getElementById('date-filter').value;
                    if (!specificDateStr) return true;
                    return jobDateStr === specificDateStr;
                }
                case 'range': {
                    const startDateStr = document.getElementById('start-date-filter').value;
                    const endDateStr = document.getElementById('end-date-filter').value;
                    if (!startDateStr || !endDateStr) return true;
                    
                    return jobDateStr >= startDateStr && jobDateStr <= endDateStr;
                }
                case 'month': {
                    const monthValue = document.getElementById('month-input').value;
                    if (!monthValue) return true;
                    
                    const [year, month] = monthValue.split('-');
                    const jobYear = jobDate.getFullYear();
                    const jobMonth = jobDate.getMonth() + 1;
                    return jobYear === parseInt(year) && jobMonth === parseInt(month);
                }
                default:
                    return true;
            }
        });
    }
    
    // Apply time filter
    if (timeFilter) {
        filteredJobs = filteredJobs.filter(job => {
            const [startTime] = job.time.split(' - ');
            const [time, period] = startTime.split(' ');
            const [hours] = time.split(':');
            let jobHour = parseInt(hours);
            
            if (period === 'PM' && jobHour !== 12) jobHour += 12;
            if (period === 'AM' && jobHour === 12) jobHour = 0;
            
            switch(timeFilter) {
                case 'morning':
                    return jobHour >= 6 && jobHour < 12;
                case 'afternoon':
                    return jobHour >= 12 && jobHour < 17;
                case 'evening':
                    return jobHour >= 17 && jobHour < 22;
                default:
                    return true;
            }
        });
    }
    
    // Reset pagination
    currentPage = 1;
    
    // Update display with filtered jobs
    updateJobDisplay(filteredJobs);
}
// Helper function to parse date string
// Helper function to parse date string
function parseDate(dateString) {
    const [month, day, year] = dateString.split(' ');
    const months = {
        'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
        'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
    };
    return `${year}-${(months[month] + 1).toString().padStart(2, '0')}-${day.replace(',', '').padStart(2, '0')}`;
}

function populateJobList(containerElement, jobs, isClaimed) {
    containerElement.innerHTML = '';
    jobs.forEach(job => {
        const jobItem = createJobItem(job, isClaimed);
        containerElement.appendChild(jobItem);
    });
}
// Function to save job
function saveJob() {
    const newJob = createJobObject();
    if (newJob) {
        newJob.published = false; // Explicitly mark as unpublished
        savedJobs.push(newJob);
        clearFormFields();
        toggleForm();
        updateJobDisplay([...jobOpportunities, ...savedJobs, ...claimedJobs]);
        updateDashboardCounts();
        addNotification("Job Saved", `${newJob.title} has been saved as draft`);
        setView('all');
    }
}
// Function to clear form fields
function clearFormFields() {
    document.getElementById('jobTitle').value = '';
    document.getElementById('date').value = '';
    document.getElementById('startTime').value = '';
    document.getElementById('endTime').value = '';
    document.getElementById('totalPositions').value = '';
}
// Function to publish job
function publishJob() {
    const newJob = createJobObject();
    if (newJob) {
        newJob.published = true;
        jobOpportunities.push(newJob);
        sortJobsChronologically(jobOpportunities);
        clearFormFields();
        toggleForm();
        addNotification("Job Published", `${newJob.title} has been published successfully`);
        setView('all');
    }
}
function createJobObject() {
    const jobTitle = document.getElementById('jobTitle').value;
    const jobDate = document.getElementById('date').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const totalPositions = document.getElementById('totalPositions').value;
    
    if (!jobTitle || !jobDate || !startTime || !endTime || !totalPositions) {
        alert('Please fill in all required fields.');
        return null;
    }
    
    // Create a date object using the selected date
    const selectedDate = new Date(jobDate + 'T00:00:00');
    
    return {
        id: `job${Date.now()}`,
        title: jobTitle,
        date: formatDate(selectedDate),
        time: `${formatTime(startTime)} - ${formatTime(endTime)}`,
        totalPositions: parseInt(totalPositions),
        filledPositions: 0,
        published: false
    };
}
// Helper function to calculate labor hours
function calculateLaborHours(startTime, endTime) {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    let hours = (end - start) / (1000 * 60 * 60);
    
    // If end time is earlier than start time, assume it's the next day
    if (hours < 0) {
        hours += 24;
    }
    
    return hours;
}
function formatDate(date) {
    // Add this to adjust for timezone offset
    date = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date(2000, 0, 1, hours, minutes);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}
function updateJobDisplay(jobs) {
    const unifiedJobList = document.getElementById('unified-job-list');
    unifiedJobList.innerHTML = '';
    
    // Create grid container
    const gridContainer = document.createElement('div');
    gridContainer.className = 'job-grid';
    
    // Calculate pagination
    const totalPages = Math.ceil(jobs.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentJobs = jobs.slice(startIndex, endIndex);
    
    // Add jobs to grid
    currentJobs.forEach(job => {
        const jobCard = createJobCard(job);
        gridContainer.appendChild(jobCard);
    });
    
    // Add grid to container
    unifiedJobList.appendChild(gridContainer);
    
    // Add pagination if needed
    if (totalPages > 1) {
        const pagination = createPagination(totalPages);
        unifiedJobList.appendChild(pagination);
    }
    
    updateDashboardCounts();
}
// Function to show report
function showReport(jobId) {
    const reportPopup = document.getElementById('report-popup');
    const reportContent = document.getElementById('report-content');
    
    // Sample report data - in a real application, this would come from a server
    // In the showReport function, update the reportData object to match our claimed job IDs:
const reportData = {
    'job4': {  // Changed from 'job1' to 'job4'
        title: 'Sorter - East Facility',
        date: 'June 18, 2024',
        time: '2:00 PM - 10:00 PM',
        unclaimed: 5,
        total: 20,
        employees: [
            { name: 'Jane Smith', phone: '(662) 555-5555', email: 'jane.smith@example.com', punctuality: 98, attendance: 98, comments: 'Reliable' },
            { name: 'John Doe', phone: '(662) 555-5555', email: 'jon.doe@example.org', punctuality: 99, attendance: 99, comments: 'Slow but steady' },
            { name: 'Edward Luke', phone: '(662) 555-5555', email: 'ed.luke123@example.net', punctuality: 90, attendance: 90, comments: 'Born leader' },
            { name: 'Sterling Bob', phone: '(662) 555-5555', email: 'sterling.bab@example.usa', punctuality: 91, attendance: 91, comments: 'Quiet but productive' },
            { name: 'Heather Brown', phone: '(662) 555-5555', email: 'heather.brown@example.us', punctuality: 87, attendance: 87, comments: '' },
            { name: 'Robert Pearl', phone: '(662) 555-5555', email: 'robertp@example.com', punctuality: 55, attendance: 55, comments: '' },
            { name: 'Albert Moe', phone: '(662) 555-5555', email: 'am124@example.com', punctuality: 90, attendance: 90, comments: '' },
            { name: 'Billy Bob', phone: '(662) 555-5555', email: 'bb@example.com', punctuality: 89, attendance: 89, comments: '' },
            { name: 'Joe Moore', phone: '(662) 555-5555', email: 'joeamoore@example.com', punctuality: 99, attendance: 99, comments: '' },
            { name: 'Clyde Weber', phone: '(662) 555-5555', email: 'clyde@example.com', punctuality: 100, attendance: 100, comments: '' },
            { name: 'Sarah Johnson', phone: '(662) 555-5555', email: 'sarahj@example.com', punctuality: 95, attendance: 95, comments: '' },
            { name: 'Mike Wilson', phone: '(662) 555-5555', email: 'mikew@example.com', punctuality: 93, attendance: 93, comments: '' },
            { name: 'Lisa Brown', phone: '(662) 555-5555', email: 'lisab@example.com', punctuality: 97, attendance: 97, comments: '' },
            { name: 'Tom Davis', phone: '(662) 555-5555', email: 'tomd@example.com', punctuality: 94, attendance: 94, comments: '' },
            { name: 'Emma White', phone: '(662) 555-5555', email: 'emmaw@example.com', punctuality: 96, attendance: 96, comments: '' }
        ]
    },
    'job5': {  // Changed from 'job2' to 'job5'
        title: 'Package Handler - Downtown Hub',
        date: 'June 15, 2024',
        time: '8:00 AM - 4:00 PM',
        unclaimed: 4,
        total: 12,
        employees: [
            { name: 'Alice Johnson', phone: '(662) 555-5556', email: 'alice.j@example.com', punctuality: 95, attendance: 97, comments: 'Fast learner' },
            { name: 'Bob Smith', phone: '(662) 555-5557', email: 'bob.smith@example.org', punctuality: 92, attendance: 94, comments: 'Team player' },
            { name: 'Carol White', phone: '(662) 555-5558', email: 'carol.w@example.com', punctuality: 96, attendance: 95, comments: 'Detail oriented' },
            { name: 'David Brown', phone: '(662) 555-5559', email: 'david.b@example.com', punctuality: 93, attendance: 96, comments: 'Hard worker' },
            { name: 'Eva Green', phone: '(662) 555-5560', email: 'eva.g@example.com', punctuality: 97, attendance: 98, comments: 'Great attitude' },
            { name: 'Frank Miller', phone: '(662) 555-5561', email: 'frank.m@example.com', punctuality: 94, attendance: 95, comments: 'Reliable' },
            { name: 'Grace Lee', phone: '(662) 555-5562', email: 'grace.l@example.com', punctuality: 98, attendance: 97, comments: 'Team player' },
            { name: 'Henry Wilson', phone: '(662) 555-5563', email: 'henry.w@example.com', punctuality: 95, attendance: 96, comments: 'Efficient' }
        ]
    }
};
    const report = reportData[jobId];
    
    if (report) {
        reportContent.innerHTML = `
            <div class="report-summary">
                <h3>${report.title}</h3>
                <p>${report.date} | ${report.time}</p>
                <p>${report.unclaimed} Unclaimed / ${report.total} Total</p>
            </div>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Punct. %</th>
                        <th>Atten. %</th>
                        <th>Manager Comments</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.employees.map(emp => `
                        <tr>
                            <td>${emp.name}</td>
                            <td>${emp.phone}</td>
                            <td>${emp.email}</td>
                            <td>${emp.punctuality}</td>
                            <td>${emp.attendance}</td>
                            <td>${emp.comments}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        reportPopup.style.display = 'block';
    } else {
        alert('Report not found for this job.');
    }
}
// Function to close report
function closeReport() {
    const reportPopup = document.getElementById('report-popup');
    reportPopup.style.display = 'none';
}
function showAlertDetails(alertType) {
    const popup = document.getElementById('alert-details-popup');
    const title = document.getElementById('alert-details-title');
    const content = document.getElementById('alert-details-content');
    
    // Set the title based on the alert type
    title.textContent = getAlertTitle(alertType);
    
    // Get and display the alert details
    const details = getAlertDetails(alertType);
    content.innerHTML = details;
    
    // Show the popup
    popup.style.display = 'block';
}
function closeAlertDetails() {
    const popup = document.getElementById('alert-details-popup');
    popup.style.display = 'none';
}
function getAlertTitle(alertType) {
    switch(alertType) {
        case 'unclaimed-24': return 'Unclaimed Jobs (24 hours)';
        case 'unclaimed-48': return 'Unclaimed Jobs (48 hours)';
        case 'understaffed': return 'Understaffed Jobs';
        default: return 'Alert Details';
    }
}
function getAlertDetails(alertType) {
    // Mock data aligned with dashboard jobs
    const alertData = {
        'unclaimed-24': [
            { title: 'Package Handler - Downtown Hub', date: 'June 15, 2024' },
            { title: 'Sorter - East Facility', date: 'June 18, 2024' }
        ],
        'unclaimed-48': [
            { title: 'Package Sorter - West Hub', date: 'June 21, 2024' },
            { title: 'Loading Dock Worker - Central Hub', date: 'June 23, 2024' }
        ],
        'understaffed': [
            { title: 'Sorter - East Facility', date: 'June 18, 2024', employee: 'Multiple positions open (5)', positions: '15/20 filled' },
            { title: 'Package Handler - Downtown Hub', date: 'June 15, 2024', employee: 'Multiple positions open (4)', positions: '8/12 filled' },
            { title: 'Package Sorter - West Hub', date: 'June 21, 2024', employee: 'Multiple positions open (8)', positions: '0/8 filled' }
        ]
    };

    const data = alertData[alertType] || [];
    let detailsHTML = '<ul>';
    
    switch(alertType) {
        case 'unclaimed-24':
        case 'unclaimed-48':
            data.forEach(job => {
                detailsHTML += `<li>${job.title} - ${job.date}</li>`;
            });
            break;
        case 'understaffed':
            data.forEach(job => {
                detailsHTML += `<li>${job.title} - ${job.date}<br>Status: ${job.positions}</li>`;
            });
            break;
    }
    
    detailsHTML += '</ul>';
    return detailsHTML;
}
function navigateTo(page) {
    window.location.href = page;
}
function toggleDateFilter() {
    const filterType = document.getElementById('date-filter-type').value;
    const specificDate = document.getElementById('specific-date');
    const dateRange = document.getElementById('date-range');
    const monthFilter = document.getElementById('month-filter');
    
    // Hide all date inputs first
    specificDate.style.display = 'none';
    dateRange.style.display = 'none';
    monthFilter.style.display = 'none';
    
    // Clear all inputs when switching types
    document.getElementById('date-filter').value = '';
    document.getElementById('start-date-filter').value = '';
    document.getElementById('end-date-filter').value = '';
    document.getElementById('month-input').value = '';
    
    // Show selected date input
    switch(filterType) {
        case 'specific':
            specificDate.style.display = 'block';
            break;
        case 'range':
            dateRange.style.display = 'block';
            break;
        case 'month':
            monthFilter.style.display = 'block';
            break;
    }
    
    // Apply filters to update the view
    applyFilters();
}

// Function to open Google Maps
function openGoogleMaps() {
    window.open('https://www.google.com/maps', '_blank');
}
// Function to handle logout
function logout() {
    // In a real application, you would handle the logout process here
    alert('Logging out...');
    window.location.href = 'index.html'; // Redirect to login page
}
function setView(view) {
    const mainContent = document.querySelector('.main-content');
    mainContent.style.display = 'block';
    
    // Store current view
    currentView = view;
    
    if (view === 'all') {
        updateJobDisplay([...jobOpportunities, ...savedJobs, ...claimedJobs]);
    } else if (view === 'claimed') {
        updateJobDisplay(claimedJobs);
    } else if (view === 'work') {
        updateJobDisplay([...jobOpportunities, ...savedJobs]);
    } else if (view === 'unpublished') {
        updateJobDisplay(savedJobs);
    }
    
    
    initializeEditFunctionality();
}
function updateDashboardCounts() {
    // Unpublished jobs count (saved but not published)
    document.getElementById('unpublishedCount').textContent = savedJobs.length;
    
    // Assigned workers (sum of all filled positions in claimed jobs)
    const totalWorkers = claimedJobs.reduce((sum, job) => sum + (job.filledPositions || 0), 0);
    document.getElementById('assignedWorkersCount').textContent = totalWorkers;
    
    // Total jobs (all jobs in system including unpublished)
    const totalJobs = jobOpportunities.length + claimedJobs.length;
    document.getElementById('totalJobsCount').textContent = totalJobs;
    
}
function updateDateTime() {
    const timeElement = document.querySelector('.current-time');
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    };
    timeElement.textContent = now.toLocaleDateString('en-US', options);
}

function setupSearch() {
    const searchInput = document.getElementById('jobSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const allJobs = [...jobOpportunities, ...savedJobs, ...claimedJobs];
            
            const filteredJobs = allJobs.filter(job => {
                return (
                    job.title.toLowerCase().includes(searchTerm) ||
                    job.date.toLowerCase().includes(searchTerm) ||
                    job.time.toLowerCase().includes(searchTerm)
                );
            });
            
            // Reset pagination to first page when searching
            currentPage = 1;
            updateJobDisplay(filteredJobs);
        });
    }
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initial setup
    document.querySelector('.main-content').style.display = 'none';
    updateDashboardCounts();
    updateDateTime();
    setInterval(updateDateTime, 60000);
    setupSearch();

    // Initialize edit functionality
    const editBtn = document.querySelector('.edit-btn');
    console.log('Edit button found:', editBtn);
    
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            console.log('Edit button clicked via event listener');
            toggleEditing();
        });
    }
    
    // Date filter listeners
    const dateFilterType = document.getElementById('date-filter-type');
    if (dateFilterType) {
        dateFilterType.addEventListener('change', toggleDateFilter);
    }
    
    // Apply filters button
    const applyFiltersBtn = document.querySelector('button[onclick="applyFilters()"]');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    // Date input listeners
    const dateInputs = document.querySelectorAll('.filter-input');
    dateInputs.forEach(input => {
        input.addEventListener('change', applyFilters);
    });
    
    // Initial date filter setup
    toggleDateFilter();
    
    // Remove any duplicate button creation
    const buttonGroup = document.querySelector('.button-group');
    if (buttonGroup) {
        // Only verify buttons exist, don't recreate them
        const createBtn = buttonGroup.querySelector('.create-btn');
        const editBtn = buttonGroup.querySelector('.edit-btn');
        
        if (!createBtn || !editBtn) {
            console.error('Required buttons are missing from button-group');
        }
    }
    
    
});
