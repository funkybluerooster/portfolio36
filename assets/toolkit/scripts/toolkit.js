/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	/**
	 * Toolkit JavaScript
	 * Handles Styleguide functionality, menu, breakpoint toggles
	 */

	'use strict';

	//--------------INITIATE--------------------//
	//Collapse the Menu items & Submenu items
	/*
	$(".f-menu__heading + ul").hide();
	$(".f-menu__subheading > li").hide();*/

	//$(document).ready(function(){

	/*==============================================================*/
	//MENU LIST ITEM HANDLERS
	/*========================================================*/

	//INITIATE
	//Show only the menu-heading that you are currently on
	//Takes the current <pathname> of the url you are on, removes the '/'
	//Then takes that string to be used as a target to open the menu that corresponds
	//to the major heading page you have open

	// 	var url = window.location.href;
	// 	var start = url.lastIndexOf("/");

	// 	var title = url.slice(start + 1, url.length);

	// 	$('a[href="' + title + '"]').next().show();

	// 	//CLick for links on menu: resets the search filter to display all
	// 	$('.f-menu a').click(function(){
	// 		$('#fab_input').val("Search");
	// 		$('#searchAnswer').remove();
	// 		$('.f-item-group').each(function (i){
	// 			$(this).show();
	// 		});
	// 	});

	// 	//Removes the code space when component has no code
	// 	$("code").each(function (i){

	// 		if($(this).html().length === 0){
	// 			$(this).closest(".f-item-group").find("[title='Toggle Code']").remove();
	// 			$(this).parent().parent().remove();
	// 		}
	// 	});

	// });

/***/ }
/******/ ]);