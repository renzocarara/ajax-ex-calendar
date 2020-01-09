var now = moment();
console.log("now", now);

var urlCalendar = "https://flynn.boolean.careers/exercises/api/holidays";
var initialMoment = moment('2018-01-01'); // data inizio del calendario
var initialMonth = initialMoment.month(); // mese di inizio del calendario

$(document).ready(function() {

    displayMonth(); // visualizzo il primo mese
    GetAndApplyHolidays(initialMonth); // applico festività

    //intercetto click sui bottoni di navigazione
    $('.nav-button').click(function() {

        // chiamo una funzione per gestire il click
        handleNavigation($(this));

    }); // fine evento click su bottone

});

// ---------------------------- FUNCTIONs --------------------------------------
function applyHolidays(holidaysList) {
    // DESCRIZIONE: applica le festività sul mese corrente

}


function GetAndApplyHolidays(month) {
    // DESCRIZIONE:
    // chiamata AJAX

    $.ajax({
        url: urlCalendar,
        data: {
            'year': initialMoment.year(),
            'month': month
        },
        method: 'get',
        success: function(data) {
            var holidays = data.response;
            console.log("holydays", holidays);
            applyHolidays(data.response);
        },
        error: function() {
            alert("ERRORE! C'è stato un problema nell'accesso ai dati");
        }
    });
} // end function GetAndApplyHolidays()



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
            GetAndApplyHolidays(initialMoment.month());
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
            GetAndApplyHolidays(initialMoment.month());


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