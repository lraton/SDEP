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
                buyForm.action = 'http://localhost:3000/buy-macchina'; // Imposta l'azione del modulo
                buyForm.method = 'post'; // Imposta il metodo del modulo

                const hiddenInputId = document.createElement('input');
                hiddenInputId.type = 'hidden';
                hiddenInputId.name = 'macchina_id'; // Nome del campo da inviare al server
                hiddenInputId.value = macchina.id; // Valore del campo (ID della macchina)
                buyForm.appendChild(hiddenInputId);

                const hiddenInputUsername = document.createElement('input');
                hiddenInputUsername.type = 'hidden';
                hiddenInputUsername.name = 'username'; // Nome del campo da inviare al server
                hiddenInputUsername.value = getCookieValue('username'); // Valore del campo (Nome del cliente dal cookie)
                buyForm.appendChild(hiddenInputUsername);

                const buyButton = document.createElement('input');
                buyButton.type = 'submit';
                buyButton.value = 'Acquista';
                buyButton.classList.add('invia');
                buyForm.appendChild(buyButton);

                macchinaElement.appendChild(buyForm);
            }

            // Aggiungi la macchina al contenitore
            container.appendChild(macchinaElement);
        });
    }

    function getCookieValue(cookieName) {
        const name = cookieName + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }
        return "";
    }
});