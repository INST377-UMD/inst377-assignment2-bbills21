// Fetch 10 random dog images and populate the carousel
fetch('https://dog.ceo/api/breeds/image/random/10')
    .then(res => res.json())
    .then(data => {
        const carousel = document.getElementById('dogCarousel');
        carousel.innerHTML = ''; // Clear any existing content in the carousel

        // Create an array to store the image elements
        const images = [];

        data.message.forEach(imgUrl => {
            const imgElement = document.createElement('img');
            imgElement.src = imgUrl;
            imgElement.alt = "Dog Image";
            imgElement.classList.add('carousel-image');
            imgElement.style.display = 'none'; // Hide all images initially
            carousel.appendChild(imgElement);
            images.push(imgElement); // Add the image to the array
        });

        // Start the slideshow
        let currentIndex = 0;
        images[currentIndex].style.display = 'block'; // Show the first image

        setInterval(() => {
            images[currentIndex].style.display = 'none'; // Hide the current image
            currentIndex = (currentIndex + 1) % images.length; // Move to the next image
            images[currentIndex].style.display = 'block'; // Show the next image
        }, 3000); // Change image every 3 seconds
    })
    .catch(error => console.error('Error fetching dog images:', error));
    
// Fetch dog breeds and dynamically create 10 random buttons
fetch('https://api.thedogapi.com/v1/breeds')
    .then(res => res.json())
    .then(data => {
        const buttonContainer = document.createElement('div');
        buttonContainer.setAttribute('id', 'breedButtons');
        document.body.insertBefore(buttonContainer, document.querySelector('.audio-controls'));

        // Shuffle the breeds array
        const shuffledBreeds = data.sort(() => 0.5 - Math.random());

        // Select the first 10 breeds from the shuffled array
        const randomBreeds = shuffledBreeds.slice(0, 10);

        // Create buttons for the random breeds
        randomBreeds.forEach(breed => {
            const button = document.createElement('button');
            button.classList.add('breed-button');
            button.innerText = breed.name;
            button.addEventListener('click', () => showBreedInfo(breed));
            buttonContainer.appendChild(button);
        });

        window.dogBreeds = randomBreeds; // Store breeds globally for voice commands
    })
    .catch(error => console.error('Error fetching dog breeds:', error));

// Function to display breed information
function showBreedInfo(breed) {
    document.getElementById('breedName').innerText = breed.name;

    // Use description if available, otherwise fallback to temperament
    const description = breed.description || breed.temperament || 'No description available.';
    document.getElementById('breedDescription').innerText = description;

    // Check if the lifespan already includes "years"
    const lifeSpan = breed.life_span;
    document.getElementById('breedLife').innerText = lifeSpan.includes('years') ? lifeSpan : `${lifeSpan} years`;

    document.getElementById('breedInfo').classList.remove('hidden');
}


// Voice command for dog breeds
if (annyang) {
    annyang.addCommands({
        'hello': () => alert('Hello World!'),
        'change the color to *color': (color) => {
            document.body.style.backgroundColor = color;
            alert(`Changed the background color to ${color}`);
        }, 
        'navigate to *page': (page) => {
            const lower = page.toLowerCase();
            if (lower.includes('home')) location.href = 'Home_page.html';
            if (lower.includes('stocks')) location.href = 'Stocks_page.html';
            if (lower.includes('dogs')) location.href = 'Dog_page.html';
        },
        'load dog breed *breedName': (breedName) => {
            console.log(`Command received: load dog breed ${breedName}`); // Debugging log

            // Check if the dog breeds array is populated
            if (!window.dogBreeds || window.dogBreeds.length === 0) {
                alert('Dog breeds are not loaded yet. Please try again in a moment.');
                return;
            }

            const breed = window.dogBreeds.find(b => b.name.toLowerCase() === breedName.toLowerCase());
            if (breed) {
                console.log(`Breed found: ${breed.name}`); // Debugging log

                showBreedInfo(breed);
            } else {
                alert(`Breed "${breedName}" not found!`);
            }
        }
        
    });

    if (!annyang.isListening()) {
        annyang.start();
    }
    console.log('Is Annyang listening?', annyang.isListening());
}