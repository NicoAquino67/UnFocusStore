document.addEventListener('DOMContentLoaded', function() {
    console.log("El sitio está cargado y listo.");

    // Función para cargar contenido dinámico
    function loadSection(url, elementId) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                document.getElementById(elementId).innerHTML = data;
            })
            .catch(error => console.error('Error al cargar la sección:', error));
    }

    // Cargar la sección de héroe por defecto
    loadSection('/Server/sections/hero', 'main-content');

    // Agregar eventos a los enlaces del menú
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const section = this.getAttribute('href');
            loadSection(`/${section}`, 'main-content');
        });
    });
});
