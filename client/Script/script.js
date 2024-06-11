document.addEventListener('DOMContentLoaded', function() {
    // Fai una richiesta al server per ottenere i dati delle macchine in vendita
    fetch('http://localhost/json-example.json')
        .then(response => {
            // Verifica se la risposta del server è ok
            if (!response.ok) {
                throw new Error('Errore durante il recupero dei dati delle macchine in vendita');
            }
            // Parsa la risposta in formato JSON
            return response.json();
        })
        .then(data => {
            // Manipola i dati ottenuti e renderli nella pagina web
            renderMacchine(data);
        })
        .catch(error => {
            // Gestisci eventuali errori
            console.error('Si è verificato un errore:', error);
        });

    function renderMacchine(macchine) {
        const container = document.getElementById('macchine-container');

        // Cicla attraverso le macchine e crea un elemento per ciascuna
        macchine.forEach(macchina => {
            const macchinaElement = document.createElement('div');
            macchinaElement.classList.add('macchina'); // Aggiungi la classe .macchina

            // Costruisci il contenuto HTML della macchina
            const macchinaHTML = `
                <h2>${macchina.marca} ${macchina.modello}</h2>
                <h3>${macchina.descrizione}</h3>
                <p><strong>Anno:</strong> ${macchina.anno}</p>
                <p><strong>Kilometri:</strong> ${macchina.kilometri}</p>
                <p><strong>Stato:</strong> ${macchina.stato}</p>
                <p><strong>Prezzo:</strong> ${macchina.prezzo} €</p>
                <p><strong>Venditore:</strong> ${macchina.venditore.username}</p>
            `;

            // Imposta il contenuto HTML della macchina
            macchinaElement.innerHTML = macchinaHTML;

            // Aggiungi il pulsante di acquisto solo se il cookie 'tipo' è uguale a 'venditore' e la macchina non è stata venduta
            if (document.cookie.includes('tipo=venditore') && macchina.venduta === 0) { //da cambiare in cliente
                const buyButton = document.createElement('button');
                buyButton.textContent = 'Acquista';
                buyButton.classList.add('buy-button');
                buyButton.addEventListener('click', function() {
                    // Aggiungi qui la logica per l'acquisto della macchina
                    console.log('Acquisto della macchina:', macchina);
                });
                macchinaElement.appendChild(buyButton);
            }

            // Aggiungi la macchina al contenitore
            container.appendChild(macchinaElement);
        });
    }
});