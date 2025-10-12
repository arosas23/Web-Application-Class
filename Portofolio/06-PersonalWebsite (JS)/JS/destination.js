const btnTop = document.getElementById("btnTop");
window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        btnTop.style.display = "block";
    } else {
        btnTop.style.display = "none";
    } 
};  

btnTop.onclick = function() {
    window.scrollTo({top: 0, behavior: 'smooth'});
};