/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n/* harmony import */ var _modules_drag_controls_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/drag_controls.js */ \"./src/modules/drag_controls.js\");\n\n\n\nconst scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();\nscene.background = new three__WEBPACK_IMPORTED_MODULE_1__.Color('pink');\nconst camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);\n\nconst renderer = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer();\nrenderer.setSize(window.innerWidth, window.innerHeight);\ndocument.body.appendChild(renderer.domElement);\n\nconst geometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry();\nconst colors = ['#DB6B97', '#F2FFE9', '#A6CF98', '#557C55'];\n\nconst newMaterial = (color) => (new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({color: color}));\nconst materials = colors.map(newMaterial);\n\nconst getRandomArbitrary = (min, max) => (Math.random() * (max - min) + min);\nconst cubes = [];\n\nfor (let i = 0; i < 16; i++) {\n  let cube = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(geometry, materials[i % 4]);\n  cube.position.set(getRandomArbitrary(0, 4), getRandomArbitrary(0, 4));\n  cubes.push(cube);\n  scene.add(cube);\n}\n\nconst ambientLight = new three__WEBPACK_IMPORTED_MODULE_1__.AmbientLight(0xffffff, 0.5);\nscene.add(ambientLight);\n\nconst pointLight = new three__WEBPACK_IMPORTED_MODULE_1__.PointLight(0xffffff, 1);\npointLight.position.set(25, 50, 25);\nscene.add( pointLight );\n\ncamera.position.z = 100;\n\nconst controls = new _modules_drag_controls_js__WEBPACK_IMPORTED_MODULE_0__.DragControls(cubes, camera, renderer.domElement);\n\n// add event listener to highlight dragged objects\ncontrols.addEventListener( 'dragstart', function (event) {\n  event.object.material.emissive.set(0xaaaaaa);\n} );\n\ncontrols.addEventListener( 'dragend', function (event) {\n  event.object.material.emissive.set(0x000000);\n} );\n\nrenderer.render(scene, camera);\n\n// function animate() {\n//   requestAnimationFrame(animate);\n\n//   renderer.render( scene, camera );\n// }\n// animate();\n\n\n//# sourceURL=webpack://pink_cube/./src/index.js?");

/***/ }),

/***/ "./src/modules/drag_controls.js":
/*!**************************************!*\
  !*** ./src/modules/drag_controls.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"DragControls\": () => (/* binding */ DragControls)\n/* harmony export */ });\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\n\nconst _plane = new three__WEBPACK_IMPORTED_MODULE_0__.Plane();\nconst _raycaster = new three__WEBPACK_IMPORTED_MODULE_0__.Raycaster();\n\nconst _pointer = new three__WEBPACK_IMPORTED_MODULE_0__.Vector2();\nconst _offset = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3();\nconst _intersection = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3();\nconst _worldPosition = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3();\nconst _inverseMatrix = new three__WEBPACK_IMPORTED_MODULE_0__.Matrix4();\n\nclass DragControls extends three__WEBPACK_IMPORTED_MODULE_0__.EventDispatcher {\n\n  constructor( _objects, _camera, _domElement ) {\n\n    super();\n\n    _domElement.style.touchAction = 'none'; // disable touch scroll\n\n    let _selected = null, _hovered = null;\n\n    const _intersections = [];\n\n    //\n\n    const scope = this;\n\n    function activate() {\n\n      _domElement.addEventListener( 'pointermove', onPointerMove );\n      _domElement.addEventListener( 'pointerdown', onPointerDown );\n      _domElement.addEventListener( 'pointerup', onPointerCancel );\n      _domElement.addEventListener( 'pointerleave', onPointerCancel );\n\n    }\n\n    function deactivate() {\n\n      _domElement.removeEventListener( 'pointermove', onPointerMove );\n      _domElement.removeEventListener( 'pointerdown', onPointerDown );\n      _domElement.removeEventListener( 'pointerup', onPointerCancel );\n      _domElement.removeEventListener( 'pointerleave', onPointerCancel );\n\n      _domElement.style.cursor = '';\n\n    }\n\n    function dispose() {\n\n      deactivate();\n\n    }\n\n    function getObjects() {\n\n      return _objects;\n\n    }\n\n    function getRaycaster() {\n\n      return _raycaster;\n\n    }\n\n    function onPointerMove( event ) {\n\n      if ( scope.enabled === false ) return;\n\n      updatePointer( event );\n\n      _raycaster.setFromCamera( _pointer, _camera );\n\n      if ( _selected ) {\n\n        if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {\n\n          _selected.position.copy( _intersection.sub( _offset ).applyMatrix4( _inverseMatrix ) );\n\n        }\n\n        scope.dispatchEvent( { type: 'drag', object: _selected } );\n\n        return;\n\n      }\n\n      // hover support\n\n      if ( event.pointerType === 'mouse' || event.pointerType === 'pen' ) {\n\n        _intersections.length = 0;\n\n        _raycaster.setFromCamera( _pointer, _camera );\n        _raycaster.intersectObjects( _objects, true, _intersections );\n\n        if ( _intersections.length > 0 ) {\n\n          const object = _intersections[ 0 ].object;\n\n          _plane.setFromNormalAndCoplanarPoint( _camera.getWorldDirection( _plane.normal ), _worldPosition.setFromMatrixPosition( object.matrixWorld ) );\n\n          if ( _hovered !== object && _hovered !== null ) {\n\n            scope.dispatchEvent( { type: 'hoveroff', object: _hovered } );\n\n            _domElement.style.cursor = 'auto';\n            _hovered = null;\n\n          }\n\n          if ( _hovered !== object ) {\n\n            scope.dispatchEvent( { type: 'hoveron', object: object } );\n\n            _domElement.style.cursor = 'pointer';\n            _hovered = object;\n\n          }\n\n        } else {\n\n          if ( _hovered !== null ) {\n\n            scope.dispatchEvent( { type: 'hoveroff', object: _hovered } );\n\n            _domElement.style.cursor = 'auto';\n            _hovered = null;\n\n          }\n\n        }\n\n      }\n\n    }\n\n    function onPointerDown( event ) {\n\n      if ( scope.enabled === false ) return;\n\n      updatePointer( event );\n\n      _intersections.length = 0;\n\n      _raycaster.setFromCamera( _pointer, _camera );\n      _raycaster.intersectObjects( _objects, true, _intersections );\n\n      if ( _intersections.length > 0 ) {\n\n        _selected = ( scope.transformGroup === true ) ? _objects[ 0 ] : _intersections[ 0 ].object;\n\n        _plane.setFromNormalAndCoplanarPoint( _camera.getWorldDirection( _plane.normal ), _worldPosition.setFromMatrixPosition( _selected.matrixWorld ) );\n\n        if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {\n\n          _inverseMatrix.copy( _selected.parent.matrixWorld ).invert();\n          _offset.copy( _intersection ).sub( _worldPosition.setFromMatrixPosition( _selected.matrixWorld ) );\n\n        }\n\n        _domElement.style.cursor = 'move';\n\n        scope.dispatchEvent( { type: 'dragstart', object: _selected } );\n\n      }\n\n\n    }\n\n    function onPointerCancel() {\n\n      if ( scope.enabled === false ) return;\n\n      if ( _selected ) {\n\n        scope.dispatchEvent( { type: 'dragend', object: _selected } );\n\n        _selected = null;\n\n      }\n\n      _domElement.style.cursor = _hovered ? 'pointer' : 'auto';\n\n    }\n\n    function updatePointer( event ) {\n\n      const rect = _domElement.getBoundingClientRect();\n\n      _pointer.x = ( event.clientX - rect.left ) / rect.width * 2 - 1;\n      _pointer.y = - ( event.clientY - rect.top ) / rect.height * 2 + 1;\n\n    }\n\n    activate();\n\n    // API\n\n    this.enabled = true;\n    this.transformGroup = false;\n\n    this.activate = activate;\n    this.deactivate = deactivate;\n    this.dispose = dispose;\n    this.getObjects = getObjects;\n    this.getRaycaster = getRaycaster;\n\n  }\n\n}\n\n\n\n\n//# sourceURL=webpack://pink_cube/./src/modules/drag_controls.js?");

/***/ }),

/***/ "./node_modules/three/build/three.module.js":
/*!**************************************************!*\
  !*** ./node_modules/three/build/three.module.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;