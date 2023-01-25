const img = ["img/stock.png", "img/obscure.png", "img/wiki.png", "img/youtube.png", "img/music.png"]
let number = 0;
let page = 0;
let g = 0;
let lol = null;

async function obtain()
{
	const obj = await fetch("https://raw.githubusercontent.com/TracksJosh/repo_of_qb/main/js/json/tossups.json");
	const data = await obj.json();
	lol = data;
	getData();
}

function getData()
{

	console.log(lol.tossups.length);
	let pages = 0;
	if(number != 0)
	{
		pages = Math.floor(lol.tossups.length/number);
		if(lol.tossups.length%number>0)
		{
			pages++;
		}
		console.log(pages);
	}
	else
	{
		number = 30;
		pages = Math.floor(lol.tossups.length/number)+(lol.tossups.length%number);
		console.log(pages);
	}
	g = pages;
	formPage(pages, lol);
}

function formPage(pages, data)
{
	let textButton = "";
	if(page > 0)
	{
		textButton += `<button type="button" onclick="prevPage()"><img src="img/prev.png"></button>`;	
	}
	if(page < pages-1)
	{
		textButton += `<button type="button" onclick="nextPage()"><img src="img/next.png"></button>`;	
	}
	let text = "";
	let textNum = "";
	for(var i = number*page; i < number*(page+1); i++)
	{
		if(i >= data.tossups.length) break;
		text += `<div class="tossup"><p>`+data.tossups[i].name+` `;	
		console.log(data.tossups[i].links);
		for(var j = 0; j < data.tossups[i].links.length; j++)
		{
			text += `<a href=`+data.tossups[i].links[j]+`><img class="selection" src=`+img[j]+`></a>`
		}
		text += `</p></div>`;
	}
	
	textNum += `<p class="flavor">`+(page+1)+` of `+pages+`</p>`;
	console.log(pages);
	document.getElementById("pageNum").innerHTML = textNum;
	document.getElementById("query").innerHTML = text;
	document.getElementById("pages").innerHTML = textButton;
	
}

function numb(val)
{
	number = val;
	page = 0;
	obtain();
}

function prevPage()
{
	if(page > 0) page--;
	formPage(g, lol);
}


function nextPage()
{
	if(page < g) page++;
	formPage(g, lol);
}

async function search(searchQ)
{
	await obtain();
	console.log(searchQ);
	if(searchQ != null)
	{
		let lmao = lol;
	    for(var i = lol.tossups.length-1; i > -1; i--)
		{
			if(!lol.tossups[i].name.toLowerCase().includes(searchQ.toLowerCase()))
			{
				
				lmao.tossups.splice(i,1);
			}
		}
		lol = null;
		lol = lmao;
	}
	formPage(g, lol)
	getData(lol);
	console.log(searchQ);
	
}

numb(30);