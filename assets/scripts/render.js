/* 	This is how we pass messages back to the parent window
	How to send:
		global.Message('test').publish(666);
	And receive:
		global.Message('test').subscribe(function(evt) { console.log(evt) }); */
var messages = messages || {};
global.Message = global.Message || function(id) {
	var callbacks, method,
	message = id && messages[id];
	if (!message) {
		callbacks = jQuery.Callbacks();
		message = {
			publish: callbacks.fire,
			subscribe: callbacks.add,
			unsubscribe: callbacks.remove
		}
		if (id) {
			messages[id] = message;
		}
	}
	return message;
};

// Options are passed in URL. This is how we get them.
// Source: http://stackoverflow.com/a/901144/3485691
function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// When the canvas has been drawn and we are ready to send the data back.
function ready(canvas) {
	var data = canvas.toDataURL();
	console.log(data);

	if (data && data !== 'data:,') {
		global.Message('done').publish({
			data: data,
			error: null
		});
	} else {
		global.Message('done').publish({
			data: data,
			error: 'No data'
		});
	}
	window.close();
}

// When the document is ready to accept file injection.
document.addEventListener('DOMContentLoaded', function() {
	var target = getParameterByName('path');
	console.log('Rendering', target);

	var settings = {
		allowTaint: true,
		logging: true,
		useCORS: true,
		onrendered: ready
	};

	// Inject the desider file to the document.
	$(document.body).load(target, function() {
		// Render the body to canvas.
		html2canvas(document.body, settings);
	});
});