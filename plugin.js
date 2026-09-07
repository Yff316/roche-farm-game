(function () {

  const PLUGIN_ID = "roche-farm-game"

  window.RochePlugin.register({

    id: PLUGIN_ID,

    name: "晨露农场",

    version: "1.0.0",

    apps: [

      {
        id: "roche-farm-game-home",

        name: "晨露农场",

        icon: "extension",

        iconImage: "",


        async mount(container, roche) {


          let timer = null


          const userPersona =
            await roche.persona.getActiveUserPersona()


          const personas =
            await roche.persona.getUserPersonas()


          let data =
            await roche.storage.get("farm-data")


          if (!data) {

            data = {

              coins: 500,

              date: new Date().toLocaleDateString(),

              dayProgress: 40,

              tool: "hoe",

              userId:
                userPersona?.id || "",

              crops: []

            }

            await roche.storage.set(
              "farm-data",
              data
            )

          }



          function getTimeProgress(){

            const now = new Date()

            const hour = now.getHours()

            let section = ""

            let percent = 0


            if(hour < 8){

              section="清晨"

              percent = hour / 8 * 33

            }
            else if(hour < 16){

              section="白昼"

              percent =
              33 +
              ((hour-8)/8)*33

            }
            else{

              section="黄昏"

              percent =
              66 +
              ((hour-16)/8)*34

            }


            return {

              section,

              percent

            }

          }



          function render(){


            const activeUser =
              personas.find(
                p=>p.id===data.userId
              )
              ||
              userPersona
              ||
              {}


            const displayName =
              activeUser.handle
              ||
              activeUser.name
              ||
              "旅人"


            const avatar =
              activeUser.avatar || ""


            const time =
              getTimeProgress()



            container.innerHTML = `


<style>

.roche-plugin-farm {

height:100%;

background:#f7efdF;

font-family:
"PingFang SC",
sans-serif;

color:#59483c;

padding:24px;

box-sizing:border-box;

}


.roche-plugin-farm *{

box-sizing:border-box;

}



.farm-top{

display:flex;

justify-content:space-between;

align-items:center;

}


.user-area{

text-align:center;

}


.user-avatar{

width:86px;

height:86px;

border-radius:50%;

background:#eadbc2;

overflow:hidden;

}


.user-avatar img{

width:100%;

height:100%;

object-fit:cover;

}



.user-name{

margin-top:8px;

cursor:pointer;

font-size:15px;

}



.status{

width:240px;

}



.date{

font-size:14px;

margin-bottom:10px;

}



.progress{

height:10px;

background:#e5d4b8;

border-radius:20px;

overflow:hidden;

}



.progress-inner{

height:100%;

background:#b99b72;

width:${time.percent}%;

}



.period{

font-size:12px;

margin-top:6px;

}



.coins{

margin-top:15px;

font-size:15px;

}



.tools{

margin-top:35px;

display:flex;

gap:15px;

}



.tool{

width:80px;

height:80px;

background:#fbf4e7;

border-radius:18px;

display:flex;

align-items:center;

justify-content:center;

cursor:pointer;

font-size:14px;

}



.tool.active{

background:#ead7b7;

}



.farm-ground{

margin-top:35px;

height:220px;

background:#eadfc8;

border-radius:25px;

padding:20px;

}



</style>



<div class="roche-plugin-farm">


<div class="farm-top">


<div class="user-area">

<div class="user-avatar">

${
avatar
?
`<img src="${avatar}">`
:
""

}

</div>


<div class="user-name"
id="change-user">

${displayName}

</div>


</div>



<div class="status">


<div class="date">

${new Date().toLocaleDateString()}

</div>


<div class="progress">

<div class="progress-inner"></div>

</div>


<div class="period">

${time.section}

</div>


<div class="coins">

金币：
${data.coins}

</div>


</div>



</div>





<div class="tools">


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





<div class="farm-ground">

<div>

晨露落在田野，
等待下一次播种。

</div>

</div>




</div>


`



            container
            .querySelectorAll(".tool")
            .forEach(btn=>{


              btn.onclick =
              async ()=>{


                data.tool =
                btn.dataset.tool


                await save()

                render()

              }


            })




            const userBtn =
            container.querySelector(
              "#change-user"
            )



            userBtn.onclick =
            async ()=>{


              if(
                personas.length<=1
              ){

                roche.ui.toast(
                "暂时没有其他人设"
                )

                return

              }


              let index =
              personas.findIndex(
              p=>p.id===data.userId
              )


              index++


              if(
              index>=personas.length
              )
              index=0



              data.userId =
              personas[index].id


              await save()


              render()


            }



          }





          async function save(){

            await roche.storage.set(
              "farm-data",
              data
            )

          }



          render()



          timer =
          setInterval(()=>{

            render()

          },60000)



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
