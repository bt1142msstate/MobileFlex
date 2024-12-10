// Mock data for the manager's profile
let managerProfile = {
    name: "John Doe",
    employeeId: "FDX123456",
    email: "john.doe@fedex.com",
    position: "Regional Manager",
    department: "Flexible Workforce",
    location: "Springfield Hub",
    yearsOfService: 5,
    lastLogin: "May 15, 2024, 09:30 AM"
};

// Mock data for team members
let teamMembers = [
    { id: 1, name: "Alice Johnson", position: "Shift Supervisor" },
    { id: 2, name: "Bob Smith", position: "Team Lead" },
    { id: 3, name: "Carol Williams", position: "Operations Coordinator" }
];

// Mock data for recent activities
let recentActivities = [
    { date: "2024-05-15", activity: "Approved time-off request for Bob Smith" },
    { date: "2024-05-14", activity: "Created new job opportunity: Package Handler" },
    { date: "2024-05-13", activity: "Completed monthly performance review" },
    { date: "2024-05-12", activity: "Updated shift schedule for next week" }
];

// Function to populate profile information
function populateProfile() {
    document.getElementById('managerName').textContent = managerProfile.name;
    document.getElementById('employeeId').textContent = managerProfile.employeeId;
    document.getElementById('managerEmail').textContent = managerProfile.email;
    document.getElementById('managerPosition').textContent = managerProfile.position;
    document.getElementById('managerDepartment').textContent = managerProfile.department;
    document.getElementById('managerLocation').textContent = managerProfile.location;
    document.getElementById('yearsOfService').textContent = managerProfile.yearsOfService;
    document.getElementById('lastLogin').textContent = managerProfile.lastLogin;
}

// Function to create performance chart
function createPerformanceChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Team Efficiency', 'Job Fulfillment Rate', 'Employee Satisfaction', 'Cost Reduction'],
            datasets: [{
                label: 'Performance Metrics',
                data: [85, 92, 78, 88],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Function to populate team members
function populateTeamMembers() {
    const teamMembersContainer = document.getElementById('teamMembers');
    teamMembersContainer.innerHTML = '';
    teamMembers.forEach(member => {
        const memberElement = document.createElement('div');
        memberElement.className = 'team-member';
        memberElement.innerHTML = `
            <span>${member.name} - ${member.position}</span>
            <button onclick="removeTeamMember(${member.id})">Remove</button>
        `;
        teamMembersContainer.appendChild(memberElement);
    });
}

// Function to add a new team member
function addTeamMember() {
    const name = prompt("Enter team member's name:");
    const position = prompt("Enter team member's position:");
    if (name && position) {
        const newMember = {
            id: teamMembers.length + 1,
            name: name,
            position: position
        };
        teamMembers.push(newMember);
        populateTeamMembers();
    }
}

// Function to remove a team member
function removeTeamMember(id) {
    teamMembers = teamMembers.filter(member => member.id !== id);
    populateTeamMembers();
}

// Function to populate recent activities
function populateRecentActivities() {
    const activityLog = document.getElementById('activityLog');
    activityLog.innerHTML = '';
    recentActivities.forEach(activity => {
        const activityElement = document.createElement('li');
        activityElement.textContent = `${activity.date}: ${activity.activity}`;
        activityLog.appendChild(activityElement);
    });
}

// Function to toggle the edit profile modal
function toggleEditMode() {
    const modal = document.getElementById('editProfileModal');
    modal.style.display = 'block';
    
    // Populate the form with current profile data
    document.getElementById('editName').value = managerProfile.name;
    document.getElementById('editEmail').value = managerProfile.email;
    document.getElementById('editPosition').value = managerProfile.position;
    document.getElementById('editDepartment').value = managerProfile.department;
    document.getElementById('editLocation').value = managerProfile.location;
}

// Function to close the edit profile modal
function closeEditModal() {
    const modal = document.getElementById('editProfileModal');
    modal.style.display = 'none';
}

// Function to save profile changes
function saveProfileChanges(event) {
    event.preventDefault();
    
    managerProfile.name = document.getElementById('editName').value;
    managerProfile.email = document.getElementById('editEmail').value;
    managerProfile.position = document.getElementById('editPosition').value;
    managerProfile.department = document.getElementById('editDepartment').value;
    managerProfile.location = document.getElementById('editLocation').value;
    
    populateProfile();
    closeEditModal();
    
    // Add a new activity
    const today = new Date().toISOString().split('T')[0];
    recentActivities.unshift({
        date: today,
        activity: "Updated profile information"
    });
    populateRecentActivities();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    populateProfile();
    createPerformanceChart();
    populateTeamMembers();
    populateRecentActivities();
    
    // Add event listener for the edit profile form
    document.getElementById('editProfileForm').addEventListener('submit', saveProfileChanges);
});

// Function to toggle dropdown menu
function toggleDropdown() {
    const dropdownMenu = document.getElementById('dropdown-menu');
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
}

// Function to handle logout
function logout() {
    // In a real application, you would handle the logout process here
    alert('Logging out...');
    window.location.href = 'index.html'; // Redirect to login page
}

// Function to add a new activity
function addNewActivity(activity) {
    const today = new Date().toISOString().split('T')[0];
    recentActivities.unshift({
        date: today,
        activity: activity
    });
    populateRecentActivities();
}

// Function to update last login
function updateLastLogin() {
    const now = new Date();
    managerProfile.lastLogin = now.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    document.getElementById('lastLogin').textContent = managerProfile.lastLogin;
}

// Function to simulate receiving a notification
function simulateNotification() {
    const notifications = [
        "New job opportunity posted",
        "Shift change request from team member",
        "Performance review due next week",
        "New company policy update available"
    ];
    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    alert(`New Notification: ${randomNotification}`);
    addNewActivity(`Received notification: ${randomNotification}`);
}

// Add a notification simulation every 30 seconds


// Function to update years of service
function updateYearsOfService() {
    managerProfile.yearsOfService++;
    document.getElementById('yearsOfService').textContent = managerProfile.yearsOfService;
    addNewActivity("Work anniversary - years of service updated");
}

// Simulate updating years of service every 2 minutes (for demo purposes)


// Function to export profile data
function exportProfileData() {
    const profileData = JSON.stringify(managerProfile, null, 2);
    const blob = new Blob([profileData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manager_profile.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addNewActivity("Exported profile data");
}

// Add export button to the profile
document.addEventListener('DOMContentLoaded', () => {
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export Profile Data';
    exportButton.onclick = exportProfileData;
    document.querySelector('.profile-info').appendChild(exportButton);
});

// Function to update performance metrics
function updatePerformanceMetrics() {
    const chart = Chart.getChart('performanceChart');
    const newData = chart.data.datasets[0].data.map(value => {
        // Simulate small changes in metrics
        return Math.max(0, Math.min(100, value + (Math.random() - 0.5) * 5));
    });
    chart.data.datasets[0].data = newData;
    chart.update();
    addNewActivity("Performance metrics updated");
}

// Update performance metrics every 3 minutes


// Function to simulate team member status changes
function simulateTeamMemberStatusChange() {
    if (teamMembers.length > 0) {
        const randomMember = teamMembers[Math.floor(Math.random() * teamMembers.length)];
        const statuses = ["on leave", "completed training", "received commendation"];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        addNewActivity(`Team member ${randomMember.name} ${randomStatus}`);
    }
}

// Simulate team member status changes every 4 minutes


// Function to generate a simple report
function generateReport() {
    const reportContent = `
Manager Performance Report

Name: ${managerProfile.name}
Position: ${managerProfile.position}
Department: ${managerProfile.department}

Team Size: ${teamMembers.length}
Recent Activities: ${recentActivities.length} in the past week

Key Metrics:
${Chart.getChart('performanceChart').data.labels.map((label, index) => {
    return `- ${label}: ${Chart.getChart('performanceChart').data.datasets[0].data[index]}%`;
}).join('\n')}

Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manager_report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addNewActivity("Generated performance report");
}

// Add report generation button
document.addEventListener('DOMContentLoaded', () => {
    const reportButton = document.createElement('button');
    reportButton.textContent = 'Generate Report';
    reportButton.onclick = generateReport;
    document.querySelector('.performance-metrics').appendChild(reportButton);
});

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    populateProfile();
    createPerformanceChart();
    populateTeamMembers();
    populateRecentActivities();
    updateLastLogin();
    
    // Add event listener for the edit profile form
    document.getElementById('editProfileForm').addEventListener('submit', saveProfileChanges);
});