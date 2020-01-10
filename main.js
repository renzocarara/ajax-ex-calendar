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

    // al caricamento della pagina il bottone 'precedente' è disabilitato
    $('.nav-button.prev').prop('disabled', true);

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

        // creo un indice per il metodo .eq(),
        // con il numero del giorno contenuto nella data (ultimi 2 caratteri)
        // NOTA: .eq() indicizza partendo da 0, mentre i giorni partono da 1, per cui sottraggo 1
        var indexDay = holidayDate.slice(-2) - 1;

        // accedo all'elemento della pagina HTML tramite l'indice
        // aggiungo dello stile (sull'elemento genitore) per evidenziare la festività
        $('.day').eq(indexDay).parent().addClass('holiday');
        // aggiungo il nome della festività
        $('.holiday-name').eq(indexDay).append(holidayName);
    }
}

function GetAndApplyHolidays(month) {
    // DESCRIZIONE:
    // fa un chiamata AJAX per recuperare le festività
    // poi chiama una funzione per applicare le festività sulla pagina HTML

    $.ajax({
        url: urlCalendar,
        data: {
            'year': initialMoment.year(),
            'month': month
        },
        method: 'get',
        success: function(data) {
            applyHolidays(data.response);
        },
        error: function() {
            alert("ERRORE! C'è stato un problema nell'accesso ai dati");
        }
    });
} // end function GetAndApplyHolidays()

function handleNavigation(that) {
    // DESCRIZIONE:
    // gestisce il click sui bottoni 'precedente' e 'successivo',
    // abilita o disabilita i pulsanti se necessario,
    // chiama le funzioni per visualizzare il nuovo mese e applicare le festività,
    // riceve in ingresso il riferimento al bottone cliccato

    var currentMonth = initialMoment.month();

    if (that.hasClass('next')) { // è stato cliccato il bottone 'successivo'

        // incremento il mese
        initialMoment.add(1, 'months');
        currentMonth++;
        // visualizzo il nuovo mese
        displayMonth();
        // applico le festività del mese
        GetAndApplyHolidays(currentMonth);

        // abilito/disabilito i bottoni di navigazione
        if (currentMonth == 11) { // mi sono spostato sull'ultimo mese)
            // disabilito il pulsante 'successivo'
            $(that).prop('disabled', true);
        } else if (currentMonth == 1) { // mi sono spostato sul secondo mese
            // abilito il pulsante 'precedente'
            $('.nav-button.prev').prop('disabled', false);
        }

    } else { // è stato cliccato il bottone 'precedente'

        // decremento il mese
        initialMoment.subtract(1, 'months');
        currentMonth--;
        // visualizzo il nuovo mese
        displayMonth();
        // applico le festività del mese
        GetAndApplyHolidays(currentMonth);

        // abilito/disabilito i bottoni di navigazione
        if (currentMonth == 0) { // mi sono spostato sul primo mese)
            // disabilito il pulsante 'precedente'
            $(that).prop('disabled', true);
        } else if (currentMonth == 10) { // mi sono spostato sul penultimo mese
            // abilito il pulsante 'successivo'
            $('.nav-button.next').prop('disabled', false);
        }
    }
} // end function handleNavigation()


function displayMonth() {
    // DESCRIZIONE:
    // visualizza il mese corrente sulla pagina HTML,
    // creando dinamicamente gli elementi, utilizza HANDLEBARS
    // stabilisce da dove iniziare a scrivere i giorni nella griglia
    // in base ad un offset calcolato in base a qual è il giorno della settimana
    // del primo giorno del mese

    // recupero il n. di giorni di cui è composto il mese
    var numberOfDays = initialMoment.daysInMonth();

    // pulisco la pagina, rimuovo i contenuti e lo stile su tutte le celle
    $('#grid-container .cell').empty().removeClass('holiday');

    // aggiorno il titolo del calendario con il nome del mese
    var monthName = initialMoment.format('MMMM');
    $('#month-name').text(monthName);

    // estraggo il giorno della settimana del primo giorno del mese (1=lunedì .. 7=domenica)
    var weekdayNumber = initialMoment.isoWeekday();

    // calcolo l'offset rispetto alla 1a cella della griglia, va da 0 a 6,
    // mi dice da che cella iniziare a visualizzare i giorni del mese
    // lunedì offset=0, .... domenica offset=6
    var offset = weekdayNumber - 1;

    // clono l'oggetto moment che contiene la data del mese corrente
    // il clone mi serve per scorrere i giorni del mese
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
    }
} // end function displayMonth()

function createGrid() {
    // DESCRIZIONE:
    // creo una griglia fissa di 7 colonne X 6 righe (42 celle)

    var gridCell = '<span class="cell"></span>'; // codice HTML da ripetere in pagina

    // ciclo per "gridSize" volte e aggiungo ogni volta il mio elemento HTML
    for (var i = 0; i < gridSize; i++) {
        // appendo, quindi aggiungo in coda, senza sovrascrivere
        $('#grid-container').append(gridCell);
    }
} // end function createGrid()