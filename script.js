// Function to get the current language
function getCurrentLanguage() {
    const selectedLanguage = localStorage.getItem('selectedLanguage');
    if (selectedLanguage) {
        return selectedLanguage;
    } else {
        const userLanguage = navigator.language;
        const supportedLanguages = ['nl', 'en', 'fr'];
        return supportedLanguages.includes(userLanguage) ? userLanguage : 'en';
    }
}

// Function to update the minimum height of the body
function updateMinHeight() {
    document.body.style.minHeight = window.innerHeight + 'px';
}

// Function to toggle text visibility
var isTextVisible = true;

function toggleText() {
    var dynamicContent = document.getElementById("dynamic-content");
    var hiddenText = document.getElementById("hobbies");
    var arrowIcon = document.querySelector('.arrow-icon');
    var arrowText = document.querySelector('.arrow-text');

    if (isTextVisible) {
        dynamicContent.style.display = "none";
        hiddenText.style.display = "block";
        arrowText.style.display = "none";
        arrowIcon.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    } else {
        dynamicContent.style.display = "block";
        hiddenText.style.display = "none";
        arrowText.style.display = "block";
        arrowIcon.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    }

    isTextVisible = !isTextVisible;
}

// Function to change the language
function changeLanguage(event) {
    event.preventDefault();
    let language = this.id;
    language = language.replace('-button', ''); // Remove the "-button" part from the ID

    // Check for "mobile-" prefix and remove it if it exists
    if (language.startsWith('mobile-')) {
        language = language.replace('mobile-', '');
    }

    loadTranslations(language);

    const headerDownloadLink = document.querySelector('.header-download-link');
    headerDownloadLink.href = `brightest-files/CV_${language}.pdf`;

    const mobileDownloadLink = document.querySelector('#mobile-download-link');
    mobileDownloadLink.href = `brightest-files/CV_${language}.pdf`;

    localStorage.setItem('selectedLanguage', language);
}


// Function to load translations
function loadTranslations(language) {
    const xmlURL = `https://bartschram93.github.io/translations.xml`;

    fetch(xmlURL)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, 'text/xml');
            const languageNode = xmlDoc.querySelector(`language[code="${language}"]`);
            if (languageNode) {
                const translations = languageNode.querySelectorAll('text');
                translations.forEach(translation => {
                    const elementId = translation.getAttribute('id');
                    const translatedText = translation.innerHTML;
                    const element = document.getElementById(elementId);
                    if (element) {
                        if (translatedText.includes('<image')) {
                            const imgSrcMatch = translatedText.match(/src="([^"]+)"/);
                            if (imgSrcMatch) {
                                const imgSrc = imgSrcMatch[1];
                                const imgElement = document.createElement('img');
                                imgElement.src = imgSrc;
                                imgElement.alt = 'Image';
                                element.innerHTML = '';
                                element.appendChild(imgElement);
                            }
                        } else {
                            const translatedTextWithLineBreaks = translatedText.replace(/<br\s*\/?>/g, '<br>');
                            element.innerHTML = translatedTextWithLineBreaks;
                        }
                    }
                });
                const downloadLink = document.querySelector('.header-download-link');
                downloadLink.href = `brightest-files/CV_${language}.pdf`;
                const mobileDownloadLink = document.querySelector('#mobile-download-link');
                mobileDownloadLink.href = `brightest-files/CV_${language}.pdf`;
            } else {
                console.log('First-time visitor: No previous languageNode found.');
            }
        })
        .catch(error => {
            console.error('Error loading XML data:', error);
        });
}

// Initialize the application when the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    updateMinHeight();
    window.addEventListener('resize', updateMinHeight);

    const languageButtons = document.querySelectorAll('.language-button');
    languageButtons.forEach(button => {
        button.addEventListener('click', changeLanguage);
    });

    const storedLanguage = localStorage.getItem('selectedLanguage') || navigator.language || 'nl';
    loadTranslations(storedLanguage);
    localStorage.setItem('selectedLanguage', storedLanguage);
});

document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".menu-icon");
    const mobileNavigation = document.querySelector(".mobile-navigation");
    const header = document.querySelector('header');

    menuIcon.addEventListener("click", function () {
        menuIcon.classList.toggle("open");
        mobileNavigation.classList.toggle("open");
    });

    document.addEventListener('click', function (event) {
        if (mobileNavigation.classList.contains('open') && !menuIcon.contains(event.target)) {
            mobileNavigation.classList.remove('open');
            menuIcon.classList.remove('open');
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const nameInput = document.querySelector('input[name="name"]');
    const emailInput = document.querySelector('input[name="email"]');
    const messageInput = document.querySelector('textarea');
    const sendButton = document.querySelector('#send');

    if (sendButton) {
        sendButton.setAttribute('disabled', 'disabled');
        nameInput.addEventListener('input', validateForm);
        emailInput.addEventListener('input', validateForm);
        messageInput.addEventListener('input', validateForm);

        function validateForm() {
            const nameValue = nameInput.value.trim();
            const emailValue = emailInput.value.trim();
            const messageValue = messageInput.value.trim();
        
            if (nameValue !== '' && emailValue !== '' && messageValue !== '') {
                sendButton.removeAttribute('disabled');
                sendButton.classList.remove('button-disabled');
                sendButton.classList.add('button-enabled');
                sendButton.style.border = '1px solid #00000000';
                sendButton.style.cursor = 'pointer';
            } else {
                sendButton.setAttribute('disabled', 'disabled');
                sendButton.classList.remove('button-enabled');
                sendButton.classList.add('button-disabled');
                sendButton.style.border = '1px solid #CCCCCC';
                sendButton.style.cursor = 'pointer';
            }
        }        
    }
});