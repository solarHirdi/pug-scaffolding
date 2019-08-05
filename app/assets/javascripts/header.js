$('.header__catalog [data-toggle="dropdown"]').on("click", function(event) {
	event.preventDefault();
	event.stopPropagation();
	$(this).siblings().toggleClass("show");
	$(this).parents('.dropdown-menu').first().find('.show').not($(this).siblings()).removeClass('show');
});

