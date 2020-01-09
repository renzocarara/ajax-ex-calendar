// Repo: ajax-ex-calendar
// Creare un calendario dinamico con le festività. Partiamo dal gennaio
// 2018 dando la possibilità di cambiare mese, gestendo il caso in cui l’API
// non possa ritornare festività. Il calendario partirà da gennaio 2018 e si
// concluderà a dicembre 2018 (unici dati disponibili sull’API).
// -----------------------------------------------------------------------------
var urlCalendar = "https://flynn.boolean.careers/exercises/api/holidays";
var initialMoment = moment('2018-01-01'); // data inizio del calendario
var initialMonth = initialMoment.month(); // mese di inizio del calendario
var gridSize = 42; // dimensione griglia, numero di elementi di cui è composta

$(document).ready(function() {

    // creo la griglia per visualizzare i singoli mesi del calendario
    createGrid();

    displayMonth(); // visualizzo il primo mese
    GetAndApplyHolidays(initialMonth); // applico le festività al primo mese

    //intercetto click sui bottoni di navigazione
    $('.nav-button').click(function() {

        // chiamo una funzione per gestire il click
        handleNavigation($(this));

    }); // fine evento click su bottone

});

// ---------------------------- FUNCTIONs --------------------------------------
function applyHolidays(holidaysList) {
    // DESCRIZIONE:
    // applica le festività sul mese corrente
    // riceve in ingresso un array di oggetti che contiene le festività
    // per quel mese (se ce ne sono)

    // scorro l'array delle festività restituito dall'API
    for (var i = 0; i < holidaysList.length; i++) {
        // estraggo data (YYYY-MM-DD) e nome della festività
        var holidayDate = holidaysList[i].date;
        var holidayName = holidaysList[i].name;
        // console.log("data:", holidayDate, "nome:", holidayName);

        // creo un indice con il numero del giorno contenuto nella stringa data (ultimi 2 caratteri)
        var indexDay = holidayDate.slice(-2);
        // console.log("indice:", indexDay);

        // accedo all'elemento della pagina HTML tramite indice
        // NOTA: .eq() indicizza partendo da 0
        // console.log("indexDay-1", indexDay - 1);
        // aggiungo dello stile per evidenziare la festività
        $('.day').eq(indexDay - 1).addClass('holiday');
    }
}

function GetAndApplyHolidays(month) {
    // DESCRIZIONE:
    // chiamata AJAX per recuperare le festività
    // poi chiama una funzione per applicare e festività sulla pagina HTML

    $.ajax({
        url: urlCalendar,
        data: {
            'year': initialMoment.year(),
            'month': month
        },
        method: 'get',
        success: function(data) {
            var holidays = data.response;
            // console.log("holydays", holidays);
            applyHolidays(data.response);
        },
        error: function() {
            alert("ERRORE! C'è stato un problema nell'accesso ai dati");
        }
    });
} // end function GetAndApplyHolidays()

function handleNavigation(that) {
    // DESCRIZIONE:
    // gestisce il click sui bottoni 'precedente' e 'successivo'
    // visualizza il nuovo mese, applica le festività e verifica se
    // aggiornare l'aspetto dei pulsanti (disbilitarli/abilitarli)

    var currentMonth = initialMoment.month();

    if (that.hasClass('next')) {
        // è stato cliccato il bottone 'successivo'
        console.log("clic successivo");
        console.log("mese corrente:", currentMonth);
        // verifico se il bottone può essere cliccato (11 corrisponde a dicembre)
        if (currentMonth < 11) {
            // incremento il mese
            initialMoment.add(1, 'months');

            // visualizzo il nuovo mese e applico le festività
            displayMonth();
            GetAndApplyHolidays(currentMonth + 1);

            // abilito/disabilito a livello grafico i bottoni di navigazione
            if (currentMonth == 10) { // mi sono spostato sull'ultimo mese)
                // rendo visivamente disabilitato il pulsante 'successivo'
                $('.nav-button.next').addClass('disabled');
            } else if (currentMonth == 0) { // mi sono spostato sul secondo mese
                // rendo visivamente abilitato il pulsante 'precedente'
                $('.nav-button.prev').removeClass('disabled');
            }

        } else {
            // eventuale messaggio d'errore
        }

    } else {
        // è stato cliccato il bottone 'precedente'
        console.log("clic precedente");
        console.log("mese corrente:", currentMonth);
        // verifico se il bottone può essere cliccato (0 corrisponde a gennaio)
        if (currentMonth > 0) {
            // decremento il mese
            initialMoment.subtract(1, 'months');

            // visualizzo il nuovo mese  e applico le festività
            displayMonth();
            GetAndApplyHolidays(currentMonth - 1);

            // abilito/disabilito a livello grafico i bottoni di navigazione
            if (currentMonth == 1) { // mi sono spostato sul primo mese)
                // rendo visivamente disabilitato il pulsante 'precedente'
                $('.nav-button.prev').addClass('disabled');
            } else if (currentMonth == 11) { // mi sono spostato sul penultimo mese
                // rendo visivamente abilitato il pulsante 'successivo'
                $('.nav-button.next').removeClass('disabled');
            }

        } else {
            // eventuale messaggio d'errore
        }
    }

} // end function handleNavigation()


function displayMonth() {
    // DESCRIZIONE:
    // visualizza il mese corrente sulla pagina HTML,
    // creando dinamicamente gli elementi, utilizza HANDLEBARS

    // recupero il n. di giorni di cui è composto il mese
    var numberOfDays = initialMoment.daysInMonth();
    // console.log("numberOfDays", numberOfDays);

    // pulisco la pagina
    $('#grid-container .cell').empty();

    // aggiorno il nome del mese
    monthName = initialMoment.format('MMMM');
    $('#month-name').text(monthName);

    // estraggo il giorno della settimana del primo giorno del mese
    // va da 0 a 6 corrispondente a dom (0), lun(1), mar(2), ..., sab(6)
    var weekdayNumber = initialMoment.day();
    // console.log("primo giorno del mese:", weekdayNumber);

    // offset rispetto alla 1a cella della griglia, va da 0 a 6,
    // mi dice da che cella iniziare a visualizzare i giorni del mese
    // calcolo l'offset in base al giorno della settimana
    // lunedì offset=1, .... domenica offset=6
    var offset = 6; // offset nel caso in cui il weekday è domenica
    if (weekdayNumber > 0) { // il giorno non è domenica
        offset = weekdayNumber - 1;
    }
    // console.log("offset", offset);

    // clono l'oggetto moment che contiene la data del mese corrente
    var weekdaysMoment = initialMoment.clone();

    // inserisco in modo dinamico tutti i giorni di cui è composto il mese
    for (var dayNumber = 1; dayNumber <= numberOfDays; dayNumber++) {
        // estraggo il nome del giorno della settimana
        var weekdayName = weekdaysMoment.format('ddd');
        // oggetto per HANDLEBARS
        var context = {
            'day': dayNumber,
            'week-day': weekdayName
        };
        // recupero il codice html dal template HANDLEBARS
        var monthTemplate = $('#month-template').html();
        // compilo il template HANDLEBARS, lui mi restituisce un funzione
        var monthFunction = Handlebars.compile(monthTemplate);
        // chiamo la funzione generata da HANDLEBARS per popolare il template
        var monthDay = monthFunction(context);
        // aggiungo in pagina il giorno appena creato
        $('.cell').eq(dayNumber - 1 + offset).append(monthDay);
        // passo al giorno successivo
        weekdaysMoment.add(1, 'days');
        // console.log("weekday", weekdaysMoment.format('ddd'));
    }
} // end function

function createGrid() {
    // DESCRIZIONE:
    // creo una griglia fissa di 7 colonne X 6 righe (42 elementi)

    var gridCell = '<span class="cell"></span>'; // codice HTML da ripetere in pagina

    // ciclo per "gridSize" volte e aggiungo ogni volta il mio elemento HTML
    for (var i = 0; i < gridSize; i++) {
        // appendo, quindi aggiungo in coda, senza sovrascrivere
        $('#grid-container').append(gridCell);
    }
}