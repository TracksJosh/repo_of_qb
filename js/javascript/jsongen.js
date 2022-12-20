async function makeData()
{
	const necessaryToFunction = await fetch("https://raw.githubusercontent.com/TracksJosh/repo_of_qb/main/js/json/tossups.json");
	if(num > 1) removeSelected();
	let text = "";
	text += `<select id="grab`+num+`" onchange="inputAnswers(this.options[selectedIndex].text)">`;
	text += `<option value ="select">Select</option>`;
	var t = 0;
	var litTotal = 6-lit;
	var histTotal = 5-hist;
	var sciTotal = 5-sci;
	var faTotal = 3-fa;
	for(var i = 0; i<subcats.length; i++)
	{
		if(i == 0 || i == litTotal || i == litTotal+histTotal || i == litTotal+histTotal+sciTotal) 
		{
			text += `<optgroup label="`+cats[t]+`">`;
			t++;
		}
		text += `<option value="`+val[i]+`">`+subcats[i]+`</option>`;
		text += `</optgroup>`;
	}
	text += `</select>`;
	text += `<div align="center" id="input_names`+num+`"></div>`;
	console.log(text);
	console.log(num);
	document.getElementById("json_select"+num).innerHTML = text;
}

function inputAnswers(s1)
{
	var add = "";
	var text1 = "";
	if(s1 != "Select")
	{
		text1 += `<input id="input`+num+`"onchange="add(this.value)"></input>`;
		console.log("Take an L");
	}
	else 
	{
		text1 = `<p class="problem">Please select a subcategory</p>`;
		console.log("EEEEEEEEE");
	}
	text1 += `<div id="input_add`+num+`"></div>`;
	document.getElementById("input_names"+num).innerHTML = text1;
	
}

function add(valu)
{
	
	let but = "";
	if(valu == undefined)
	{
		but = `<p class="problem">Please type a name of answer</p>`;
		boo[num-1] = false;
	}
	else if(valu != undefined && boo[num-1] == false)
	{
		but = `<button type="button" onclick="newQuery()"><img src="img/addition.png"></button>`
		boo[num-1] = true;
	}
	document.getElementById("input_add"+num).innerHTML += but;
}

function newQuery()
{
	but="";
	document.getElementById("input_add"+num).innerHTML = but
	num = num+1;
	t = t+1;
	makeData();
}

function removeSelected()
{
	var c = document.getElementById("grab"+(num-1));
	var j = c.options[c.selectedIndex].text;
	var q = c.value;
	var f = 0;
	console.log(c.value);
	var g = false;
	for(var i = 0; i < val.length; i++)
	{
		if(val[i] == c.value && g == false)
		{
			f = i;
			if(subcats[f].includes("Literature")) lit++;
			else if(subcats[f].includes("History")) hist++;
			else if(subcats[f].includes("Fine Arts")) lit++;
			else sci++;
			g = true;
		}
	}
	inputtedSubs.push(j);
	subcats.splice(f, 1);
	val.splice(f, 1);
	var a = document.getElementById("json_select"+(num-1));
	var h = document.getElementById("input"+(num-1));
	var z = h.value;
	var f = "";
	f += `<p class="problem">`+j+`</p>`;
	f += `<p class="problem">`+z+`</p>`;
	names.push(z);
	a.innerHTML = f;
	console.log(inputtedSubs);
	console.log(names);
}

async function compile()
{
	const obj = await fetch("https://raw.githubusercontent.com/TracksJosh/repo_of_qb/main/js/json/tossups.json");
	const data = await obj.json();
	console.log(data.tossups.length);
	const myArray = [];
	const ids = [];
	for(var i = 0; i<names.length; i++)
	{
		const g = names[i].split(", ");
		console.log(names);
		console.log(g);
		for(var j = 0; j < g.length; j++)
		{
			myArray[i] = new Array(g.length);
			ids[i] = new Array(g.length);
		}
		
		for(var j = 0; j < myArray[i].length; j++)
		{
			myArray[i][j] = g[j];
			ids[i][j] = myArray[i][j].toLowerCase();
		}
	}
	
	for(var i = 0; i < ids.length; i++)
	{
		for(var j = 0; j < ids[i].length; j++)
		{
			ids[i][j] = ids[i][j].replaceAll('\'', '');
			ids[i][j] = ids[i][j].replaceAll('\"', '');
			ids[i][j] = ids[i][j].replaceAll(':', '');
			ids[i][j] = ids[i][j].replaceAll(';', '');
			ids[i][j] = ids[i][j].replaceAll('@', '');
			ids[i][j] = ids[i][j].replaceAll(' ', '_');
		}
		for(var j = 0; j < data.tossups.length; j++)
		{
			var plus = 0;
			for(var k = 0; k < ids[i].length; k++)
			{
				if(ids[i][k] == data.tossups[j].id && inputtedSubs[i] != data.tossups[j].subcategory)
				{
					plus++;
					ids[i][k] += plus;
				}
				else if(ids[i][k] == data.tossups[j].id && inputtedSubs[i] == data.tossups[j].subcategory)
				{
					delete ids[i][k];
				}
			}
		}

	}
	console.log(ids);
	let database = "";
	for(var i = 0; i < ids.length; i++)
	{
		for(var j = 0; j < ids[i].length; j++)
		{
			database += `,\n{\n\t`;
			database += `"id":"`+ids[i][j]+`",\n`;
			database += `"category":"`+returnCats(inputtedSubs[i])+`",\n`;
			database += `"subcategory":"`+inputtedSubs[i]+`",\n`;
			database += `"name":"`+myArray[i][j]+`",\n`;
			database += `"date_added":"`+getDay()+`",\n`;
			database += `"links":[\n\t`;
			database += `"pages/`+ids[i][j]+`/stock.html",`;
			database += `"pages/`+ids[i][j]+`/obscure.html"`;
			database += `]}`;
		}
	}
	
	document.getElementById("compiled_json").innerHTML = database;

}

function getDay()
{
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	return mm+"/"+dd+"/"+yyyy
}

function returnCats(sub)
{
	if(sub.includes("Literature")) return "Literature";
	else if(sub.includes("History")) return "History";
	else if(sub.includes("Fine Arts")) return "Fine Arts";
	else return "Science";
}

let boo = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
let subcats = ["American Literature","British Literature","Classical Literature","European Literature","World Literature","Other Literature","American History","Ancient History","European History","World History","Other History","Biology","Chemistry","Physics","Math","Other Science","Visual Fine Arts","Auditory Fine Arts","Other Fine Arts"];
let val = ["al","bl","cl","el","wl","ol","amh","anh","eh","wh","oh","bio","chem","phys","math","os","vfa","afa","ofa"];
let inputtedSubs = [];
const cats = ["Literature","History","Science","Fine Arts"];
let names = [];
var lit = 0;
var hist = 0;
var sci = 0;
var fa = 0;
var num = 1;
var t = 0;
makeData();
