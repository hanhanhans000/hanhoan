// Set current year in footer (matching madanidesign.com)
document.getElementById('current-year').textContent = '2026';

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Project modal functionality
const modal = document.getElementById('project-modal');
const projectItems = document.querySelectorAll('.project-item');
const modalClose = document.querySelector('.modal-close');

// Project data matching the exact structure from madanidesign.com
const projectData = {
    1: {
        year: 'Dec 2025',
        category: 'Web',
        title: 'Keep Magazine',
        description: 'Publishing systems, directory logic, editorial structure.',
        tags: 'Publishing Directory Based Editorial'
    },
    2: {
        year: '2024',
        category: 'Web',
        title: 'Loops.szn',
        description: 'Interactive portfolio with floating windows, interaction decisions and parallax motion.',
        tags: 'UI Interactive Portfolio Web'
    },
    3: {
        year: '2025',
        category: 'Direction',
        title: 'Editorial Spreads',
        description: 'Editorial spreads',
        tags: 'Editorial Print Mixed media'
    },
    4: {
        year: '2025',
        category: 'Content',
        title: 'Content Design',
        description: 'Short-form and editorial video design for personal and client platforms.',
        tags: 'Video Motion Social'
    },
    5: {
        year: 'Ongoing',
        category: 'Content',
        title: 'Shovel Studio',
        description: 'Making design and visual briefs for Shovel Studio.',
        tags: 'Systems Strategy Reels'
    },
    6: {
        year: 'Sep 2025',
        category: 'Direction',
        title: 'Dog Tags',
        description: 'Direction notes, material decisions.',
        tags: 'Direction Marketing Graphic Design'
    }
};

// Open modal when project is clicked
projectItems.forEach(item => {
    item.addEventListener('click', function() {
        const projectId = this.getAttribute('data-project');
        const data = projectData[projectId];
        
        if (data) {
            // Populate modal with project data in the same format
            const modalMeta = document.querySelector('.modal-meta');
            modalMeta.innerHTML = `<span class="modal-year">${data.year}</span><strong>**${data.category}**</strong><span class="modal-title">${data.title}</span>`;
            
            document.querySelector('.modal-description').textContent = data.description;
            document.querySelector('.modal-tags').textContent = data.tags;
            
            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Close modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);

// Close modal when clicking outside
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Add subtle fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe project items for fade-in
projectItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});

// Observe about and contact sections
const sections = document.querySelectorAll('.about-section, .contact-section');
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});
