var currentIndex = 0;
var slidePosition;

setInterval(function(){
    if (currentIndex < 2) {
        currentIndex ++;
    } else {
        currentIndex = 0;
    }
        slidePosition = currentIndex * (-1275) +"px";
        $(".slideList").animate({left:slidePosition},500);
},5000);