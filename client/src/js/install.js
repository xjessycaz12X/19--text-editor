const butInstall = document.getElementById('buttonInstall');

// Function to check if the app is installed
function isAppInstalled() {
    // This checks if the app is in standalone mode, which usually means it's installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true || localStorage.getItem('isAppInstalled') === 'true';
    console.log('App is installed:', isInstalled);
    return isInstalled;
}

// Initially hide the install button if the app is installed
if (isAppInstalled()) {
    butInstall.classList.add('hidden');
    console.log('Hiding install button because the app is already installed');
}

// Logic for installing the PWA
window.addEventListener('beforeinstallprompt', (event) => {
    // Prevent the default infobar from appearing on mobile
    event.preventDefault();
    console.log('beforeinstallprompt event fired');

    window.deferredPrompt = event;

    // Only show the install button if the app isn't already installed
    if (!isAppInstalled()) {
        butInstall.classList.remove('hidden');
        console.log('Showing install button');
    } else {
        console.log('Not showing install button because the app is installed');
    }
});

// Implement a click event handler on the `butInstall` element
butInstall.addEventListener('click', async () => {
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) {
        console.log('No deferredPrompt available');
        return;
    }

    promptEvent.prompt(); // Show the install prompt
    const result = await promptEvent.userChoice; // Wait for the user to respond to the prompt
    if (result.outcome === 'accepted') {
        console.log('User accepted the install prompt');
    } else {
        console.log('User dismissed the install prompt');
    }

    window.deferredPrompt = null;
    butInstall.classList.add('hidden');
});

// Handle the `appinstalled` event
window.addEventListener('appinstalled', (event) => {
    console.log('App was installed.');
    localStorage.setItem('isAppInstalled', 'true');
    butInstall.classList.add('hidden'); // Hide the install button once app is installed
});
