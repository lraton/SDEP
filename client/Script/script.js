document.addEventListener('DOMContentLoaded', function () {
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
            // Aggiungi il modulo di acquisto solo se il cookie 'tipo' è uguale a 'venditore' e la macchina non è stata venduta
            if (document.cookie.includes('tipo=venditore') && macchina.venduta === 0) {
                const buyForm = document.createElement('form');
                buyForm.classList.add('buy-form');
                buyForm.addEventListener('submit', function (event) {
                    event.preventDefault(); // Evita l'invio del modulo
                    // Esegui qui la logica per inviare i dati al server
                    const formData = new FormData(buyForm);
                    const formDataObject = {};
                    formData.forEach((value, key) => {
                        formDataObject[key] = value;
                    });
                    console.log('Dati inviati al server:', formDataObject);
                });

                const buyButton = document.createElement('button');
                buyButton.textContent = 'Acquista';
                buyButton.classList.add('buy-button');
                buyForm.appendChild(buyButton);

                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = 'macchina_id'; // Nome del campo da inviare al server
                hiddenInput.value = macchina.id; // Valore del campo (ID della macchina)
                buyForm.appendChild(hiddenInput);

                macchinaElement.appendChild(buyForm);
            }

            // Aggiungi la macchina al contenitore
            container.appendChild(macchinaElement);
        });
    }
});