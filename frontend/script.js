const API="http://localhost";

async function uploadFile(){

const file=document.getElementById("file").files[0];

if(!file){

alert("Choose a file");

return;

}

const form=new FormData();

form.append("file",file);

const response=await fetch(API+"/upload",{

method:"POST",

body:form

});

const data=await response.json();

alert(data.message);

loadFiles();

}

async function loadHealth(){

const response=await fetch(API+"/health");

const data=await response.json();

let html="";

for(let node in data){

html+=`

<div class="file">

<b>${node}</b><br>

Status : ${data[node].status}

</div>

`;

}

document.getElementById("health").innerHTML=html;

}

async function loadFiles(){

const response=await fetch(API+"/files");

const data=await response.json();

let html="";

for(let node in data){

html+=`<h3>${node}</h3>`;

data[node].forEach(file=>{

html+=`

<div class="file">

${file}

<button onclick="downloadFile('${file}')">

Download

</button>

<button onclick="deleteFile('${file}')">

Delete

</button>

</div>

`;

});

}

document.getElementById("files").innerHTML=html;

}

function downloadFile(file){

window.location=API+"/download/"+file;

}

async function deleteFile(file){

await fetch(API+"/delete/"+file,{

method:"DELETE"

});

loadFiles();

}

loadHealth();

loadFiles();