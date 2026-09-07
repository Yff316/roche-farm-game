(function () {

window.RochePlugin.register({

    id: "roche-farm-game",

    name: "晨露农场",

    version: "1.2.1",


    apps: [

        {

        id: "roche-farm-game-home",

        name: "晨露农场",

        icon: "extension",

        async mount(container, roche) {

            let timer = null

            const personas = await roche.persona.getUserPersonas()
            const activePersona = await roche.persona.getActiveUserPersona()

            let data = await roche.storage.get("farm-data")

            if (!data) {
                data = {
                    coins: 500,
                    userId: activePersona?.id || "",
                    tool: "hoe",
                    toolOpen: false
                }
                await roche.storage.set("farm-data", data)
            }

            async function save() {
                await roche.storage.set("farm-data", data)
            }

            function getTime() {
                const hour = new Date().getHours()
                if (hour < 5) return { index: 4, name: "夜晚" }
                if (hour < 8) return { index: 0, name: "清晨" }
                if (hour < 12) return { index: 1, name: "上午" }
                if (hour < 17) return { index: 2, name: "下午" }
                if (hour < 20) return { index: 3, name: "黄昏" }
                return { index: 4, name: "夜晚" }
            }

            function render() {
                const user = personas.find(p => p.id === data.userId) || activePersona || {}
                const username = user.handle || user.name || "旅人"
                const shortName = username.length > 6 ? username.slice(0, 6) + "…" : username

                const time = getTime()

                container.innerHTML = `

<style>
.roche-plugin-farm {
    width: 100%;
    height: 100%;
    background: #f8f1e3;
    color: #5b4938;
    font-family: "PingFang SC", sans-serif;
    padding: 0;
    margin: 0;
    box-shadow: 0 8px 25px rgba(0,0,0,0.08);
    overflow: auto;
}

/* 顶部栏 */
.farm-header {
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: #f8f1e3;
    border-bottom: 2px solid #e8d9c2;
}

.exit-btn {
    position: absolute;
    left: 18px;
    font-size: 24px;
    cursor: pointer;
    line-height: 1;
    color: #8c6f4f;
}

.farm-title {
    font-size: 16px;
    letter-spacing: 3px;
    font-weight: 500;
}

/* 用户区 */
.user-status {
    display: flex;
    align-items: center;
    padding: 18px 20px 8px;
    gap: 18px;
}

.user-area {
    width: 72px;
    text-align: center;
}

.avatar-frame {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #f0e6d8;
    padding: 3px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    overflow: hidden;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.username {
    margin-top: 8px;
    width: 72px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 13px;
    color: #5b4938;
}

.name-line {
    width: 72px;
    border-bottom: 2px solid #c8b49a;
    margin-top: 4px;
}

/* 状态栏 */
.status {
    flex: 1;
}

.date {
    font-size: 13px;
    color: #8c6f4f;
}

.time-container {
    position: relative;
    display: flex;
    gap: 4px;
    height: 22px;
    margin-top: 10px;
}

.time-cell {
    height: 14px;
    flex: 1;
    border-radius: 4px;
    background: linear-gradient(#e8d9c2, #d4c2a8);
    box-shadow: inset 0 2px 4px rgba(255,255,255,0.6);
}

.time-cell.active {
    background: linear-gradient(#f0c45e, #d4a02c);
}

.pointer {
    position: absolute;
    top: -3px;
    font-size: 16px;
    transform: translateX(-50%);
    transition: left 0.4s ease;
    color: #d4a02c;
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.period {
    font-size: 11px;
    margin-top: 6px;
    color: #8c6f4f;
}

.coins {
    font-size: 13px;
    margin-top: 10px;
    color: #8c6f4f;
}

/* 工具栏 */
.tools {
    padding: 0 20px 20px;
}

.tool-title {
    font-size: 13.5px;
    color: #8c6f4f;
    margin-bottom: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
}

.tool-list {
    display: ${data.toolOpen ? "flex" : "none"};
    flex-direction: column;
    gap: 8px;
}

.tool {
    width: 100%;
    height: 38px;
    background: #f0e6d8;
    border: 1px solid #e0d2b8;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13.5px;
    cursor: pointer;
    transition: all 0.2s;
    color: #5b4938;
}

.tool:hover {
    background: #e8d9c2;
    transform: translateY(-1px);
}

.tool.active {
    background: #f0c45e;
    border-color: #d4a02c;
    color: #5b4938;
    box-shadow: 0 3px 8px rgba(212, 160, 44, 0.2);
}

/* 土地区 */
.field {
    margin: 0 20px;
    height: 240px;
    background: #e8d9c2;
    border-radius: 16px;
    padding: 22px;
    position: relative;
    box-shadow: inset 0 8px 16px rgba(0,0,0,0.06);
}

.field::before {
    content: "";
    position: absolute;
    top: 12px;
    left: 12px;
    right: 12px;
    bottom: 12px;
    background: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 8px,
        rgba(255,255,255,0.6) 8px,
        rgba(255,255,255,0.6) 16px
    );
    pointer-events: none;
    border-radius: 12px;
}

.field-text {
    font-size: 13.5px;
    color: #8c6f4f;
    opacity: 0.85;
}

</style>

<div class="roche-plugin-farm">

    <div class="farm-header">
        <div class="exit-btn" id="exit">＜</div>
        <div class="farm-title">晨露农场</div>
    </div>

    <div class="user-status">
        <div class="user-area">
            <div class="avatar-frame">
                ${user.avatar ? `<img src="${user.avatar}">` : ""}
            </div>
            <div class="username">${shortName}</div>
            <div class="name-line"></div>
        </div>

        <div class="status">
            <div class="date">${new Date().toLocaleDateString()}</div>
            <div class="time-container">
                <div class="time-cell ${time.index>=0?"active":""}"></div>
                <div class="time-cell ${time.index>=1?"active":""}"></div>
                <div class="time-cell ${time.index>=2?"active":""}"></div>
                <div class="time-cell ${time.index>=3?"active":""}"></div>
                <div class="time-cell ${time.index>=4?"active":""}"></div>
                <div class="pointer" style="left: ${time.index*25+12.5}%">△</div>
            </div>
            <div class="period">${time.name}</div>
            <div class="coins">金币：${data.coins}</div>
        </div>
    </div>

    <div class="tools">
        <div class="tool-title" id="toolToggle">工具栏</div>
        <div class="tool-list">
            <div class="tool ${data.tool==="hoe"?"active":""}" data-tool="hoe">锄头</div>
            <div class="tool ${data.tool==="water"?"active":""}" data-tool="water">水壶</div>
            <div class="tool ${data.tool==="seed"?"active":""}" data-tool="seed">种子</div>
        </div>
    </div>

    <div class="field">
        <div class="field-text">等待播种的土地</div>
    </div>

</div>

`;

                const exitBtn = container.querySelector("#exit")
                const toolTitle = container.querySelector("#toolToggle")

                exitBtn.onclick = () => roche.ui.closeApp()

                toolTitle.onclick = async () => {
                    data.toolOpen = !data.toolOpen
                    await save()
                    render()
                }

                container.querySelectorAll(".tool").forEach(btn => {
                    btn.onclick = async () => {
                        data.tool = btn.dataset.tool
                        await save()
                        render()
                    }
                })
            }

            render()

            timer = setInterval(render, 60000)
            container.__farmTimer = timer

        },

        unmount(container) {
            if (container.__farmTimer) clearInterval(container.__farmTimer)
            container.replaceChildren()
        }

        }

    ]

})

})()
