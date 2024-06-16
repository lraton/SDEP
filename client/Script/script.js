// Verifica se ci troviamo sulla pagina delle macchine
if (document.title === 'SDEP Auto') {
    document.addEventListener('DOMContentLoaded', function () {
        // Fai una richiesta al server per ottenere i dati delle macchine in vendita
        fetch('http://localhost:3000/macchine')
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

                // Aggiungi la classe .venduta se la macchina è stata venduta
                if (macchina.venduta === 1) {
                    macchinaElement.classList.add('venduta');
                }

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

                // Aggiungi il modulo di acquisto solo se il cookie 'tipo' è uguale a 'cliente' e la macchina non è stata venduta
                if (document.cookie.includes('tipo=cliente') && macchina.venduta === 0) {
                    const buyForm = document.createElement('form');
                    buyForm.classList.add('buy-form');
                    buyForm.action = 'http://localhost:3000/buy-macchina'; // Imposta l'azione del modulo
                    buyForm.method = 'post'; // Imposta il metodo del modulo

                    // Campo nascosto per l'ID della macchina
                    const hiddenInputId = document.createElement('input');
                    hiddenInputId.type = 'hidden';
                    hiddenInputId.name = 'macchina_id';
                    hiddenInputId.value = macchina.id;
                    buyForm.appendChild(hiddenInputId);

                    // Campo nascosto per il nome utente del cliente
                    const hiddenInputUsername = document.createElement('input');
                    hiddenInputUsername.type = 'hidden';
                    hiddenInputUsername.name = 'username';
                    hiddenInputUsername.value = getCookieValue('username');
                    buyForm.appendChild(hiddenInputUsername);

                    // Bottone di acquisto
                    const buyButton = document.createElement('input');
                    buyButton.type = 'submit';
                    buyButton.value = 'Acquista';
                    buyButton.classList.add('invia');
                    buyButton.classList.add('buy-button');
                    buyForm.appendChild(buyButton);

                    // Aggiungi il form di acquisto alla macchina
                    macchinaElement.appendChild(buyForm);
                }

                // Aggiungi la macchina al contenitore
                container.appendChild(macchinaElement);
            });
        }
    });
}

// Verifica se ci troviamo sulla pagina dei ricambi
if (document.title === 'SDEP Ricambi') {
    document.addEventListener('DOMContentLoaded', function () {
        // Fai una richiesta al server per ottenere i dati dei ricambi in vendita
        fetch('http://localhost:3000/ricambi')
            .then(response => {
                // Verifica se la risposta del server è ok
                if (!response.ok) {
                    throw new Error('Errore durante il recupero dei dati dei ricambi in vendita');
                }
                // Parsa la risposta in formato JSON
                return response.json();
            })
            .then(data => {
                // Manipola i dati ottenuti e renderli nella pagina web
                renderRicambi(data);
            })
            .catch(error => {
                // Gestisci eventuali errori
                console.error('Si è verificato un errore:', error);
            });

        function renderRicambi(ricambi) {
            const container = document.getElementById('ricambi-container');

            // Cicla attraverso i ricambi e crea un elemento per ciascuno
            ricambi.forEach(ricambio => {
                const ricambioElement = document.createElement('div');
                ricambioElement.classList.add('macchina'); // Aggiungi la classe .macchina

                // Aggiungi la classe .venduta se il ricambio è stato venduto
                if (ricambio.venduta === 1) {
                    ricambioElement.classList.add('venduta');
                }

                // Costruisci il contenuto HTML del ricambio
                const ricambioHTML = `
                    <h2>${ricambio.marca} ${ricambio.modello}</h2>
                    <h3>${ricambio.descrizione}</h3>
                    <p><strong>Stato:</strong> ${ricambio.stato}</p>
                    <p><strong>Prezzo:</strong> ${ricambio.prezzo} €</p>
                    <p><strong>Venditore:</strong> ${ricambio.venditore.username}</p>
                `;

                // Imposta il contenuto HTML del ricambio
                ricambioElement.innerHTML = ricambioHTML;

                // Aggiungi il modulo di acquisto solo se il cookie 'tipo' è uguale a 'cliente' e il ricambio non è stato venduto
                if (document.cookie.includes('tipo=cliente') && ricambio.venduta === 0) {
                    const buyForm = document.createElement('form');
                    buyForm.classList.add('buy-form');
                    buyForm.action = 'http://localhost:3000/buy-ricambi'; // Imposta l'azione del modulo
                    buyForm.method = 'post'; // Imposta il metodo del modulo

                    // Campo nascosto per l'ID del ricambio
                    const hiddenInputId = document.createElement('input');
                    hiddenInputId.type = 'hidden';
                    hiddenInputId.name = 'ricambi_id';
                    hiddenInputId.value = ricambio.id;
                    buyForm.appendChild(hiddenInputId);

                    // Campo nascosto per il nome utente del cliente
                    const hiddenInputUsername = document.createElement('input');
                    hiddenInputUsername.type = 'hidden';
                    hiddenInputUsername.name = 'username';
                    hiddenInputUsername.value = getCookieValue('username');
                    buyForm.appendChild(hiddenInputUsername);

                    // Bottone di acquisto
                    const buyButton = document.createElement('input');
                    buyButton.type = 'submit';
                    buyButton.value = 'Acquista';
                    buyButton.classList.add('invia');
                    buyButton.classList.add('buy-button');
                    buyForm.appendChild(buyButton);

                    // Aggiungi il form di acquisto al ricambio
                    ricambioElement.appendChild(buyForm);
                }

                // Aggiungi il ricambio al contenitore
                container.appendChild(ricambioElement);
            });
        }
    });
}

// Verifica se ci troviamo sulla pagina delle transazioni
if (document.title === 'SDEP Transazioni') {
    document.addEventListener('DOMContentLoaded', function () {
        // Fai una richiesta al server per ottenere i dati delle transazioni
        fetch('http://localhost:3000/transazioni', {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Errore durante il recupero dei dati delle transazioni');
                }
                return response.json();
            })
            .then(data => {
                // Manipola i dati ottenuti e renderli nella pagina web
                renderTransazioni(data);
            })
            .catch(error => {
                console.error('Si è verificato un errore:', error);
            });

        function renderTransazioni(transazioni) {
            const container = document.getElementById('transazioni-container');
            const table = document.createElement('table');
            table.classList.add('transazioni-table');

            // Intestazione della tabella delle transazioni
            const headerHTML = `
                <tr>
                    <th>Transazione ID</th>
                    <th>Venditore</th>
                    <th>Cliente</th>
                    <th>Macchina - Marca</th>
                    <th>Macchina - Modello</th>
                    <th>Macchina - Descrizione</th>
                    <th>Macchina - Stato</th>
                    <th>Ricambio - Marca</th>
                    <th>Ricambio - Modello</th>
                    <th>Ricambio - Descrizione</th>
                    <th>Ricambio - Stato</th>
                    </tr>
                `;
            table.innerHTML = headerHTML;

            // Cicla attraverso le transazioni e popola la tabella
            transazioni.forEach(transazione => {
                const row = document.createElement('tr');
                row.classList.add('transazione-row');

                // Costruisci il contenuto HTML per la macchina coinvolta nella transazione (se presente)
                const macchinaHTML = transazione.macchina.id !== null ? `
                        <td>${transazione.macchina.marca}</td>
                        <td>${transazione.macchina.modello}</td>
                        <td>${transazione.macchina.descrizione}</td>
                        <td>${transazione.macchina.stato}</td>
                    ` : `
                        <td colspan="4">N/A</td>
                    `;

                // Costruisci il contenuto HTML per il ricambio coinvolto nella transazione (se presente)
                const ricambioHTML = transazione.ricambio.id !== null ? `
                        <td>${transazione.ricambio.marca}</td>
                        <td>${transazione.ricambio.modello}</td>
                        <td>${transazione.ricambio.descrizione}</td>
                        <td>${transazione.ricambio.stato}</td>
                    ` : `
                        <td colspan="4">N/A</td>
                    `;

                // Costruisci la riga della tabella con i dati della transazione
                const rowHTML = `
                        <td>${transazione.id}</td>
                        <td>${transazione.venditore}</td>
                        <td>${transazione.cliente}</td>
                        ${macchinaHTML}
                        ${ricambioHTML}
                    `;

                row.innerHTML = rowHTML;
                table.appendChild(row);
            });

            // Aggiungi la tabella al contenitore delle transazioni
            container.appendChild(table);
        }
    });
}

// Funzione per ottenere il valore di un cookie dato il nome
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

// Verifica se ci troviamo sulla pagina di upload
document.addEventListener('DOMContentLoaded', function () {
    const uploadLink = document.querySelector('.upload-link');
    const isVenditore = document.cookie.includes('tipo=venditore');

    // Nascondi il link di upload se l'utente non è un venditore
    if (!isVenditore) {
        uploadLink.style.display = 'none';

        // Se si è sulla pagina di upload e l'utente non è un venditore, reindirizza alla home
        if (window.location.pathname.includes('upload.html')) {
            window.location.href = 'index.html';
        }
    }
});

// Verifica se ci troviamo sulla pagina delle transazioni
document.addEventListener('DOMContentLoaded', function () {
    const uploadLink = document.querySelector('.transazioni');
    const isVenditore = document.cookie.includes('tipo=venditore');
    const isCliente = document.cookie.includes('tipo=cliente');

    // Nascondi il link delle transazioni se l'utente non è né venditore né cliente
    if (!isVenditore && !isCliente) {
        uploadLink.style.display = 'none';

        // Se si è sulla pagina transazioni.html e l'utente non è né venditore né cliente, reindirizza alla home
        if (window.location.pathname.includes('transazioni.html')) {
            window.location.href = 'index.html';
        }
    }
});

// Aggiorna il testo del link di login con il nome utente se il cookie 'username' è impostato
document.addEventListener('DOMContentLoaded', function () {
    const username = getCookie('username');

    if (username) {
        const loginLink = document.getElementById('loginLink');
        if (loginLink) {
            loginLink.textContent = username;
        }
    }
});

