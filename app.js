$(function(){
	$('.slide h3').click(slide);
	$('.slide .close').click(close);
	$('h3, h4, h1').each(function(){
		$(this).css({color: randHex()});
	});
	$('a').each(function(){
		$(this).css({color: randHex()});
	});
});


function close(){
	$(this).parent().slideToggle();
}

function slide(e){
	$(this).next('.content').slideToggle();
}

function randHex(){
	var num = Math.floor(Math.random()*8777215+8000000);
	return '#'+num.toString(16);
}