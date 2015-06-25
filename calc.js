function toEnglish(g) {
    "use strict";
    var s, grade = Math.round(g);
    if (grade >= 70) {
        s = "1st";
    } else if (grade >= 60) {
        s = "2:1";
    } else if (grade >= 50) {
        s = "2:2";
    } else if (grade >= 40) {
        s = "3rd";
    } else if (grade >= 35) {
        s = "Pass";
    } else {
        s = "Fail";
    }
    return s;
}

function avg(a) {
    "use strict";
    var i, total = 0;
    for (i = 0; i < a.length; i += 1) {
        total += a[i];
    }
    return total / i;
}

function log(text) {
    "use strict";
    $('#log').append(text, "<br />");
}

function numsort(a, b) {
    "use strict";
    return b - a;
}

function refresh() {
    "use strict";
    var input, i, c, data, year, credits, mark, overall, band3, level3level2, band2, band1, bands, grades = {
        '1': [],
        '2': [],
        '3': [],
        'S': []
    };
    $('#log').html('');
    $('#year').html('');
    input = $('#data').val().split("\n");
    for (i in input) {
        if (input.hasOwnProperty(i)) {
            data = input[i].match(/[A-Za-z]{2}([1234S])\d{2}(\d{2}) (\d+)/);
            if (data) {
                year = data[1];
                credits = parseInt(data[2], 10);
                mark = parseInt(data[3], 10);
                if (['1', '2', '3', 'S'].indexOf(year) === -1) {
                    log('Skipping module "' + input[i] + '" due to year');
                    continue;
                }
                if (credits > 60 || credits < 10 || credits % 10 !== 0) {
                    log('Skipping module "' + input[i] + '" due to unusual amount of credits');
                    continue;
                }
                // if (mark > 100 || mark < 41) {
					 if (mark > 100 || mark < 0) {
                    log('Skipping module "' + input[i] + '" due to mark');
                    continue;
                }
                for (c = 0; c < credits; c += 10) {
                    grades[year].push(mark);
                }
            } else if (input[i] !== '') {
                log('Could not parse line: "' + input[i] + '"');
            }
        }
    }
    for (year in grades) {
        if (grades.hasOwnProperty(year)) {
            grades[year].sort(numsort);
        }
    }
    band3 = grades['3'].splice(0, 8);
    if (band3.length !== 8) {
        log('Error: Could not find 80 level 3 credits for Band 3');
        return;
    }
    log('Band 3: ' + band3.join(", "));
    level3level2 = grades['3'].concat(grades['2'].sort(numsort));
    band2 = level3level2.splice(0, 8);
    if (band2.length !== 8) {
        log('Error: Could not find 80 remaining level 3 + level 2 credits for Band 2');
        return;
    }
    log('Band 2: ' + band2.join(", "));
    band1 = level3level2;
    if (band1.length < 8) {
	 	log('Warning: Using 1st year credits to fill Band 1');
		band1 = band1.concat(grades['1'].sort(numsort)).splice(0, 8);
		if (band1.length < 8) {
			log('Error: Could not find 80 remaining level 3 + level 2 + level 1 credits for Band 1');
			return;
		}
    }
    log('Band 1: ' + band1.join(", "));
    bands = grades.S;
    if (bands.length !== 0) {
        log('Band S: ' + bands.join(", "));
        overall = (avg(band3) * 3 + avg(band2) * 2 + avg(band1) + avg(bands) * 0.25) / 6.25;
    } else {
        log('No industrial year');
        overall = (avg(band3) * 3 + avg(band2) * 2 + avg(band1)) / 6.0;
    }
    $('#year').html(overall.toFixed(3) + "%<br />" + toEnglish(overall));
}
