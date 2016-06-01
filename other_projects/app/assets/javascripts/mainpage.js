window.onload = drawCarousel;

function drawCarousel(){
	$("#carousel1").carouFredSel({
		circular	: false,
		infinite	: false,
		auto 		: false,
		prev : {
			button		: "#carousel1-prev",
			key			: "left",
			duration	: 750
		},
		next : {
			button		: "#carousel1-next",
			key			: "right",
			duration	: 750
		},
		pagination : {
			container	: "#carousel1-pag",
			keys		: true,
			duration	: 750
		},
		swipe : {
			onTouch		: true,
			onMouse		: false
		},
		items: {
			visible: "variable"
		}
	});
}

$(window).resize(drawCarousel);
