import $ from 'jquery';
import "./pages/index.pug";
import "./stylesheets/main.scss";

console.log("hello world!");
$('h1').on('hover', function () {
	$(this).style({color: 'red'})
})
