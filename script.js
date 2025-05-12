// portfolio_script.js
document.addEventListener('DOMContentLoaded', () => {
    const mainNav = document.getElementById('main-nav');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link'); // All nav links (desktop and mobile)

    // --- Navbar Scroll Effect ---
    // Changes navbar appearance on scroll
    if (mainNav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                mainNav.classList.add('bg-slate-900', 'shadow-lg', 'py-3');
                mainNav.classList.remove('py-4');
            } else {
                mainNav.classList.remove('bg-slate-900', 'shadow-lg', 'py-3');
                mainNav.classList.add('py-4');
            }
        });
    }

    // --- Mobile Menu Toggle ---
    // Handles opening and closing the mobile navigation menu
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden'); // Toggles visibility
            mobileMenu.classList.toggle('mobile-nav-active'); // Custom class for flex display
            // Change icon between bars and times (X)
            const icon = mobileMenuButton.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        });
    }

    // --- Smooth Scrolling & Active Link Highlighting & Close Mobile Menu ---
    // Handles smooth scroll to sections and updates active nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Check if it's an internal link
            if (href && href.startsWith('#')) {
                e.preventDefault(); // Prevent default anchor behavior
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // Smooth scroll to the target element
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });

                    // Update active link immediately for desktop
                    if (!link.classList.contains('mobile-nav-link')) {
                       updateActiveLink(this);
                    }
                }
            }

            // Close mobile menu if a mobile link is clicked
            if (link.classList.contains('mobile-nav-link') && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('mobile-nav-active');
                const icon = mobileMenuButton.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Function to update the active state of navigation links
    function updateActiveLink(activeLink) {
        // Update for desktop links
        document.querySelectorAll('#main-nav .hidden.md\\:flex a.nav-link').forEach(navLink => {
            navLink.classList.remove('text-sky-400', 'font-semibold');
            navLink.classList.add('text-slate-300');
        });
        if (activeLink && !activeLink.classList.contains('mobile-nav-link')) {
            activeLink.classList.add('text-sky-400', 'font-semibold');
            activeLink.classList.remove('text-slate-300');
        }
    }

    // --- Active Link Highlighting on Scroll using Intersection Observer ---
    // Observes sections to update active nav link as user scrolls
    const sections = document.querySelectorAll('main section[id]');
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.5 // 50% of section visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const intersectingLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                updateActiveLink(intersectingLink);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    // --- GSAP Scroll-Triggered Animations ---
    // Animates elements into view as the user scrolls
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // General reveal animation for elements with 'gsap-reveal' class
        gsap.utils.toArray('.gsap-reveal').forEach((elem) => {
            gsap.fromTo(elem,
                { opacity: 0, y: 50 }, // Initial state: invisible and slightly down
                {
                    opacity: 1, y: 0, // Final state: visible and at original position
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: elem,
                        start: 'top 85%', // Animation starts when element is 85% from top of viewport
                        toggleActions: 'play none none none', // Play animation once when triggered
                        // markers: true, // Uncomment for debugging ScrollTrigger
                    }
                }
            );
        });

        // Staggered animation for skill items
        gsap.from(".skill-item", {
            scrollTrigger: {
                trigger: "#skills .grid",
                start: "top 80%",
                toggleActions: "play none none none",
            },
            opacity: 0,
            y: 30,
            duration: 0.5,
            stagger: 0.1, // Stagger animation for each item
            ease: "power2.out",
        });

        // Staggered animation for project cards
        gsap.from(".project-card", {
            scrollTrigger: {
                trigger: "#projects .grid",
                start: "top 80%",
                toggleActions: "play none none none",
            },
            opacity: 0,
            y: 40,
            duration: 0.6,
            stagger: 0.15,
            ease: "power3.out",
        });

    } else {
        console.warn("GSAP or ScrollTrigger library not loaded. Animations disabled.");
    }

    // --- Update Footer Year ---
    // Automatically sets the current year in the footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    console.log("New Portfolio Script Loaded & Initialized");
});
