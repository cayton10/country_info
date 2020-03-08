/* ------------------------- when document is ready ------------------------- */

$(document).ready(function(){

    /* -------------------------- declare dropdown var -------------------------- */

    let dropdown = $('#capital-dropdown');
    dropdown.append('<option selected="true" disabled>Choose Capital City</option>');

    /* ------------------- restCountries API for ALL countries ------------------ */
              //Filter results for only what is needed for this application//
    const allCity = 'https://restcountries.eu/rest/v2/all?fields=name;capital;currencies;flag;population'
    const allName = 'https://restcountries.eu/rest/v2/all?fields=name' 
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
            //Function to populate #country-name text input field and other info
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
                                    $('#currency-code').val('Code: ' + entry.currencies[0].code);
                                    $('#currency-name').val('Name: ' + entry.currencies[0].name);
                                    $('#currency-sym').val('Symbol: ' + entry.currencies[0].symbol);
                                    $('#flag').html("<img class='added-img' src='" + entry.flag + "' />");
                                    $('#pop').val(entry.name + ' population: ' + entry.population.toLocaleString("en-US"));
                                                                                //Found '.toLocaleString' on Stack Overflow forum
                                                                                //https://stackoverflow.com/questions/52795097/json-numbers-formatted-with-commas
                                }
                            });
                        }
                    });
            });
        });
    });

    /* -------------------------------------------------------------------------- */
    /*                             TEXT INPUT FUNCTION                            */
    /* -------------------------------------------------------------------------- */
    
    /*var countries = new Bloodhound({
        datumTokenizer: function(countries) {
            return Bloodhound.tokenizers.whitespace(countries.value);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        limit: 3,
        prefetch: allName,
        remote: {
          url: allName,
          wildcard: '%QUERY',
          filter: function(response){
              return response.countries;
          }
        }
      });

      // init suggestion engine
      countries.initialize();
      
      $('#country-text').typeahead(
        {   hint: true, 
            highlight: true,
            minLength: 1
        },
        {
          name: 'countries',
          displayKey: function(countries) {
              return countries.name;
          },
        });
        source: countries.ttAdapter()*/


        //Prevent default 'enter' keystroke event//
        $('#country-text').keypress(function (event){
            //Keycode 13 == 'return or enter'
            //Must preventDefault to keep from reloading page
            if (event.keyCode === 13) {
                event.preventDefault();
                var country = $('#country-text').val();
                console.log(country);
            }
            //If user presses enter key...
            if (event.keyCode === 13) {
                $.ajax(//Ajax call to restcountries
                    {
                        //Partial name version does not work since results are specific
                        url: 'https://restcountries.eu/rest/v2/name/' + country + '?fullText=true',
                        dataType: 'json',
                        method: 'get',
                        data: 'none',
                        success: function(data)
                        {
                            $.each(data, function(key, entry)//iterate through countries API. 
                            {       //Ignore case
                                if (country.toLowerCase() == entry.name.toLowerCase()) //If selected capital city == capital from API...
                                {   //Spit out all of this info on identified tabs
                                    $('#capital-dropdown').val(entry.capital);
                                    $('#currency-code').val('Code: ' + entry.currencies[0].code);
                                    $('#currency-name').val('Name: ' + entry.currencies[0].name);
                                    $('#currency-sym').val('Symbol: ' + entry.currencies[0].symbol);
                                    $('#flag').html("<img class='added-img' src='" + entry.flag + "' />");
                                    $('#pop').val(entry.name + ' population: ' + entry.population.toLocaleString("en-US"));
                                                                               
                                }
                            });
                        },
                        //error handling for misspelled or other
                        error: function(xhr){
                            alert(xhr.status + ": No country by that name. You can check your spelling here: " + allName);
                        }
                         
                    });
            }
        });
});