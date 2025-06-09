// Script para el carrusel, acordeón y funcionalidad de zoom
document.addEventListener('DOMContentLoaded', function() {
    // ------ CARRUSEL DE PRODUCTOS ------
    const carousel = document.getElementById('carousel');
    const carouselContainer = document.querySelector('.carousel-container');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');
    const carouselItems = document.querySelectorAll('.carousel-item');
    
    // Calcular ancho de cada elemento
    const itemWidth = 100 / 5; // 5 ítems visibles a la vez (20% del ancho cada uno)
    const totalItems = carouselItems.length;
    
    // Configurar ancho de cada ítem del carrusel y añadir transición
    carouselItems.forEach(item => {
        item.style.width = `${itemWidth}%`;
        item.style.flexShrink = 0;
        item.style.transition = 'transform 0.5s ease'; // Añadir transición suave
    });
    
    // Aplicar transición al contenedor del carrusel
    carouselContainer.style.transition = 'transform 0.5s ease';
    
    // Configuración inicial
    let currentPosition = 0;
    
    // Función para desplazar el carrusel con animación
    function moveCarousel() {
        // Animar el movimiento
        carouselContainer.style.transform = `translateX(-${itemWidth}%)`;
        
        // Después de la animación, reorganizar los elementos
        setTimeout(() => {
            // Restablecer la transformación
            carouselContainer.style.transition = 'none';
            carouselContainer.style.transform = 'translateX(0)';
            
            // Mover el elemento del principio al final
            const firstItem = carouselContainer.firstElementChild;
            carouselContainer.appendChild(firstItem.cloneNode(true));
            carouselContainer.removeChild(firstItem);
            
            // Restaurar la transición para el próximo movimiento
            setTimeout(() => {
                carouselContainer.style.transition = 'transform 0.5s ease';
            }, 50);
            
            // Actualizar indicadores
            currentPosition = (currentPosition + 1) % totalItems;
            updateIndicators();
        }, 500); // Coincidir con la duración de la transición
    }
    
    // Actualizar los indicadores
    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            if (index === currentPosition) {
                indicator.classList.remove('bg-gray-300');
                indicator.classList.add('bg-gray-800');
            } else {
                indicator.classList.remove('bg-gray-800');
                indicator.classList.add('bg-gray-300');
            }
        });
    }
    
    // Avanzar automáticamente
    let interval = setInterval(moveCarousel, 3000);
    
    // Event listeners para los botones
    prevBtn.addEventListener('click', () => {
        clearInterval(interval);
        
        // Preparar el elemento antes de animar
        const lastItem = carouselContainer.lastElementChild;
        carouselContainer.style.transition = 'none';
        carouselContainer.prepend(lastItem.cloneNode(true));
        carouselContainer.style.transform = `translateX(-${itemWidth}%)`;
        
        // Forzar un reflow para que la transición funcione
        carouselContainer.offsetHeight;
        
        // Animar el movimiento hacia adelante
        carouselContainer.style.transition = 'transform 0.5s ease';
        carouselContainer.style.transform = 'translateX(0)';
        
        // Limpiar después de la animación
        setTimeout(() => {
            carouselContainer.removeChild(lastItem);
            
            // Actualizar posición e indicadores
            currentPosition = (currentPosition - 1 + totalItems) % totalItems;
            updateIndicators();
        }, 500);
        
        // Reiniciar el intervalo
        interval = setInterval(moveCarousel, 3000);
    });
    
    nextBtn.addEventListener('click', () => {
        clearInterval(interval);
        moveCarousel();
        interval = setInterval(moveCarousel, 3000);
    });
    
    // Event listeners para los indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            clearInterval(interval);
            
            // Calcular cantidad de movimientos necesarios
            const diff = (index - currentPosition + totalItems) % totalItems;
            
            // Realizar los movimientos con un pequeño retraso entre ellos
            if (diff > 0) {
                let count = 0;
                const moveNext = () => {
                    moveCarousel();
                    count++;
                    if (count < diff) {
                        setTimeout(moveNext, 600);
                    }
                };
                moveNext();
            }
            
            // Reiniciar el intervalo después de completar todos los movimientos
            setTimeout(() => {
                interval = setInterval(moveCarousel, 3000);
            }, diff * 600);
        });
    });
    
    // ------ ACORDEÓN ------
    const accordionBtns = document.querySelectorAll('.accordion-btn');
    
    accordionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('svg');
            
            // Toggle el contenido
            content.classList.toggle('hidden');
            
            // Rotar el icono
            if (content.classList.contains('hidden')) {
                icon.classList.remove('rotate-90');
            } else {
                icon.classList.add('rotate-90');
            }
        });
    });
    
    // ------ FUNCIONALIDAD DE ZOOM SIMPLIFICADA ------
    const productImages = document.querySelectorAll('.product-image');
    const zoomModal = document.getElementById('zoomModal');
    const zoomImage = document.getElementById('zoomImage');
    const closeModal = document.getElementById('closeModal');
    
    // Estado del zoom
    let isZoomed = false;
    
    // Modificar el cursor de las imágenes a lupa
    productImages.forEach(img => {
        img.style.cursor = 'zoom-in';
    });
    
    // Abrir modal y mostrar imagen
    productImages.forEach(img => {
        img.addEventListener('click', () => {
            if (img.dataset.zoom === 'true') {
                zoomImage.src = img.src;
                zoomImage.alt = img.alt;
                zoomModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Prevenir scroll
                
                // Configurar imagen sin zoom inicial
                zoomImage.style.transform = 'scale(1)';
                zoomImage.style.cursor = 'zoom-in';
                isZoomed = false;
            }
        });
    });
    
    // Manejar clic en la imagen para alternar zoom
    zoomImage.addEventListener('click', (e) => {
        if (!isZoomed) {
            // Hacer zoom en el punto donde se hizo clic
            const rect = zoomImage.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;
            
            // Calcular porcentajes de posición
            const percentX = offsetX / rect.width;
            const percentY = offsetY / rect.height;
            
            // Aplicar zoom
            zoomImage.style.transformOrigin = `${percentX * 100}% ${percentY * 100}%`;
            zoomImage.style.transform = 'scale(2.5)';
            zoomImage.style.cursor = 'zoom-out';
            isZoomed = true;
        } else {
            // Quitar zoom
            zoomImage.style.transform = 'scale(1)';
            zoomImage.style.cursor = 'zoom-in';
            isZoomed = false;
        }
        
        e.stopPropagation(); // Evitar que el clic se propague al modal
    });
    
    // Cerrar modal
    closeModal.addEventListener('click', () => {
        zoomModal.classList.add('hidden');
        document.body.style.overflow = ''; // Restaurar scroll
    });
    
    // Cerrar modal al hacer clic fuera de la imagen
    zoomModal.addEventListener('click', (e) => {
        if (e.target === zoomModal) {
            zoomModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !zoomModal.classList.contains('hidden')) {
            zoomModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });
});