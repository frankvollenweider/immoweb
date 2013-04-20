function serviceUrl(path, simulate) {
	if (simulate || Tc.Config["backend"]["simulate"]) { return 'data/test/' + path + '.json'; }
	return Tc.Config["backend"]["protocol"] + '://' + Tc.Config["backend"]["host"] + '/' + path;
}
