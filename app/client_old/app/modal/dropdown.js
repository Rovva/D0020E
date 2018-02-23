/* Dropdown functionality in the modals */

function dropdownClick(name) {
    /* open the dropdown menu */
    document.getElementById(name).classList.toggle("show");
}


window.onclick = function(event) {
    /* Close the dropdown menu if the user clicks outside of it */
    if (!event.target.matches('.dropbtn')) {
        
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
              openDropdown.classList.remove('show');
          }
        }
  }
}

function displayContentsDropdown(buttonName, value) 
{
    document.getElementById(buttonName).innerHTML = value; 
}