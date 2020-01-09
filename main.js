var now = moment();
console.log("now", now);
var initialMoment = moment('2018-01-01'); // data inizio calendario

$(document).ready(function() {

    displayMonth();

    //intercetto click sui bottoni di navigazione
    $('.nav-button').click(function() {

        // chiamo una funzione per gestire il click
        handleNavigation($(this));

    }); // fine evento click su bottone

});

// ---------------------------- FUNCTIONs --------------------------------------
function handleNavigation(that) {

    if (that.hasClass('next')) {
        // è stato cliccato il bottone 'successivo'
        console.log("clic successivo");
        // verifico se il bottone può essere cliccato
        if (true) {
            // incremento il mese
            initialMoment.add(1, 'months');
            // visualizzo il nuovo mese
            displayMonth();
        } else {
            // eventuae messaggio d'errore
        }


    } else {
        // è stato cliccato il bottone 'precedente'
        console.log("clic precedente");

        // verifico se il bottone può essere cliccato
        if (true) {
            // incremento il mese
            initialMoment.subtract(1, 'months');
            // visualizzo il nuovo mese
            displayMonth();

        } else {
            // eventuae messaggio d'errore
        }
    }

} // end function handleNavigation()



function displayMonth() {

    // recupero il n. di giorni di cui è composto il mese
    var days = initialMoment.daysInMonth();
    console.log("days", days);

    // pulisco la pagina
    $('#month-days').empty();
    // aggiorno il nome del mese
    monthName = initialMoment.format('MMMM');
    $('#month-name').text(monthName);

    // inserisco in modo dinamico tutti i giorni di cui è composto il mese
    for (var dayNumber = 1; dayNumber <= days; dayNumber++) {
        // ------------------------- HANDLEBARS ------------------------------------
        var context = {
            'day': dayNumber,
            'month': monthName
        };
        // recupero il codice html dal template HANDLEBARS
        var monthTemplate = $('#month-template').html();
        // compilo il template HANDLEBARS, lui mi restituisce un funzione
        var monthFunction = Handlebars.compile(monthTemplate);
        // chiamo la funzione generata da HANDLEBARS per popolare il template
        var monthDay = monthFunction(context);
        // aggiungo in pagina il giorno appena creato
        $('#month-days').append(monthDay);
        // ------------------------- HANDLEBARS ------------------------------------
    }
} // end function