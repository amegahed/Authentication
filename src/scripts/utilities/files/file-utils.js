/******************************************************************************\
|                                                                              |
|                                  file-utils.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This contains minor general purpose file utilities.                   |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/
function isDirectoryName(name) {
	return name && (typeof(name) == 'string') && name.endsWith('/');
}
function getDirectoryName(path) {
	if (path.contains('/')) {
		return path.substr(0, path.lastIndexOf('/'));
	} else {
		return path;
	}
}