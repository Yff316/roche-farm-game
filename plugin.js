(function () {

window.RochePlugin.register({

    id: "roche-farm-game",

    name: "晨露农场",

    version: "1.2.0",


    apps: [

        {

        id:"roche-farm-game-home",

        name:"晨露农场",

        icon:"extension",

        iconImage:"",


        async mount(container, roche){


            let timer=null


            const personas =
            await roche.persona.getUserPersonas()


            const activePersona =
            await roche.persona.getActiveUserPersona()



            let data =
            await roche.storage.get("farm-data")



            if(!data){

                data={

                    coins:500,

                    userId:
                    activePersona?.id || "",

                    tool:"hoe",

                    toolOpen:false

                }


                await roche.storage.set(
                    "farm-data",
                    data
                )

            }



            async function save(){

                await roche.storage.set(
                    "farm-data",
                    data
                )

            }




            function getTime(){

                const hour =
                new Date().getHours()


                if(hour < 5){

                    return {
                        index:4,
                        name:"夜晚"
                    }

                }


                if(hour < 8){

                    return {
                        index:0,
                        name:"清晨"
                    }

                }


                if(hour < 12){

                    return {
                        index:1,
                        name:"上午"
                    }

                }


                if(hour < 17){

                    return {
                        index:2,
                        name:"下午"
                    }

                }


                if(hour < 20){

                    return {
                        index:3,
                        name:"黄昏"
                    }

                }


                return {

                    index:4,

                    name:"夜晚"

                }


            }





            function render(){



                const user =

                personas.find(
                    p=>p.id===data.userId
                )
                ||
                activePersona
                ||
                {}



                const username =

                user.handle
                ||
                user.name
                ||
                "旅人"



                const shortName =

                username.length>6

                ?

                username.slice(0,6)+"…"

                :

                username




                const time=getTime()




                container.innerHTML = `



<style>


.roche-plugin-farm{


width:100%;

height:100%;

margin:0;

padding:0;

background:#f7efdf;

color:#5b4938;

font-family:
"PingFang SC",
sans-serif;


overflow:auto;

}



/* 顶部栏 */


.farm-header{


height:42px;

display:flex;

align-items:center;

justify-content:center;

position:relative;


background:#f7efdf;


}



.farm-title{


font-size:15px;

letter-spacing:2px;


}



.exit-btn{


position:absolute;

left:16px;

font-size:22px;

cursor:pointer;

line-height:1;


}




/* 用户状态 */


.user-status{


display:flex;

align-items:center;

padding:15px 18px 0;

gap:15px;


}




.user-area{


width:65px;

text-align:center;


}



.avatar{


width:44px;

height:44px;

border-radius:50%;

background:#eadbc2;

overflow:hidden;

margin:auto;


}



.avatar img{


width:100%;

height:100%;

object-fit:cover;


}



.username{


margin-top:6px;

width:65px;

white-space:nowrap;

overflow:hidden;

text-overflow:ellipsis;

font-size:12px;


}



.name-line{


width:65px;

border-bottom:1px solid #bda98b;

margin-top:5px;


}





/* 状态 */

.status{


flex:1;

}


.date{


font-size:12px;


}



.time-bar{


position:relative;

display:flex;

gap:3px;

height:18px;

margin-top:8px;

}



.time-cell{


height:12px;

flex:1;

border-radius:3px;

background:#d8ccb4;


}



.time-cell.active{


background:#c59b55;


}




.pointer{


position:absolute;

top:-2px;

font-size:14px;

transform:translateX(-50%);


}



.period{


font-size:11px;

margin-top:5px;


}



.coins{


font-size:12px;

margin-top:8px;


}





/* 工具 */


.tools{


padding-left:18px;

margin-top:18px;


}



.tool-title{


font-size:13px;

cursor:pointer;


}



.tool-list{


margin-top:10px;

display:
${data.toolOpen?"flex":"none"};

flex-direction:column;

gap:8px;


}



.tool{


width:70px;

height:32px;

background:#fbf4e7;

border-radius:8px;

display:flex;

align-items:center;

justify-content:center;

font-size:12px;

cursor:pointer;


}



.tool.active{


background:#dfc394;


}




/* 土地 */


.field{


margin:28px 18px 0;

height:220px;

background:#eadfc8;

border-radius:12px;

padding:20px;

font-size:13px;


}





</style>




<div class="roche-plugin-farm">



<div class="farm-header">


<div class="exit-btn" id="exit">
<
</div>


<div class="farm-title">

晨露农场

</div>


</div>





<div class="user-status">


<div class="user-area">


<div class="avatar">

${
user.avatar
?
`<img src="${user.avatar}">`
:
""

}

</div>



<div class="username">

${shortName}

</div>


<div class="name-line"></div>



</div>




<div class="status">


<div class="date">

${new Date().toLocaleDateString()}

</div>



<div class="time-bar">


<div class="time-cell ${time.index>=0?"active":""}"></div>

<div class="time-cell ${time.index>=1?"active":""}"></div>

<div class="time-cell ${time.index>=2?"active":""}"></div>

<div class="time-cell ${time.index>=3?"active":""}"></div>

<div class="time-cell ${time.index>=4?"active":""}"></div>



<div class="pointer"
style="
left:${time.index*25+12.5}%;
">

△

</div>


</div>



<div class="period">

${time.name}

</div>



<div class="coins">

金币：
${data.coins}

</div>


</div>


</div>







<div class="tools">


<div class="tool-title" id="toolToggle">

工具栏

</div>



<div class="tool-list">


<div class="tool ${data.tool==="hoe"?"active":""}"
data-tool="hoe">

锄头

</div>



<div class="tool ${data.tool==="water"?"active":""}"
data-tool="water">

水壶

</div>



<div class="tool ${data.tool==="seed"?"active":""}"
data-tool="seed">

种子

</div>



</div>



</div>







<div class="field">

等待播种的土地

</div>





</div>



`;





                container
                .querySelector("#exit")
                .onclick=()=>{

                    roche.ui.closeApp()

                }





                container
                .querySelector("#toolToggle")
                .onclick=
                async()=>{


                    data.toolOpen =
                    !data.toolOpen


                    await save()

                    render()


                }




                container
                .querySelectorAll(".tool")
                .forEach(btn=>{


                    btn.onclick=
                    async()=>{


                        data.tool =
                        btn.dataset.tool


                        await save()

                        render()


                    }


                })



            }





            render()



            timer =
            setInterval(
                render,
                60000
            )



            container.__farmTimer =
            timer



        },





        async unmount(container){


            if(container.__farmTimer){

                clearInterval(
                    container.__farmTimer
                )

            }



            container.replaceChildren()


        }



        }


    ]


})


})()
