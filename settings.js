// Mock user settings data
let userSettings = {
    emailNotifications: true,
    smsNotifications: false,
    emailAddress: '',
    phoneNumber: '',
    language: 'en',
    timeZone: 'ET',
    theme: 'light',
    dashboardLayout: 'grid',
    jobAlerts: 'daily'
};

// Function to populate form with current settings
function populateSettings() {
    document.getElementById('emailNotifications').checked = userSettings.emailNotifications;
    document.getElementById('smsNotifications').checked = userSettings.smsNotifications;
    document.getElementById('emailAddress').value = userSettings.emailAddress;
    document.getElementById('phoneNumber').value = userSettings.phoneNumber;
    document.getElementById('language').value = userSettings.language;
    document.getElementById('timeZone').value = userSettings.timeZone;
    document.getElementById('theme').value = userSettings.theme;
    document.getElementById('dashboardLayout').value = userSettings.dashboardLayout;
    document.getElementById('jobAlerts').value = userSettings.jobAlerts;
}

// Function to save settings
function saveSettings(event) {
    event.preventDefault();
    userSettings = {
        emailNotifications: document.getElementById('emailNotifications').checked,
        smsNotifications: document.getElementById('smsNotifications').checked,
        emailAddress: document.getElementById('emailAddress').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        language: document.getElementById('language').value,
        timeZone: document.getElementById('timeZone').value,
        theme: document.getElementById('theme').value,
        dashboardLayout: document.getElementById('dashboardLayout').value,
        jobAlerts: document.getElementById('jobAlerts').value
    };
    alert('Settings saved successfully!');
    applyTheme(userSettings.theme);
}

// Function to apply theme
function applyTheme(theme) {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
}

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

// Function to open change password modal
function openChangePasswordModal() {
    document.getElementById('changePasswordModal').style.display = 'block';
}

// Function to close change password modal
function closeChangePasswordModal() {
    document.getElementById('changePasswordModal').style.display = 'none';
}

// Function to handle password change
function changePassword(event) {
    event.preventDefault();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert('New passwords do not match.');
        return;
    }

    // Here you would typically send this information to a server to verify and update the password
    alert('Password changed successfully!');
    closeChangePasswordModal();
}

// Function to enable two-factor authentication
function enable2FA() {
    // In a real application, this would initiate the 2FA setup process
    alert('Two-factor authentication setup initiated. Please check your email for further instructions.');
}

// Function to export user data
function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userSettings));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "user_settings.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Function to delete account
function deleteAccount() {
    const confirm = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirm) {
        // In a real application, this would send a request to the server to delete the account
        alert('Account deletion process initiated. You will receive a confirmation email shortly.');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    populateSettings();
    document.getElementById('settingsForm').addEventListener('submit', saveSettings);
    document.getElementById('changePasswordBtn').addEventListener('click', openChangePasswordModal);
    document.querySelector('.modal .close').addEventListener('click', closeChangePasswordModal);
    document.getElementById('changePasswordForm').addEventListener('submit', changePassword);
    document.getElementById('enable2FABtn').addEventListener('click', enable2FA);
    document.getElementById('exportDataBtn').addEventListener('click', exportData);
    document.getElementById('deleteAccountBtn').addEventListener('click', deleteAccount);
    
    // Apply current theme on page load
    applyTheme(userSettings.theme);
});