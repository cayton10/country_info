# country_info

Displays information about a selected country (currency, population, and flag) using REST API: https://restcountries.eu/
<hr> 

# Netlify Hosted Demo

You can find a test demo here: https://quizzical-raman-bd1134.netlify.com/

# Predictive / Suggestion Text Area

Attempted this with multiple suggestion / autocomplete plugins. What wound up working for me was jQuery UI's autocomplete function. 

The ajax call that sorts all of the capital cities for the '<select>' field also populates a JS object array. This object array is used as the source for suggestions and parsing for the .autocomplete function for countries. 


