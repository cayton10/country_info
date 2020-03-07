/* ------------------------- when document is ready ------------------------- */

$(document).ready(function(){

    /* -------------------------- declare dropdown var -------------------------- */

    let dropdown = $('#capital-dropdown');
    dropdown.append('<option selected="true" disabled>Choose Capital City</option>');

    /* ------------------- restCountries API for ALL countries ------------------ */

    const allCity = 'https://restcountries.eu/rest/v2/all'

    /* --------------------- populate dropdown w/ json data --------------------- */
    /* ------------------- $.getJSON() shorthand for $.ajax() ------------------- */

    $.getJSON(allCity, function (data) {

    /* ---------------------- sort capital cities by alpha ---------------------- */
    /*                         sort logic researched from                         */
    /*        https://gabrieleromanato.name/jquery-sorting-json-objects-in-ajax   */
    /* -------------------------------------------------------------------------- */
        var sortedCity = data.sort(function (a, b) {
            if (a.capital > b.capital) {
                return 1;
            }
            if (a.capital < b.capital) {
                return -1;
            }

            return 0;
        });
                //Loop through JSON capitals
        $.each(sortedCity, function (key, entry) {
            //There are some empty capital values for locales such as Antarctica
            if (entry.capital !== ''){
                dropdown.append($('<option></option>').text(entry.capital));//Append to select <option>s
            }
            //Function to populate country name text input field
            $('#capital-dropdown').change(function (){
                var city = $(this).val(); //Store selected capital in variable 'city'
                $.ajax(
                    {
                        url: 'https://restcountries.eu/rest/v2/capital/' + city,
                        dataType: 'json',
                        method: 'get',
                        data: 'none',
                        success: function(data)
                        {
                            $.each(data, function(key, entry)//iterate through countries API. 
                            {
                                if (city == entry.capital) //If selected capital city == capital from API...
                                {   //Spit out all of this info on identified tabs
                                    $('#country-text').val(entry.name);
                                    $('#currency').html(entry.currencies[0].code + '<br>' + entry.currencies[0].name + '<br>' + entry.currencies[0].symbol) ;
                                    $('#flag').html("<img class='added-img' src='" + entry.flag + "' />");
                                    $('#pop').html(entry.name + ' population: ' + entry.population.toLocaleString("en-US"));
                                                                                //Found '.toLocaleString' on Stack Overflow forum
                                                                                //https://stackoverflow.com/questions/52795097/json-numbers-formatted-with-commas
                                }
                            });
                        }
                    });
            });
        });
    });

/* --------------------- country-dropdown event listener -------------------- */
    $('#country-dropdown').change(function (){
        //Capture dropdown value into variable
        var countryName = $(this).val();
        $.ajax()
    })


});