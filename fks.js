/*********************************************
* Flickr Keyboard Shortcuts v0.2
* Shreyans Bhansali
* Images: 'j' - next, 'k' - previous
* Pages: 'h' - next, 'l' - previous
* Go to a page by number: 'p'
**********************************************/

var next_image;
var cur_image;
var prev_image;
var num_images;
var current_image = -1;
var current_page = window.location.href;

var FKS_ANCHOR_BASE = "fks_picture_";
var FLICKR_BASE_URL = window.location.href.match(/^(http:\/\/www.flickr.com\/photos\/[\w-]*).*$/)[1];
if (FLICKR_BASE_URL[FLICKR_BASE_URL.length-1] != "/") {
	FLICKR_BASE_URL = FLICKR_BASE_URL + "/";
}

if (window.location.hash) window.location.href = window.location.pathname;

// add anchors above each image on the page
var stream_images = document.getElementsByClassName('StreamView');
if (stream_images) {
	num_images = stream_images.length;
	var sv_body_counter = 0;
	for (i = 0; i < num_images; i++) {
		if (stream_images[i].id.search("sv_body_") >= 0) {
			var img_anchor = document.createElement('a');
			img_anchor.name = FKS_ANCHOR_BASE+sv_body_counter;
			var img_id = stream_images[i].id;
			var img_title = img_id.replace("body", "title");
			if (document.getElementById(img_title)) {
				var img_title_div = document.getElementById(img_title);
				img_title_div.insertBefore(img_anchor, img_title_div.childNodes[1]);
			} else {
				stream_images[i].insertBefore(img_anchor, stream_images[i].childNodes[1]);
			}
			sv_body_counter = sv_body_counter + 1;
		}
	}
}

// get the links to the next and previous pages
var next_page;
var next_classes = document.getElementsByClassName('Next');
if (next_classes && next_classes[0]) {
	next_page = next_classes[0].href;
}

var prev_page;
var prev_classes = document.getElementsByClassName('Prev');
if (prev_classes && prev_classes[0]) {
	prev_page = prev_classes[0].href;
}

// depending on the page layout, we either want to skip 1, 2 or 3 pictures when you hit 'next image' or 'prev image'
var image_jump = 1;
if (prev_classes.length != 0) {
	image_jump = 3;
} else if (prev_classes.length == 0 && sv_body_counter > 5) {
	image_jump = 2;
}

document.addEventListener('keydown', function(e) {
	// we're trying to identify the element for which this event was fired, and then decide whether or not to set off the shortcut
	// see: http://www.quirksmode.org/js/events_properties.html
	var element;
	if (e.target) element = e.target;
	else if (e.srcElement) element = e.srcElement;
	if (element.nodeType==3) element = element.parentNode;
	
	// don't want to set the shortcut off when you're editing text on the page
	if (element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
	
	// for a list of keycodes, see: 
	// http://www.cambiaresearch.com/c4/702b8cd1-e5b0-42e6-83ac-25f0306e3e25/Javascript-Char-Codes-Key-Codes.aspx 
	if (e.keyCode) {
		// want to prevent these from running if the crtl, alt, shift or command keys are pressed
		if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;
		
		if (e.keyCode == 74) { // 'j' - 'next image'
			if (current_image < 0) {
				next_image = 0;
				current_image = 0;
			} else {
				next_image = current_image + image_jump;
				current_image = next_image;	
			}
			if (current_image == sv_body_counter) {
				if (next_page) {
					window.location = next_page;
				} else {
					next_image = current_image;
				}
			}
			next_anchor = current_page + "#" + FKS_ANCHOR_BASE + next_image;
			window.location = next_anchor;
		} else if (e.keyCode == 75) { // 'k' - 'prev image'
			if (current_image <= 0) {
				if (prev_page) {
					window.location = prev_page;
				} else {
					prev_image = 0;
				}
			} else {
				prev_image = current_image - image_jump;
				current_image = prev_image;
			}
			prev_anchor = current_page + "#" + FKS_ANCHOR_BASE + prev_image;
			window.location = prev_anchor;
		} else if (e.keyCode == 72) { // 'h' - 'prev page'
			if (prev_page) window.location = prev_page;
		} else if (e.keyCode == 76) { // 'l' - 'next page'
			if (next_page) window.location = next_page;
		} else if (e.keyCode == 80) { // 'p' for page - go to a page by number
			var page_num = prompt("Which page would you like to go to?");
			try {
				if (!page_num) page_num = 0;
				page_num = parseInt(page_num, 10);
				window.location = (FLICKR_BASE_URL + "page" + page_num);
			} catch (zz) {}
		} else if (e.keyCode == 84) { // 't' for tag
			var tag_name = prompt("Enter a tag:");
			try {
				if (!tag_name) return;
				window.location = (FLICKR_BASE_URL + "tags/" + tag_name);
			} catch(zz) {}
		} else if (e.keyCode == 85) { // 'u' for user
			var user_name = prompt("Enter a username:");
			try {
				if (!user_name) return;
				window.location = "http://www.flickr.com/photos/" + user_name;
			} catch(zz) {}
		}
    }
},false);
