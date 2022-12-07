const img = ["img/stock.png", "img/obscure.png", "img/wiki.png", "img/youtube.png", "img/music.png"]

async function getData()
{
    const obj = await fetch("https://raw.githubusercontent.com/TracksJosh/repo_of_qb/main/js/json/tossups.json");
	const data = await obj.json();
	let text = "";
	for(var i = 0; i < data.tossups.length; i++)
	{
	    text += `<div class="tossup"><p>`+data.tossups[i].name;	
		console.log(data.tossups[i].links);
		for(var j = 0; j < data.tossups[i].links.length; j++)
		{
			text += `<a href=`+data.tossups[i].links[j]+`><img src=`+img[j]+`></a>`
		}
		text += `</p></div>`;
	}
    
    document.getElementById("query").innerHTML = text;
}


getData();