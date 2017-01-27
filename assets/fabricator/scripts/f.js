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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);
	var patternStatusCollection = __webpack_require__(2); //Loads the list of ID's of new patterns from patternStatus.js

	/**
	 * Global `fabricator` object
	 * @namespace
	 */
	var fabricator = window.fabricator = {};

	//Global PatternStatus
	//Gets patterns
	var status_New = patternStatusCollection.getNewPatterns();
	var status_Caution = patternStatusCollection.getCautionPatterns();
	var status_PFT = patternStatusCollection.getPftPatterns();
	var windowlocation = window.location.pathname;
	windowlocation = windowlocation.substr(windowlocation.lastIndexOf('/') + 1);
	//Gets path to be used to attach tags only when on the correct page

	fabricator.getNewPatterns = function () {
		return status_New;
	};
	fabricator.getCautionPatterns = function () {
		return status_Caution;
	};
	fabricator.getPFTPatterns = function () {
		return status_PFT;
	};

	/**
	 * Default options
	 * @type {Object}
	 */
	fabricator.options = {
		toggles: {
			labels: true,
			notes: true,
			code: false
		},
		menu: false,
		mq: '(min-width: 60em)'
	};

	// open menu by default if large screen
	fabricator.options.menu = window.matchMedia(fabricator.options.mq).matches;

	/**
	 * Feature detection
	 * @type {Object}
	 */
	fabricator.test = {};

	// test for sessionStorage
	fabricator.test.sessionStorage = (function () {
		var test = '_f';
		try {
			sessionStorage.setItem(test, test);
			sessionStorage.removeItem(test);
			return true;
		} catch (e) {
			return false;
		}
	})();

	// create storage object if it doesn't exist; store options
	if (fabricator.test.sessionStorage) {
		sessionStorage.fabricator = sessionStorage.fabricator || JSON.stringify(fabricator.options);
	}

	/**
	 * Cache DOM
	 * @type {Object}
	 */
	fabricator.dom = {
		root: document.querySelector('html'),
		primaryMenu: document.querySelector('.f-menu'),
		menuItems: document.querySelectorAll('.f-menu li a'),
		menuToggle: document.querySelector('.f-menu-toggle')
	};

	/**
	 * Get current option values from session storage
	 * @return {Object}
	 */
	fabricator.getOptions = function () {
		return fabricator.test.sessionStorage ? JSON.parse(sessionStorage.fabricator) : fabricator.options;
	};

	/**
	 * Build color chips
	 */
	fabricator.buildColorChips = function () {

		var chips = document.querySelectorAll('.f-color-chip'),
		    color;

		for (var i = chips.length - 1; i >= 0; i--) {
			color = chips[i].querySelector('.f-color-chip__color').innerHTML;
			chips[i].style.borderTopColor = color;
			chips[i].style.borderBottomColor = color;
		}

		return this;
	};

	/**
	 * Add `f-active` class to active menu item
	 */
	fabricator.setActiveItem = function () {

		/**
	  * @return {Array} Sorted array of menu item 'ids'
	  */
		var parsedItems = function parsedItems() {

			var items = [],
			    id,
			    href;

			for (var i = fabricator.dom.menuItems.length - 1; i >= 0; i--) {

				// remove active class from items
				fabricator.dom.menuItems[i].classList.remove('f-active');

				// get item href
				href = fabricator.dom.menuItems[i].getAttribute('href');

				// get id
				if (href.indexOf('#') > -1) {
					id = href.split('#').pop();
				} else {
					id = href.split('/').pop().replace(/\.[^/.]+$/, '');
				}
				items.push(id);
			}

			return items.reverse();
		};

		/**
	  * Match the 'id' in the window location with the menu item, set menu item as active
	  */
		var setActive = function setActive() {

			var href = window.location.href,
			    items = parsedItems(),
			    id,
			    index,
			    name,
			    menuSelection;

			// get window 'id'
			if (href.indexOf('#') > -1) {
				id = window.location.hash.replace('#', '');
			} else {
				id = window.location.pathname.split('/').pop().replace(/\.[^/.]+$/, '');
			}

			// In case the first menu item isn't the index page.
			if (id === '') {
				id = 'index';
			}

			var menuArray = id.split('.');
			// find the window id in the items array
			index = items.indexOf(id) > -1 ? items.indexOf(id) : 0;
			menuSelection = fabricator.dom.menuItems[index];
			// set the matched item as active
			//fabricator.dom.menuItems[index] = <a>
			menuSelection.classList.add('f-active');

			//Check if link is directed to main menu heading
			if (menuSelection.classList.contains('f-menu__heading')) {
				if (menuSelection.nextElementSibling != null) menuSelection.nextElementSibling.classList.remove('hidden');
			} else if (menuArray.length === 1) {
				menuSelection.parentNode.parentNode.parentNode.classList.remove('hidden');
				//If sub-menu item has children
				if (menuSelection.nextElementSibling != null) {
					//if submenu has an arrow
					menuSelection.nextElementSibling.classList.remove('f-menu-arrow-up');
					menuSelection.nextElementSibling.classList.add('f-menu-arrow-down'); //flip arrow
					menuSelection.parentNode.parentNode.querySelector('.f-menu-container').classList.remove('hidden');
					//expand menu
				}
			} else {
				//If link is to sub-menu child item

				//Container for sub-menu <li> items
				menuSelection.parentNode.parentNode.classList.remove('hidden');
				//Top level <ul>
				menuSelection.parentNode.parentNode.parentNode.parentNode.classList.remove('hidden');

				//flip arrow
				var tempString = 'arrow-' + id.split('.')[0];
				var el = document.getElementById(tempString);
				el.classList.remove('f-menu-arrow-up');
				el.classList.add('f-menu-arrow-down');
			}
		};

		window.addEventListener('hashchange', setActive);

		setActive();

		return this;
	};

	/**
	 * Click handler to primary menu toggle
	 * @return {Object} fabricator
	 */
	fabricator.menuToggle = function () {

		// shortcut menu DOM
		var toggle = fabricator.dom.menuToggle;

		var options = fabricator.getOptions();

		// toggle classes on certain elements
		var toggleClasses = function toggleClasses() {
			options.menu = !fabricator.dom.root.classList.contains('f-menu-active');
			fabricator.dom.root.classList.toggle('f-menu-active');
			//Gets maxWidth
			var maxWidth = parseInt(jQuery('body').css('max-width'));

			/*If the menu is active or not */
			if (fabricator.dom.root.classList.contains('f-menu-active')) {}

			if (fabricator.test.sessionStorage) {
				sessionStorage.setItem('fabricator', JSON.stringify(options));
			}
		};

		// Toggles Hamburger Menu
		toggle.addEventListener('click', function () {

			toggleClasses();
		});

		// close menu when clicking on item (for collapsed menu view)
		var closeMenu = function closeMenu() {
			if (!window.matchMedia(fabricator.options.mq).matches) {
				toggleClasses();
			}
		};

		for (var i = 0; i < fabricator.dom.menuItems.length; i++) {
			fabricator.dom.menuItems[i].addEventListener('click', closeMenu);
		}

		return this;
	};
	/**============================
	attachTag function
	=============================
	 * Handler for showing new tags
	 * Updated 10/20/2016 2016
	 * Contact: samuel_li@ti.com
	 *
	 * Paramaters: array of a list of pattern urls, string of class name that identifies what style to put the tag
	 * Options: 'new', 'caution', 'pft' are classNames to designate which tag to attach
	 * Reads the array of Pattern URL's found in src/data/patternStatus.js
	 * Iterates through the URLs in that array
	 * And appends the <span class="f-item-tag new"></span> to the '.f-item-control' of that Pattern if it's ID is found on the page
	 * Appends the <span class="f-menu-tag new"></span> to the menu
	 * Style found in fabricator/styles/partials/_controls.scss
	 *
	 * @return {Object} fabricator
	 */
	fabricator.attachTag = function (array, className) {
		var elementArray = array;
		//Loads the PatternStatus Array (getArray function is found in data/patternStatus.js)

		//Create Tag Element: <span class="f-item-tag new"></span>
		var spanElement = document.createElement('span');
		spanElement.className = 'f-item-tag ' + className; //attach classes

		//Prepare className text to be added to the menuitem
		var classname = ' ' + className;

		var elementURL; // The pattern URL
		var elementID; // The ID that the pattern has
		var elementPage; //The page that the pattern is located on
		var element1; //Actual pattern on the page
		var menuElement;
		for (var i = 0; i < elementArray.length; i++) {
			elementURL = elementArray[i].split('#'); // Splits the pattern url into two objects '[05-elements.html]#[buttons.filter]'

			//If the pattern's page property matches the current page the user is on
			if (elementURL[0] === windowlocation) {

				if (document.getElementById(elementURL[1]) != null) {
					element1 = document.getElementById(elementURL[1]);
					var clone = spanElement.cloneNode(); //Clone the span element we created so we can append it to the .f-item-controls
					element1 = element1.querySelector('.f-item-controls');
					if (element1 != null) {
						element1.appendChild(clone);
					} else {
						console.log('ERROR - AttachStatus: ' + elementURL + ' not found');
					}

					//Attach menu span to menu tag
					//clone = spanMenuElement.cloneNode();
					menuElement = document.getElementById('menu-' + elementURL[1]);
					if (menuElement != null) {
						//menuElement.appendChild(clone);
						menuElement.className += classname;
						menuElement = null;
					}
				} else {
					console.log('ERROR: cannot attach pattern status tag to [' + elementURL[1] + '] as is not found, check URL for the pattern in src/data/patternStatus.js');
				}
			}
		}
		return this;
	};

	/**
	 * Handler for preview and code toggles
	 * @return {Object} fabricator
	 */
	fabricator.allItemsToggles = function () {

		var items = {
			labels: document.querySelectorAll('[data-f-toggle="labels"]'),
			notes: document.querySelectorAll('[data-f-toggle="notes"]'),
			code: document.querySelectorAll('[data-f-toggle="code"]')
		};

		var toggleAllControls = document.querySelectorAll('.f-controls [data-f-toggle-control]');

		var options = fabricator.getOptions();

		// toggle all
		var toggleAllItems = function toggleAllItems(type, value) {

			var button = document.querySelector('.f-controls [data-f-toggle-control=' + type + ']'),
			    _items = items[type];

			for (var i = 0; i < _items.length; i++) {
				if (value) {
					_items[i].classList.remove('f-item-hidden');
				} else {
					_items[i].classList.add('f-item-hidden');
				}
			}

			// toggle styles
			if (value) {
				button.classList.add('f-active');
			} else {
				button.classList.remove('f-active');
			}

			// update options
			options.toggles[type] = value;

			if (fabricator.test.sessionStorage) {
				sessionStorage.setItem('fabricator', JSON.stringify(options));
			}
		};

		for (var i = 0; i < toggleAllControls.length; i++) {

			toggleAllControls[i].addEventListener('click', function (e) {

				// extract info from target node
				var type = e.currentTarget.getAttribute('data-f-toggle-control'),
				    value = e.currentTarget.className.indexOf('f-active') < 0;

				// toggle the items
				toggleAllItems(type, value);
			});
		}

		// persist toggle options from page to page
		for (var toggle in options.toggles) {
			if (options.toggles.hasOwnProperty(toggle)) {
				toggleAllItems(toggle, options.toggles[toggle]);
			}
		}

		return this;
	};

	/**
	 * Handler for single item code toggling
	 */
	fabricator.singleItemToggle = function () {

		var itemToggleSingle = document.querySelectorAll('.f-item-group [data-f-toggle-control]');

		// toggle single
		var toggleSingleItemCode = function toggleSingleItemCode(e) {
			var group = this.parentNode.parentNode.parentNode,
			    type = e.currentTarget.getAttribute('data-f-toggle-control');

			group.querySelector('[data-f-toggle=' + type + ']').classList.toggle('f-item-hidden');
		};

		for (var i = 0; i < itemToggleSingle.length; i++) {
			itemToggleSingle[i].addEventListener('click', toggleSingleItemCode);
		}

		return this;
	};

	/**
	 * Automatically select code when code block is clicked
	 */

	fabricator.bindCodeAutoSelect = function () {

		var codeBlocks = document.querySelectorAll('.f-item-code');
		/*
	 var select = function (block) {
	 	var selection = window.getSelection();
	 	var range = document.createRange();
	 	range.selectNodeContents(block.querySelector('code'));
	 	selection.removeAllRanges();
	 	selection.addRange(range);
	 };
	 
	 for (var i = codeBlocks.length - 1; i >= 0; i--) {
	 	codeBlocks[i].addEventListener('click', select.bind(this, codeBlocks[i]));
	 }*/
	};

	/**
	 * Open/Close menu based on session var.
	 * Also attach a media query listener to close the menu when resizing to smaller screen.
	 */
	fabricator.setInitialMenuState = function () {

		// root element
		var root = document.querySelector('html');

		var mq = window.matchMedia(fabricator.options.mq);

		// if small screen
		var mediaChangeHandler = function mediaChangeHandler(list) {
			if (!list.matches) {
				root.classList.remove('f-menu-active');
			} else {
				if (fabricator.getOptions().menu) {
					root.classList.add('f-menu-active');
				} else {
					root.classList.remove('f-menu-active');
				}
			}
		};

		mq.addListener(mediaChangeHandler);
		mediaChangeHandler(mq);

		return this;
	};

	/**
	 * Initialization
	 */
	(function () {

		// invoke
		fabricator.setInitialMenuState().menuToggle().allItemsToggles().singleItemToggle().buildColorChips().setActiveItem().attachTag(status_New, 'new').attachTag(status_Caution, 'caution').attachTag(status_PFT, 'pft');
	})();

/***/ },
/* 1 */
/***/ function(module, exports) {

	/* http://prismjs.com/download.html?themes=prism&languages=markup+css+clike+javascript */
	'use strict';

	self = typeof window !== 'undefined' ? window // if in browser
	: typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope ? self // if in worker
	: {} // if in node js
	;

	/**
	 * Prism: Lightweight, robust, elegant syntax highlighting
	 * MIT license http://www.opensource.org/licenses/mit-license.php/
	 * @author Lea Verou http://lea.verou.me
	 */

	var Prism = (function () {

		// Private helper vars
		var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;

		var _ = self.Prism = {
			util: {
				encode: function encode(tokens) {
					if (tokens instanceof Token) {
						return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
					} else if (_.util.type(tokens) === 'Array') {
						return tokens.map(_.util.encode);
					} else {
						return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
					}
				},

				type: function type(o) {
					return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
				},

				// Deep clone a language definition (e.g. to extend it)
				clone: function clone(o) {
					var type = _.util.type(o);

					switch (type) {
						case 'Object':
							var clone = {};

							for (var key in o) {
								if (o.hasOwnProperty(key)) {
									clone[key] = _.util.clone(o[key]);
								}
							}

							return clone;

						case 'Array':
							return o.map(function (v) {
								return _.util.clone(v);
							});
					}

					return o;
				}
			},

			languages: {
				extend: function extend(id, redef) {
					var lang = _.util.clone(_.languages[id]);

					for (var key in redef) {
						lang[key] = redef[key];
					}

					return lang;
				},

				/**
	    * Insert a token before another token in a language literal
	    * As this needs to recreate the object (we cannot actually insert before keys in object literals),
	    * we cannot just provide an object, we need anobject and a key.
	    * @param inside The key (or language id) of the parent
	    * @param before The key to insert before. If not provided, the function appends instead.
	    * @param insert Object with the key/value pairs to insert
	    * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
	    */
				insertBefore: function insertBefore(inside, before, insert, root) {
					root = root || _.languages;
					var grammar = root[inside];

					if (arguments.length == 2) {
						insert = arguments[1];

						for (var newToken in insert) {
							if (insert.hasOwnProperty(newToken)) {
								grammar[newToken] = insert[newToken];
							}
						}

						return grammar;
					}

					var ret = {};

					for (var token in grammar) {

						if (grammar.hasOwnProperty(token)) {

							if (token == before) {

								for (var newToken in insert) {

									if (insert.hasOwnProperty(newToken)) {
										ret[newToken] = insert[newToken];
									}
								}
							}

							ret[token] = grammar[token];
						}
					}

					// Update references in other language definitions
					_.languages.DFS(_.languages, function (key, value) {
						if (value === root[inside] && key != inside) {
							this[key] = ret;
						}
					});

					return root[inside] = ret;
				},

				// Traverse a language definition with Depth First Search
				DFS: function DFS(o, callback, type) {
					for (var i in o) {
						if (o.hasOwnProperty(i)) {
							callback.call(o, i, o[i], type || i);

							if (_.util.type(o[i]) === 'Object') {
								_.languages.DFS(o[i], callback);
							} else if (_.util.type(o[i]) === 'Array') {
								_.languages.DFS(o[i], callback, i);
							}
						}
					}
				}
			},

			highlightAll: function highlightAll(async, callback) {
				var elements = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code');

				for (var i = 0, element; element = elements[i++];) {
					_.highlightElement(element, async === true, callback);
				}
			},

			highlightElement: function highlightElement(element, async, callback) {
				// Find language
				var language,
				    grammar,
				    parent = element;

				while (parent && !lang.test(parent.className)) {
					parent = parent.parentNode;
				}

				if (parent) {
					language = (parent.className.match(lang) || [, ''])[1];
					grammar = _.languages[language];
				}

				if (!grammar) {
					return;
				}

				// Set language on the element, if not present
				element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

				// Set language on the parent, for styling
				parent = element.parentNode;

				if (/pre/i.test(parent.nodeName)) {
					parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
				}

				var code = element.textContent;

				if (!code) {
					return;
				}

				code = code.replace(/^(?:\r?\n|\r)/, '');

				var env = {
					element: element,
					language: language,
					grammar: grammar,
					code: code
				};

				_.hooks.run('before-highlight', env);

				if (async && self.Worker) {
					var worker = new Worker(_.filename);

					worker.onmessage = function (evt) {
						env.highlightedCode = Token.stringify(JSON.parse(evt.data), language);

						_.hooks.run('before-insert', env);

						env.element.innerHTML = env.highlightedCode;

						callback && callback.call(env.element);
						_.hooks.run('after-highlight', env);
					};

					worker.postMessage(JSON.stringify({
						language: env.language,
						code: env.code
					}));
				} else {
					env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

					_.hooks.run('before-insert', env);

					env.element.innerHTML = env.highlightedCode;

					callback && callback.call(element);

					_.hooks.run('after-highlight', env);
				}
			},

			highlight: function highlight(text, grammar, language) {
				var tokens = _.tokenize(text, grammar);
				return Token.stringify(_.util.encode(tokens), language);
			},

			tokenize: function tokenize(text, grammar, language) {
				var Token = _.Token;

				var strarr = [text];

				var rest = grammar.rest;

				if (rest) {
					for (var token in rest) {
						grammar[token] = rest[token];
					}

					delete grammar.rest;
				}

				tokenloop: for (var token in grammar) {
					if (!grammar.hasOwnProperty(token) || !grammar[token]) {
						continue;
					}

					var patterns = grammar[token];
					patterns = _.util.type(patterns) === 'Array' ? patterns : [patterns];

					for (var j = 0; j < patterns.length; ++j) {
						var pattern = patterns[j],
						    inside = pattern.inside,
						    lookbehind = !!pattern.lookbehind,
						    lookbehindLength = 0,
						    alias = pattern.alias;

						pattern = pattern.pattern || pattern;

						for (var i = 0; i < strarr.length; i++) {
							// Don’t cache length as it changes during the loop

							var str = strarr[i];

							if (strarr.length > text.length) {
								// Something went terribly wrong, ABORT, ABORT!
								break tokenloop;
							}

							if (str instanceof Token) {
								continue;
							}

							pattern.lastIndex = 0;

							var match = pattern.exec(str);

							if (match) {
								if (lookbehind) {
									lookbehindLength = match[1].length;
								}

								var from = match.index - 1 + lookbehindLength,
								    match = match[0].slice(lookbehindLength),
								    len = match.length,
								    to = from + len,
								    before = str.slice(0, from + 1),
								    after = str.slice(to + 1);

								var args = [i, 1];

								if (before) {
									args.push(before);
								}

								var wrapped = new Token(token, inside ? _.tokenize(match, inside) : match, alias);

								args.push(wrapped);

								if (after) {
									args.push(after);
								}

								Array.prototype.splice.apply(strarr, args);
							}
						}
					}
				}

				return strarr;
			},

			hooks: {
				all: {},

				add: function add(name, callback) {
					var hooks = _.hooks.all;

					hooks[name] = hooks[name] || [];

					hooks[name].push(callback);
				},

				run: function run(name, env) {
					var callbacks = _.hooks.all[name];

					if (!callbacks || !callbacks.length) {
						return;
					}

					for (var i = 0, callback; callback = callbacks[i++];) {
						callback(env);
					}
				}
			}
		};

		var Token = _.Token = function (type, content, alias) {
			this.type = type;
			this.content = content;
			this.alias = alias;
		};

		Token.stringify = function (o, language, parent) {
			if (typeof o == 'string') {
				return o;
			}

			if (_.util.type(o) === 'Array') {
				return o.map(function (element) {
					return Token.stringify(element, language, o);
				}).join('');
			}

			var env = {
				type: o.type,
				content: Token.stringify(o.content, language, parent),
				tag: 'span',
				classes: ['token', o.type],
				attributes: {},
				language: language,
				parent: parent
			};

			if (env.type == 'comment') {
				env.attributes.spellcheck = 'true';
			}

			if (o.alias) {
				var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
				Array.prototype.push.apply(env.classes, aliases);
			}

			_.hooks.run('wrap', env);

			var attributes = '';

			for (var name in env.attributes) {
				attributes += name + '="' + (env.attributes[name] || '') + '"';
			}

			return '<' + env.tag + ' class="' + env.classes.join(' ') + '" ' + attributes + '>' + env.content + '</' + env.tag + '>';
		};

		if (!self.document) {
			if (!self.addEventListener) {
				// in Node.js
				return self.Prism;
			}
			// In worker
			self.addEventListener('message', function (evt) {
				var message = JSON.parse(evt.data),
				    lang = message.language,
				    code = message.code;

				self.postMessage(JSON.stringify(_.util.encode(_.tokenize(code, _.languages[lang]))));
				self.close();
			}, false);

			return self.Prism;
		}

		// Get current script and highlight
		var script = document.getElementsByTagName('script');

		script = script[script.length - 1];

		if (script) {
			_.filename = script.src;

			if (document.addEventListener && !script.hasAttribute('data-manual')) {
				document.addEventListener('DOMContentLoaded', _.highlightAll);
			}
		}

		return self.Prism;
	})();

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = Prism;
	}
	;
	Prism.languages.markup = {
		comment: /<!--[\w\W]*?-->/,
		prolog: /<\?.+?\?>/,
		doctype: /<!DOCTYPE.+?>/,
		cdata: /<!\[CDATA\[[\w\W]*?]]>/i,
		tag: {
			pattern: /<\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+))?\s*)*\/?>/i,
			inside: {
				tag: {
					pattern: /^<\/?[\w:-]+/i,
					inside: {
						punctuation: /^<\/?/,
						namespace: /^[\w-]+?:/
					}
				},
				'attr-value': {
					pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
					inside: {
						punctuation: /=|>|"/
					}
				},
				punctuation: /\/?>/,
				'attr-name': {
					pattern: /[\w:-]+/,
					inside: {
						namespace: /^[\w-]+?:/
					}
				}

			}
		},
		entity: /&#?[\da-z]{1,8};/i
	};

	// Plugin to make entity title show the real entity, idea by Roman Komarov
	Prism.hooks.add('wrap', function (env) {

		if (env.type === 'entity') {
			env.attributes.title = env.content.replace(/&amp;/, '&');
		}
	});
	;
	Prism.languages.css = {
		comment: /\/\*[\w\W]*?\*\//,
		atrule: {
			pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
			inside: {
				punctuation: /[;:]/
			}
		},
		url: /url\((?:(["'])(\\\n|\\?.)*?\1|.*?)\)/i,
		selector: /[^\{\}\s][^\{\};]*(?=\s*\{)/,
		string: /("|')(\\\n|\\?.)*?\1/,
		property: /(\b|\B)[\w-]+(?=\s*:)/i,
		important: /\B!important\b/i,
		punctuation: /[\{\};:]/,
		'function': /[-a-z0-9]+(?=\()/i
	};

	if (Prism.languages.markup) {
		Prism.languages.insertBefore('markup', 'tag', {
			style: {
				pattern: /<style[\w\W]*?>[\w\W]*?<\/style>/i,
				inside: {
					tag: {
						pattern: /<style[\w\W]*?>|<\/style>/i,
						inside: Prism.languages.markup.tag.inside
					},
					rest: Prism.languages.css
				},
				alias: 'language-css'
			}
		});

		Prism.languages.insertBefore('inside', 'attr-value', {
			'style-attr': {
				pattern: /\s*style=("|').*?\1/i,
				inside: {
					'attr-name': {
						pattern: /^\s*style/i,
						inside: Prism.languages.markup.tag.inside
					},
					punctuation: /^\s*=\s*['"]|['"]\s*$/,
					'attr-value': {
						pattern: /.+/i,
						inside: Prism.languages.css
					}
				},
				alias: 'language-css'
			}
		}, Prism.languages.markup.tag);
	};
	Prism.languages.clike = {
		comment: [{
			pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
			lookbehind: true
		}, {
			pattern: /(^|[^\\:])\/\/.+/,
			lookbehind: true
		}],
		string: /("|')(\\\n|\\?.)*?\1/,
		'class-name': {
			pattern: /((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
			lookbehind: true,
			inside: {
				punctuation: /(\.|\\)/
			}
		},
		keyword: /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
		boolean: /\b(true|false)\b/,
		'function': {
			pattern: /[a-z0-9_]+\(/i,
			inside: {
				punctuation: /\(/
			}
		},
		number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/,
		operator: /[-+]{1,2}|!|<=?|>=?|={1,3}|&{1,2}|\|?\||\?|\*|\/|~|\^|%/,
		ignore: /&(lt|gt|amp);/i,
		punctuation: /[{}[\];(),.:]/
	};
	;
	Prism.languages.javascript = Prism.languages.extend('clike', {
		keyword: /\b(break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|function|get|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|set|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/,
		number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|-?Infinity)\b/,
		'function': /(?!\d)[a-z0-9_$]+(?=\()/i
	});

	Prism.languages.insertBefore('javascript', 'keyword', {
		regex: {
			pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/,
			lookbehind: true
		}
	});

	if (Prism.languages.markup) {
		Prism.languages.insertBefore('markup', 'tag', {
			script: {
				pattern: /<script[\w\W]*?>[\w\W]*?<\/script>/i,
				inside: {
					tag: {
						pattern: /<script[\w\W]*?>|<\/script>/i,
						inside: Prism.languages.markup.tag.inside
					},
					rest: Prism.languages.javascript
				},
				alias: 'language-javascript'
			}
		});
	}
	;

/***/ },
/* 2 */
/***/ function(module, exports) {

	/*====================================*/
	//Array of Material ID's that are 'new'
	/*====================================*/

	// Fabricator.js gets the IDs from these arrays to put the new tag into
	// TO ADD A PATTERN STATUS
	//1) In your browser go to: localhost:3000
	//2) Navigate to the Material in the menu to the left
	//3) Copy the text right before the .html element
	// [For example: http://localhost:3000/06-modules.html#show-and-hide-content.01-light-accordion]
	// would be '06-modules.html#show-and-hide-content.01-light-accordion']
	//4) Paste as a new entry in quotations into the appropriate pattern status array with a comment of the date when the entry is added

	// TO REMOVE
	//1) Find the pattern ID in the list and remove it

	//Note: Ensure that Javascript syntax is followed by ensuring there is no comma after the last item in the array

	//===NEW PATTERNS====//
	"use strict";

	var newPatternsArray = [
	/*
	    "06-modules.html#show-and-hide-content.02-heavy-accordion", // 2016-08-04
		"06-modules.html#show-and-hide-content.03-text-accordion", // 2016-08-04
		"06-modules.html#show-and-hide-content.04-text-in-small-spaces", // 2016-08-04
		"06-modules.html#show-and-hide-content.05-tool-function", // 2016-08-04
		"06-modules.html#show-and-hide-content.06-navigation", // 2016-08-04
	    "03-imagery.html#image-templates.01-standard-large_image", // 2016-08-10
	    "03-imagery.html#image-templates.02-standard-feature-box-image", // 2016-08-10
	    "03-imagery.html#image-templates.03-awkward-shaped-images", // 2016-08-10
	    "03-imagery.html#image-templates.04-chip-shot", // 2016-08-10
	    "03-imagery.html#image-templates.05-collage", // 2016-08-10
	    "03-imagery.html#image-templates.06-border-to-border-image", // 2016-08-10
	    "03-imagery.html#image-templates.07-PDF-cover", // 2016-08-10
	    "03-imagery.html#image-templates.08-layered-screenshots", // 2016-08-10
	    "03-imagery.html#image-templates.09-collage-imagery-on-a-transparent-background", // 2016-08-10*/
	"05-elements.html#ligature-icons.font-icon-text-replace", // 2016-09-22
	"06-modules.html#tables.06-overflow-tables", // 2016-09-22
	"06-modules.html#navigation-systems.sub-tab-anchor-navigation", //2016-09-27
	"05-elements.html#icons.spinner", //2016-10-21
	"06-modules.html#feature-boxes.c3-and-smaller", //2016-10-21
	"06-modules.html#feature-boxes.c6-and-larger", //2016-10-21
	"06-modules.html#feature-boxes.feature-products", //2016-10-21
	"06-modules.html#loading.elements", //2016-10-21
	"06-modules.html#loading.pages", //2016-10-21
	"05-elements.html#form-elements.tool-tips", //2016-10-25
	"06-modules.html#feature-boxes.!overview", // 2016-10-25
	"06-modules.html#feature-boxes.c4-feature-box", // 2016-10-25
	"06-modules.html#technical-documents.technical-documents", // 2016-10-28
	"07-templates.html#livesite-wrapper.LiveSite-template", // 2016-10-28
	"03-imagery.html#naming-convention.!overview", // 2016-11-01
	"05-elements.html#buttons.08-enlarge-button"];

	//=== BETA PATTERNS===//
	var betaPatterns = ["06-modules.html#tables.02-comparison-tables"];

	//=== Product Family Template Patterns===//
	var pftPatterns = ["08-pages.html#application-tab.application-tab-template", // 2016-08-24
	"08-pages.html#comparitive-product-chart", // 2016-08-24
	"08-pages.html#featured-products-tab.basic-layout-with-banner-and-static-list", // 2016-08-24
	"08-pages.html#featured-products-tab.basic-layout-with-dynamic-and-static-lists", // 2016-08-24
	"08-pages.html#featured-products-tab.basic-layout-with-static-news-listing", // 2016-08-24
	"08-pages.html#getting-started-tab.table-of-contents-listing", // 2016-08-24
	"08-pages.html#sub-family-overview-tab.applications-focused-I-basic", // 2016-08-24
	"08-pages.html#sub-family-overview-tab.applications-focused-I-featurebox", // 2016-08-24
	"08-pages.html#sub-family-overview-tab.applications-focused-I-grid", // 2016-08-24
	"08-pages.html#sub-family-overview-tab.basic-layout", // 2016-08-24
	"08-pages.html#sub-family-overview-tab.category-layout", // 2016-08-24
	"08-pages.html#sub-family-overview-tab.table-of-contents-basic", // 2016-08-24
	"08-pages.html#sub-family-overview-tab.table-of-contents-with-call-to-action", // 2016-08-24
	"08-pages.html#sub-family-overview-tab.value-proposition-boxes", // 2016-08-24
	"08-pages.html#sub-family-overview-tab.value-proposition-header", // 2016-08-24
	"08-pages.html#support-and-training-tab.basic-layout-with-video-player", // 2016-08-24
	"08-pages.html#support-and-training-tab.content-boxes-with-feature-boxes", // 2016-08-24
	"08-pages.html#support-and-training-tab.text-listing", // 2016-08-24
	"08-pages.html#technical-documents-tab.graphical-listing", // 2016-08-24
	"08-pages.html#technical-documents-tab.text-listing", // 2016-08-24
	"08-pages.html#tools-and-software-tab.feature-box-and-dynamic-table", // 2016-08-24
	"08-pages.html#tools-and-software-tab.feature-box_grid-listing", // 2016-08-24
	"08-pages.html#tools-and-software-tab.feature_box_and_dynamic_table_alt_version", // 2016-08-24
	"08-pages.html#tools-and-software-tab.grid-listing-1-column", // 2016-08-24
	"08-pages.html#tools-and-software-tab.grid-listing-2-column", // 2016-08-24
	"08-pages.html#tools-and-software-tab.grid-listing-3-column", // 2016-08-24
	"08-pages.html#tools-and-software-tab.grid-listing", // 2016-08-24
	"08-pages.html#tools-and-software-tab.list-with-dynamic-content-and-tool", // 2016-08-24
	"08-pages.html#tools-and-software-tab.list-with-dynamic-table-and-tool", // 2016-08-24
	"08-pages.html#tools-and-software-tab.tool-category-boxes" // 2016-08-24
	];

	//Exports these lists
	exports.getNewPatterns = function () {
		return newPatternsArray.sort();
	};
	exports.getCautionPatterns = function () {
		return betaPatterns.sort();
	}; //returns Patterns with a Beta Status
	exports.getPftPatterns = function () {
		return pftPatterns.sort();
	};
	// 2016-11-15

/***/ }
/******/ ]);