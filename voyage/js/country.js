/* ------------------------- when document is ready ------------------------- */

$(document).ready(function(){
    /* -------------------------- declare dropdown var -------------------------- */

    let dropdown = $('#capital-dropdown');
    dropdown.append('<option selected="true" disabled>Choose Capital City</option>');
    var nameArray = [];
    var country;
    //currency code variable declaration
    var code;
    var symbol;
    $('#error').hide();

    /* ------------------- restCountries API for ALL countries ------------------ */
              //Filter results for only what is needed for this application//
    const allCity = 'https://restcountries.eu/rest/v2/all?fields=name;capital;currencies;flag;population'
    const autoAPI = 'https://restcountries.eu/rest/v2/' + country + '?fields=name;capital;currencies;flag;population'
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
                dropdown.append($('<option></option>').text(entry.capital).attr('country', entry.name));//Append to select <option>s
                nameArray.push(entry.name);
            }   //Populate suggestion array                                //Add attr to option with country of index
        });
            //Function to populate #country-name text input field and other info
        $(dropdown).change(function (){
            var city = $(this).val(); //Store selected capital in variable 'city'
            var country = $('option:selected', this).attr('country');
            //Ajax call to rest countries API
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
                                $('#country-text').val(country);
                                $('#currency-code').val('Code: ' + entry.currencies[0].code);
                                //Capture currency code in variable for USD conversion
                                code = entry.currencies[0].code;
                                $('#currency-name').val('Name: ' + entry.currencies[0].name);
                                $('#currency-sym').val('Symbol: ' + entry.currencies[0].symbol);
                                symbol = entry.currencies[0].symbol;
                                $('#flag').html("<img class='added-img' src='" + entry.flag + "' />");
                                $('#pop').val(entry.name + ' pop: ' + entry.population.toLocaleString("en-US"));
                                                                            //Found '.toLocaleString' on Stack Overflow forum
                                                                            //https://stackoverflow.com/questions/52795097/json-numbers-formatted-with-commas
                            }
                        });
                    }
                });
            //Ajax call to free.currconv API
            $.ajax(
                {
                    url: 'https://free.currconv.com/api/v7/convert?q=' + code + '_USD&compact=ultra&apiKey=0efe8ba1797af83c25f7',
                    dataType: 'json',
                    method: 'get',
                    data: 'none',
                    success: function(data)
                    {
                        $.each(data, function(key, entry)
                        {
                            $('#currency-conv').val(symbol + "1.00 = $" + entry.toFixed(2));
                        });
                    }
                });
        }); 
    });

    /* -------------------------------------------------------------------------- */
    /*                             TEXT INPUT FUNCTION                            */
    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                    fix autocomplete suggestion box width                   */
    /* ------------------------------ pulled from: ------------------------------ */
    /*https://info.michael-simons.eu/2013/05/02/how-to-fix-jquery-uis-autocomplete-width/*/
    /* -------------------------------------------------------------------------- */
    $.extend($.ui.autocomplete.prototype.options, {
        open: function(event, ui) {
            $(this).autocomplete("widget").css({
                "width": ($(this).width() + "px")
            });
        }
    });
    /* -------------------------- autocomplete function ------------------------- */

    $('#country-text').autocomplete({
        minLength: 2,
        source: nameArray, //Uses previously stored array of objects for reference
        select: function(event, ui) //Upon selection of country () =>
        {   
            console.log($('#country-text').val()); //Print name of country to console
            var country = $('#country-text').val(); //Store selected country name for use in ajax call
 
            $.ajax(//Ajax call to restcountries)
                    {                                                  //insert country name into url - filter resutls for callbacks
                        url: 'https://restcountries.eu/rest/v2/name/' + country + '?fullText=true',
                        dataType: 'json',
                        method: 'get',
                        data: 'none',
                        success: function(data)
                        {
                            $.each(data, function(key, entry)//iterate through countries API. 
                                {      
                                    {   //Spit out all of this info on identified tabs
                                        $('#capital-dropdown').val(entry.capital);
                                        $('#currency-code').val('Code: ' + entry.currencies[0].code);
                                        //Capture currency code in variable for USD conversion
                                        code = entry.currencies[0].code;
                                        $('#currency-name').val('Name: ' + entry.currencies[0].name);
                                        $('#currency-sym').val('Symbol: ' + entry.currencies[0].symbol);
                                        symbol = entry.currencies[0].symbol;
                                        $('#flag').html("<img class='added-img' src='" + entry.flag + "' />");
                                        $('#pop').val(entry.name + ' pop: ' + entry.population.toLocaleString("en-US"));                                             
                                    }
                                });
                        }

                    });
                //Ajax call to free.currconv API
            $.ajax(
                {
                    url: 'https://free.currconv.com/api/v7/convert?q=' + code + '_USD&compact=ultra&apiKey=0efe8ba1797af83c25f7',
                    dataType: 'json',
                    method: 'get',
                    data: 'none',
                    success: function(data)
                    {
                        $.each(data, function(key, entry)
                        {
                            $('#currency-conv').val(symbol + "1.00 = $" + entry.toFixed(2));
                        });
                    }
                });
        }
    });



        //Prevent default 'enter' keystroke event//
        $('#country-text').keypress(function (event){
            //Keycode 13 == 'return or enter'
            //Must preventDefault to keep from reloading page
            if (event.keyCode === 13) {
                event.preventDefault();
                var country = $('#country-text').val(); //Set value of country var to input field after 'keypress 13' / 'enter'
                console.log(country); //Prints to console for debugging
            }
            //If user presses enter key... Send ajax call
            if (event.keyCode === 13) {
                $.ajax(//Ajax call to restcountries
                    {
                        //Partial name version does not work since results are specific
                        url: 'https://restcountries.eu/rest/v2/name/' + country, //+ '?fullText=true',
                        dataType: 'json',
                        method: 'get',
                        data: 'none',
                        success: function(data)
                        {
                            $.each(data, function(key, entry)//iterate through countries API. 
                            {       //Ignore case && if user input is substring of data, appropriate function
                                if (entry.name.toLowerCase().indexOf(country.toLowerCase()) >= 0) //Did this because of certain
                                                                                                  //country names like 'Russian Federation'
                                                                                                  //You couldn't just search 'russia' and
                                                                                                  //recieve information about the country.
                                {   //Spit out all of this info on identified tabs
                                    $('#capital-dropdown').val(entry.capital);
                                    $('#currency-code').val('Code: ' + entry.currencies[0].code);
                                    //Capture currency code in variable for USD conversion
                                    code = entry.currencies[0].code;
                                    $('#currency-name').val('Name: ' + entry.currencies[0].name);
                                    $('#currency-sym').val('Symbol: ' + entry.currencies[0].symbol);
                                    symbol = entry.currencies[0].symbol;
                                    $('#flag').html("<img class='added-img' src='" + entry.flag + "' />");
                                    $('#pop').val(entry.name + ' pop: ' + entry.population.toLocaleString("en-US"));                                             
                                }
                            });
                        },
                        //error handling for misspelled or other
                        error: function(){
                            $('#error').show("drop", {direction: "down" }, 400);
                        }
                         
                    });
                $.ajax(
                    {
                        url: 'https://free.currconv.com/api/v7/convert?q=' + code + '_USD&compact=ultra&apiKey=0efe8ba1797af83c25f7',
                        dataType: 'json',
                        method: 'get',
                        data: 'none',
                        success: function(data)
                        {
                            $.each(data, function(key, entry)
                            {
                                $('#currency-conv').val(symbol + "1.00 = $" + entry.toFixed(2));
                            });
                        }
                    });
            }
        });

    /* ---------------------- Reset error message dropdown ---------------------- */
        $('#country-text').click(function(){
            if ($('#error') != 'hidden') {
                $('#error').hide("drop", {direction: "up" }, 200);
            }
        });
        
});