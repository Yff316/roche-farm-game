(function(){

window.RochePlugin.register({

id:"roche-farm-game",

name:"晨露农场",

version:"1.1.0",


apps:[{

id:"roche-farm-game-home",

name:"晨露农场",

icon:"extension",


async mount(container,roche){


let timer=null


const personas =
await roche.persona.getUserPersonas()


const active =
await roche.persona.getActiveUserPersona()



let data =
await roche.storage.get("farm-data")



if(!data){

data={

coins:500,

userId:active?.id||"",

tool:"hoe",

toolOpen:false

}


await roche.storage.set(
"farm-data",
data
)

}



function getTime(){


let h=new Date().getHours()


if(h<5)
return {
name:"夜晚",
index:4
}


if(h<8)
return {
name:"清晨",
index:0
}


if(h<12)
return {
name:"上午",
index:1
}


if(h<16)
return {
name:"下午",
index:2
}


if(h<20)
return {
name:"黄昏",
index:3
}


return {
name:"夜晚",
index:4
}


}




async function save(){

await roche.storage.set(
"farm-data",
data
)

}



function render(){


const user =
personas.find(
p=>p.id===data.userId
)
||
active
||
{}



const name =
user.handle ||
user.name ||
"旅人"



const shortName =
name.length>7
?
name.slice(0,7)+"…"
:
name



const time=getTime()



container.innerHTML=`


<style>


.roche-plugin-farm{

height:100%;

background:#f7efdF;

color:#5b4938;

padding:10px 18px;

font-family:
"PingFang SC",
sans-serif;

}



.farm-header{

height:38px;

display:flex;

justify-content:space-between;

align-items:center;

}


.exit{

cursor:pointer;

font-size:13px;

}



.main-info{

display:flex;

align-items:center;

gap:15px;

}



.avatar{

width:54px;

height:54px;

border-radius:50%;

overflow:hidden;

background:#eadbc2;

}


.avatar img{

width:100%;

height:100%;

object-fit:cover;

}



.user-name{

width:85px;

white-space:nowrap;

overflow:hidden;

text-overflow:ellipsis;

text-align:center;

margin-top:5px;

}



.name-line{

width:85px;

border-bottom:1px solid #bca98c;

}



.status{

flex:1;

}



.date{

font-size:12px;

}



.clock{

display:flex;

gap:4px;

margin-top:8px;

position:relative;

}



.cell{

height:14px;

flex:1;

background:#ded3bd;

border-radius:3px;

}



.cell.active{

background:#c59b55;

}



.pointer{

position:absolute;

top:16px;

font-size:14px;

left:${time.index*20+8}%;

transition:.3s;

}



.coin{

font-size:13px;

margin-top:10px;

}



.tools{

margin-top:15px;

}



.tool-toggle{

font-size:13px;

cursor:pointer;

}



.tool-list{

margin-top:8px;

display:${data.toolOpen?"flex":"none"};

flex-direction:column;

gap:8px;

}



.tool{

width:70px;

height:34px;

background:#fbf4e7;

border-radius:10px;

display:flex;

align-items:center;

justify-content:center;

cursor:pointer;

font-size:13px;

}


.tool.active{

background:#dfc394;

}



.field{

margin-top:30px;

height:220px;

background:#eadfc8;

border-radius:25px;

padding:20px;

}



</style>



<div class="roche-plugin-farm">


<div class="farm-header">

<div>
晨露农场
</div>

<div class="exit" id="exit">
退出
</div>


</div>



<div class="main-info">


<div>

<div class="avatar">

${
user.avatar
?
`<img src="${user.avatar}">`
:
""

}

</div>


<div class="user-name">

${shortName}

</div>

<div class="name-line"></div>


</div>



<div class="status">


<div class="date">

${new Date().toLocaleDateString()}
</div>



<div class="clock">


<div class="cell ${time.index>=0?"active":""}"></div>

<div class="cell ${time.index>=1?"active":""}"></div>

<div class="cell ${time.index>=2?"active":""}"></div>

<div class="cell ${time.index>=3?"active":""}"></div>

<div class="cell ${time.index>=4?"active":""}"></div>


<div class="pointer">
△
</div>


</div>



<div class="coin">

金币：
${data.coins}

</div>



</div>


</div>




<div class="tools">


<div class="tool-toggle" id="tools">

工具栏

</div>



<div class="tool-list">


<div class="tool ${data.tool==="hoe"?"active":""}" data-tool="hoe">
锄头
</div>


<div class="tool ${data.tool==="water"?"active":""}" data-tool="water">
水壶
</div>


<div class="tool ${data.tool==="seed"?"active":""}" data-tool="seed">
种子
</div>


</div>


</div>




<div class="field">

等待播种的土地

</div>



</div>



`




container
.querySelector("#exit")
.onclick=()=>{

roche.ui.closeApp()

}



container
.querySelector("#tools")
.onclick=
async()=>{

data.toolOpen=
!data.toolOpen

await save()

render()

}



container
.querySelectorAll(".tool")
.forEach(btn=>{

btn.onclick=
async()=>{

data.tool=
btn.dataset.tool

await save()

render()

}


})



}



render()



timer=setInterval(
render,
60000
)



container.__timer=timer



},



async unmount(container){

if(container.__timer)
clearInterval(container.__timer)

container.replaceChildren()

}


}]


})


})()
