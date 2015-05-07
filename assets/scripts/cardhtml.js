var fs = require('fs'),
	url = require('url'),
	http = require('http'),
	request = require('request');

process.on('uncaughtException', function(err) {
	console.error(err);
});

var gui = require('nw.gui');
var win = gui.Window.get();

var data = null;
var startView = 'home';
var currentView = startView;
var failTimeout = null;
var file = (function() {
	var pathParts = location.href.split('/');
	return pathParts.slice(3, pathParts.length-1).join('/') + '/demo.html';
})();

// View stuff
function changeView(id) {
	$('.app-view').hide();
	$('#' + id).show();
}
$('.local-link').click(function() {
	var target = $(this).attr('href');
	if (target && currentView !== target) {
		if (target === startView) {

			location.href = location.href;
		}
		currentView = target;
		console.log('Changing view to', target);
		changeView(target);
	} else {
		console.error('View not specified or already in use');
	}
});
changeView(startView);

// Conversions
var printResolution = 300; // Resolution, 300ppi is the standard in print.
function millimetresToPixels(mm) {
	return Math.round( inchesToPixels( millimetresToInches( Math.abs( parseInt(mm) ) ) ) );
}
function millimetresToInches(mm) {
	return mm / 25.4;
}
function inchesToPixels(inch) {
	return inch * printResolution;
}

// Event handlers
console.log('Setting up event handlers');
$('#chosenFile').change(function() {
	file = $('#chosenFile')[0].value;
});
$('#btn-build').click(function() {
	var size = $('#chosenSize option:selected').attr('value');
	if (size) {
		size = size.split(' ');
	} else {
		size = [$('#width')[0].value || 90, $('#height')[0].value || 50];
	}

	console.log('Export dimensions are', size);

	data = null;
	building = true;

	var rendererUrl = '../html/render.html?path=' + encodeURIComponent('file:///' + file);
	var renderer = gui.Window.open(rendererUrl, {
		width: millimetresToPixels( Math.max(size[0], 46) ),
		height: millimetresToPixels(Math.max(size[1], 18) ),
		frame: false,
		toolbar: false
	});
	renderer.hide();
	global.Message('done').subscribe(function(evt) {
		if (!building) return;
		clearTimeout(failTimeout);

		if (evt.err) {
			console.error('Something went wrong:', evt.err);
			$('#build h2').text('(' + evt.err + ') | Sorry!');
			$('#build button').show();
		} else {
			console.log(evt.data);
			data = evt.data;
			$('#saveFile').trigger('click');
		}
		building = false;
	});

	failTimeout = setTimeout(function(){
		$('#build h2').text('There was an error. Sorry!');
		$('#build button').show();
	}, 3000);
});
$('#saveFile').change(function() {
	var path = $('#saveFile')[0].value;
	fs.writeFile(path, decodeBase64Image(data).data, function(err) {
		if (err) {
			console.error(err);
			$('#build h2').text('There was an error. Sorry!');
		} else {
			console.info('Saved the data to', path);
			$('#build h2').text('Success!!');
		}
		$('#build button').show();
	});
});

// Conversions
function decodeBase64Image(dataString) {
	var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
		response = {};

	if (matches.length !== 3) {
		return new Error('Invalid input string');
	}

	response.type = matches[1];
	response.data = new Buffer(matches[2], 'base64');

	return response;
}

// Message passing
/* 	This is how we pass messages
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

// Fail
