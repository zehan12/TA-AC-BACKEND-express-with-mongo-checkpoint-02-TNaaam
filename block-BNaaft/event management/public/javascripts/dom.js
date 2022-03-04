var hide = document.querySelector(".hide");
var wi_40 = document.querySelector(".wi-40");
var compStyles = window.getComputedStyle(wi_40);

hide.addEventListener('click',()=>{
    if ( compStyles.getPropertyValue('display') === 'block' ){
        wi_40.style.display = "none"
    } else {
        wi_40.style.display = "block"
    }
});