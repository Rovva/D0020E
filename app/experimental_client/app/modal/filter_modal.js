/* Functionality for modals. These are the windows in which you create/update filters */

// The two modals
var modalFilter = document.getElementById('filter_modal');
var updateModal = document.getElementById('update_filter_modal');

// When the user clicks on <span> (x), close the modal
var closeModal = function(modalName) {
    document.getElementById(modalName).style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    modal = event.target;
    if (modal == modalFilter || modal == updateModal) {
        modal.style.display = "none";
    }
}