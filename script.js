// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== NAVEGAÇÃO MÓVEL =====
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle do menu mobile
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // ===== SCROLL SUAVE E NAVEGAÇÃO ATIVA =====
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');

    // Função para destacar link ativo na navegação
    function highlightActiveNav() {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                current = sectionId;
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    }

    // ===== HEADER TRANSPARENTE NO SCROLL =====
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    function handleHeaderScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Esconder/mostrar header baseado na direção do scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
        highlightActiveNav();
    }

    // ===== ANIMAÇÕES NO SCROLL =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
                
                // Animação especial para cards de projeto
                if (entry.target.classList.contains('project-card')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    entry.target.style.animationDelay = `${delay}ms`;
                }
                
                // Animação especial para itens de tecnologia
                if (entry.target.classList.contains('tech-item')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 50;
                    entry.target.style.animationDelay = `${delay}ms`;
                }
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.project-card, .tech-item, .education-item, .contact-item, .hero-content, .about-text, .about-skills');
    animatedElements.forEach(el => observer.observe(el));

    // ===== FORMULÁRIO DE CONTATO =====
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obter dados do formulário
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Validação básica
        if (!name || !email || !message) {
            showNotification('Por favor, preencha todos os campos.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Por favor, insira um e-mail válido.', 'error');
            return;
        }
        
        // Simular envio do formulário
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitButton.disabled = true;
        
        // Simular delay de envio
        setTimeout(() => {
            showNotification('Mensagem enviada com sucesso! Retornarei em breve.', 'success');
            contactForm.reset();
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }, 2000);
    });

    // ===== EFEITOS VISUAIS =====
    
    // Parallax sutil no hero
    const hero = document.querySelector('.hero');
    function handleParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    }

    // Efeito de typing no título
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Aplicar efeito de typing ao título principal
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80);
        }, 1000);
    }

    // ===== CONTADOR ANIMADO PARA ESTATÍSTICAS =====
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    // ===== FILTRO DE PROJETOS =====
    const projectCards = document.querySelectorAll('.project-card');
    
    // Adicionar funcionalidade de filtro se necessário
    function filterProjects(category) {
        projectCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                card.classList.add('animate-on-scroll');
            } else {
                card.style.display = 'none';
            }
        });
    }

    // ===== MODAL PARA PROJETOS =====
    function createProjectModal(project) {
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <img src="${project.image}" alt="${project.title}">
                <div class="modal-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="modal-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="modal-links">
                        <a href="${project.demo}" class="btn-primary" target="_blank">Ver Demo</a>
                        <a href="${project.github}" class="btn-secondary" target="_blank">GitHub</a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Fechar modal
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // ===== TEMA ESCURO/CLARO =====
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.setAttribute('aria-label', 'Alternar tema');
    
    // Adicionar botão de tema ao header
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.appendChild(themeToggle);
    }

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        
        themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    // Carregar tema salvo
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // ===== FUNÇÕES UTILITÁRIAS =====
    
    // Validação de e-mail
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Sistema de notificações
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Mostrar notificação
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remover notificação
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }

    // Debounce para otimizar performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ===== EVENT LISTENERS =====
    
    // Scroll events com debounce para melhor performance
    window.addEventListener('scroll', debounce(handleHeaderScroll, 10));
    window.addEventListener('scroll', debounce(handleParallax, 10));
    
    // Resize events
    window.addEventListener('resize', debounce(() => {
        // Reajustar elementos se necessário
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }, 250));

    // ===== INICIALIZAÇÃO =====
    
    // Executar funções iniciais
    highlightActiveNav();
    
    // Adicionar classe para indicar que JS foi carregado
    document.body.classList.add('js-loaded');
    
    // Preloader (se existir)
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 1000);
    }

    // ===== EASTER EGGS =====
    
    // Konami Code
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.keyCode);
        
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            showNotification('🎉 Código Konami ativado! Você encontrou um easter egg!', 'success');
            document.body.classList.add('konami-mode');
            
            // Adicionar efeitos especiais
            setTimeout(() => {
                document.body.classList.remove('konami-mode');
            }, 5000);
        }
    });

    // Console message
    console.log(`
    🚀 Portfólio de Robson Souza
    
    Desenvolvido com:
    • HTML5 semântico
    • CSS3 moderno com Grid e Flexbox
    • JavaScript vanilla ES6+
    • Design responsivo
    • Animações suaves
    • Acessibilidade
    
    Obrigado por visitar! 👨‍💻
    `);
});

// ===== ESTILOS ADICIONAIS PARA FUNCIONALIDADES JS =====
const additionalStyles = `
    .theme-toggle {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .theme-toggle:hover {
        background: var(--accent-cyan);
        border-color: var(--accent-cyan);
        transform: scale(1.1);
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-lg);
        z-index: 10000;
        transform: translateX(400px);
        transition: all 0.3s ease;
        max-width: 350px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.1);
    }
    
    .notification-error {
        border-color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        color: var(--text-primary);
    }
    
    .notification-success .notification-content i {
        color: #10b981;
    }
    
    .notification-error .notification-content i {
        color: #ef4444;
    }
    
    .project-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: var(--spacing-lg);
    }
    
    .modal-content {
        background: var(--bg-secondary);
        border-radius: var(--border-radius-xl);
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
    }
    
    .modal-close {
        position: absolute;
        top: 15px;
        right: 20px;
        font-size: 30px;
        cursor: pointer;
        color: var(--text-secondary);
        z-index: 1;
    }
    
    .modal-close:hover {
        color: var(--accent-cyan);
    }
    
    .konami-mode {
        animation: rainbow 2s infinite;
    }
    
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    .js-loaded .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
    }
    
    .js-loaded .animate-on-scroll.from-left {
        transform: translateX(-30px);
    }
    
    .js-loaded .animate-on-scroll.from-right {
        transform: translateX(30px);
    }
    
    .preloader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    }
    
    .preloader.fade-out {
        opacity: 0;
    }
    
    .menu-open {
        overflow: hidden;
    }
    
    .header.scrolled {
        background: rgba(15, 23, 42, 0.98);
        backdrop-filter: blur(20px);
    }
    
    @media (max-width: 768px) {
        .theme-toggle {
            order: -1;
            margin-right: auto;
        }
        
        .notification {
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;

// Adicionar estilos ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
