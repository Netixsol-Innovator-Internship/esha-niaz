        // Mobile menu functionality
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileCloseButton = document.getElementById('mobile-close-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const hamburgerIcon = document.getElementById('hamburger-icon');
        const closeIcon = document.getElementById('close-icon');

        function openMobileMenu() {
            mobileMenu.classList.remove('translate-x-full');
            mobileMenu.classList.add('translate-x-0');
            document.body.style.overflow = 'hidden';
            hamburgerIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
        }

        function closeMobileMenu() {
            mobileMenu.classList.add('translate-x-full');
            mobileMenu.classList.remove('translate-x-0');
            document.body.style.overflow = 'auto';
            hamburgerIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        }

        mobileMenuButton.addEventListener('click', openMobileMenu);
        mobileCloseButton.addEventListener('click', closeMobileMenu);

        // Close mobile menu when clicking outside
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                closeMobileMenu();
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });

        // Submenu toggle function (placeholder for dropdown functionality)
        function toggleSubmenu(submenuId) {
            console.log('Toggle submenu:', submenuId);
            // Add submenu functionality here if needed
        }

        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 768) {
                closeMobileMenu();
            }
        });