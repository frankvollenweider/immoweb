function serviceUrl(path) {
	var demo = true;
	var protocol = 'http';
	var host = demo ? 'www.immoweb.com' : 'api.immoweb.com';
	return protocol + '://' + host + '/' + (demo ? 'data/test/' : '') + path + (demo ? '.json' : '');
}
