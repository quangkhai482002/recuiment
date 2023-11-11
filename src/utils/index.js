import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const randomInterger = (min, max) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

export function flatten(ob) {
	var toReturn = {};

	for (var i in ob) {
		if (!ob.hasOwnProperty(i)) continue;

		if (typeof ob[i] == 'object' && ob[i] !== null) {
			var flatObject = flatten(ob[i]);
			for (var x in flatObject) {
				if (!flatObject.hasOwnProperty(x)) continue;

				toReturn[i + '_' + x] = flatObject[x];
			}
		} else {
			toReturn[i] = ob[i];
		}
	}
	return toReturn;
}

export function getErrorMessage(statusCode) {
	switch (statusCode) {
		case 400: return "Bad Request !!!";
		case 401: return "Unauthorized !!!";
		case 403: return "Forbidden !!!";
		case 404: return "Not Found !!!";
		case 405: return "Not Allowed !!!";
		case 500: return "Internal Server Error!!!";
		case 502: return "Bad Gateway !!!";
		default: return "Undefined Error !!!";
	}
}

export function createSetValueFilter(array){
	const setSkill = new Set(array);
	array = [];
	setSkill.forEach((value) => {
	  array.push({
		text: value,
		value: value,
	  });
	});
	return array
}

export async function toPDF(html) {
	const ratio = 0.33;
	const width = html.scrollWidth;
	const height = html.scrollHeight;
	const canvas = await html2canvas(html);
	const image = canvas.toDataURL('image/png');
	const pdf = new jsPDF("p", "mm", [height * ratio, width * ratio]);
	pdf.addImage(image, 'JPEG', 0, 0);
	return pdf;
}

export function isInBlackList (blacklists){
	return blacklists.length > 0 &&
            blacklists.some(
              (blacklist) =>
                new Date(blacklist.startDate) <= new Date() &&
                (!blacklist.endDate || new Date(blacklist.endDate) >= new Date())
            );
	
}

export function waitUntilLocalStorageNotNull(key) {
	return new Promise((resolve) => {
	  const intervalId = setInterval(() => {
		if (localStorage.getItem(key) !== null) {
		  clearInterval(intervalId);
		  resolve();
		}
	  }, 100);
	});
  }