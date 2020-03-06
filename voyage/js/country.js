/* ------------------------- when document is ready ------------------------- */

$(document).ready(function(){

/* -------------------------- declare dropdown var -------------------------- */

    let dropdown = $('#country-dropdown');

    dropdown.empty();

    dropdown.append('<option selected="true" disabled>Choose Country</option>');
    dropdown.prop('selectedIndex', 0);

    /* ------------------- restCountries API for ALL countries ------------------ */

    const url = 'https://restcountries.eu/rest/v2/all'

    /* --------------------- populate dropdown w/ json data --------------------- */
    $.getJSON(url, function (data) {
        $.each(data, function (key, entry) {
            dropdown.append($('<option></option>').attr('value', entry.alpha2Code).text(entry.name));
        })
    });

});