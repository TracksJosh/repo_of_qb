async function getData()
{
    const obj = await fetch("https://tracksjosh.github.io/repo_of_qb/js/json/tossups.json");
	const data = await obj.json();
	let text = "";
	for(var i = 1; i <= data.tossups.length; i++)
	{
	    text += `<div class="tossup"><p>`+data.tossups[i-1].name+`</p></div>`;	
	}
    
    document.getElementById("query").innerHTML = text;
}


getData();