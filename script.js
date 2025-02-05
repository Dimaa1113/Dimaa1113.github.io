// script.js

// Preloader
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  preloader.style.display = 'none';
});


// Burger Menu
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
const navLinksLi = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    // Toggle Nav
    navLinks.classList.toggle('nav-active');

    // Animate Links
    navLinksLi.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });

    // Burger Animation
    burger.classList.toggle('toggle');
});

// Close nav when a link is clicked (for mobile)
navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && window.innerWidth <= 768) {
        navLinks.classList.remove('nav-active');
        burger.classList.remove('toggle'); // Remove the 'X'
         navLinksLi.forEach((link) => {  // Reset link animations
            link.style.animation = '';
         });
    }
});



// --- Three.js  ---
let scene, camera, renderer, lungs;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;


    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('lungs-canvas'), antialias: true, alpha: true }); // Alpha: true for transparent background
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Make background fully transparent
    // renderer.setPixelRatio(window.devicePixelRatio);  // For High DPI displays. Not always needed.

    // Ambient Light (subtle, all-around light)
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft white light
    scene.add(ambientLight);

    // Directional Light (main light source)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light
    directionalLight.position.set(1, 1, 1); // From top-right
    scene.add(directionalLight);



    // Load the lung model (replace 'lungs.glb' with your actual model file)
    const loader = new THREE.GLTFLoader();
    loader.load('lungs.glb', (gltf) => {  //  <--  Use GLTFLoader if you have a .glb file
        lungs = gltf.scene;
        lungs.scale.set(0.1, 0.1, 0.1); // Adjust scale as needed
        lungs.position.set(0, -0.5, 0); // Center and lower the lungs slightly

        // Material for Healthy Lungs
        const healthyMaterial = new THREE.MeshStandardMaterial({
          color: 0xff6b6b, //  A healthy pinkish color.  Adjust as you see fit.
          roughness: 0.7,
          metalness: 0.1,
          // transparent: true, //  Make slightly transparent
          // opacity: 0.8
        });

        // Material for Damaged Lungs (Initially hidden)
        const damagedMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444, // Dark grey/black
            roughness: 0.9,
            metalness: 0.2,
        });


        // Apply the healthy material initially.  We'll swap it out later.
         lungs.traverse((child) => {
            if (child.isMesh) {
                child.material = healthyMaterial;
            }
        });

        scene.add(lungs);
        animate(); // Start the animation loop after the model is loaded

        //  Trigger the "damage" animation after a delay
          setTimeout(() => {
            damageLungs(lungs, healthyMaterial, damagedMaterial);
        }, 5000); //  Start after 5 seconds (adjust as needed)

    }, undefined, (error) => {
        console.error('Error loading model:', error);
    });
}

function animate() {
    requestAnimationFrame(animate);
    if (lungs) {
        lungs.rotation.y += 0.005; // Slow rotation
    }
    renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// --- Lungs Damage Animation ---

function damageLungs(lungs, healthyMaterial, damagedMaterial) {
    // GSAP Timeline for smooth transitions

  const tl = gsap.timeline();


   lungs.traverse((child) => {
      if (child.isMesh) {
        tl.to(child.material, {
            //  Gradually change properties to match the damaged material
              color: new THREE.Color(damagedMaterial.color),
              roughness: damagedMaterial.roughness,
              metalness: damagedMaterial.metalness,
              duration: 3,  //  Transition over 3 seconds
              ease: "power2.inOut", //  Smooth easing
            })
      }
    });
}




// --- Facts Carousel ---
let currentFact = 0;
const facts = document.querySelectorAll('.fact-item');
const prevButton = document.getElementById('prev-fact');
const nextButton = document.getElementById('next-fact');

function showFact(index) {
    const carousel = document.querySelector('.facts-carousel');
    const itemWidth = facts[0].offsetWidth + 20; // Include margin

     // Calculate the required translation
     const translateX = -index * itemWidth; // + adjustment;

    carousel.style.transition = 'transform 0.5s ease-in-out'; // Add smooth transition
    carousel.style.transform = `translateX(${translateX}px)`;
}

prevButton.addEventListener('click', () => {
    currentFact = (currentFact - 1 + facts.length) % facts.length;
    showFact(currentFact);
});

nextButton.addEventListener('click', () => {
    currentFact = (currentFact + 1) % facts.length;
    showFact(currentFact);
});

// --- Initial Setup ---

init(); // Initialize Three.js scene
showFact(currentFact); // Show the initial fact
