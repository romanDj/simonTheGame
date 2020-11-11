Vue.config.devtools = true;

Vue.component('simon-the-game', {
    data: function () {
        return {
            sequence: [],
            copy: [],
            round: 0,
            active: true,
            activeTile: 0,
            tiles: [
                {key: 1, color: 'red'},
                {key: 2, color: 'blue'},
                {key: 3, color: 'yellow'},
                {key: 4, color: 'green'}
            ],
            tileIsInteractive: false,
            isComplexity: false,
            complexity: 'easy'
        };
    },
    computed: {
        animateInterval: function () {
            switch (this.complexity) {
                case "easy":
                    return 1500;
                case "middle":
                    return 1000;
                case "hard":
                    return 400;
            }
        }
    },
    methods: {
        startGame: function () {
            this.sequence = [];
            this.copy = [];
            this.round = 0;
            this.active = true;
            this.isComplexity = true;
            this.newRound();
        },
        newRound: function () {
            this.round++;
            this.sequence.push(this.randomNumber());
            this.copy = this.sequence.slice(0);
            this.animate(this.sequence);
        },
        animate: function (sequence) {
            let i = 0;

            let interval = setInterval(() => {
                this.playSound(sequence[i]);
                this.lightUp(sequence[i]);

                i++;
                if (i >= sequence.length) {
                    clearInterval(interval);
                    this.tileIsInteractive=true;
                }
            }, this.animateInterval);
        },
        playSound: function (tile = 1) {
            let audio = new Audio('sounds/' + tile + '.mp3');
            audio.play();
        },
        randomNumber: function () {
            return Math.floor((Math.random() * 4) + 1);
        },
        lightUp: function (tile) {
            this.activeTile = tile;
            window.setTimeout(() => {
                this.activeTile = 0;
            }, 300);
        },
        checkLose: function () {
            if (this.copy.length === 0 && this.active) {
                this.tileIsInteractive=false;
                this.newRound();
            } else if (!this.active) {
                this.tileIsInteractive=false;
                this.isComplexity = false;
            }
        },
        tileClick: function (tile, e) {
            if (this.tileIsInteractive) {
                let desiredResponse = this.copy.shift();
                let actualResponse = tile.key;
                this.active = (desiredResponse === actualResponse);
                this.checkLose();
            }
        },
        tileMousedown: function (tile, e) {
            if (this.tileIsInteractive) {
                this.activeTile = tile.key;
                this.playSound(tile.key);
            }
        },
        tileMouseup: function (tile, e) {
            if (this.tileIsInteractive) {
                this.activeTile = 0;
            }
        },
        changeMode: function (e) {
            this.complexity = e.target.value;
        }
    },
    template: `<div class="wrapper">
        <h1>Simon the game</h1>
        <div class="game-board">
            <div class="simon">
                <ul>
                    <li v-for="tile in tiles" :key="tile.key" 
                     :class="['tile', tile.color, {lit: activeTile == tile.key }]"
                     @click="(e)=>tileClick(tile, e)"
                     @mousedown="(e)=>tileMousedown(tile, e)"
                     @mouseup="(e)=>tileMouseup(tile, e)"></li>
                </ul>
            </div>
        </div>
        <div class="game-info">
            <h3>Раунд: <span>{{round}}</span></h3>
            <button @click="startGame">Старт</button>
            <p v-if="!active">Игра окончена. Вы проиграли после <span>{{round}}</span> раунда!</p>
        </div>
        <div class="game-options">
            <h4>Уровень сложности:</h4>
            <div>
                <input id="easy" type="radio" name="complexity" value="easy" 
                    :checked="complexity=='easy'"
                    :disabled="isComplexity"
                    @change="changeMode">
                <label for="easy">Легкий</label>
            </div>
            <div>
                <input id="middle" type="radio" name="complexity" value="middle"
                    :checked="complexity=='middle'"
                    :disabled="isComplexity"
                    @change="changeMode">
                <label for="middle">Средний</label>
            </div>
            <div>
                <input id="hard" type="radio" name="complexity" value="hard"
                    :checked="complexity=='hard'"
                    :disabled="isComplexity"
                    @change="changeMode">
                <label for="hard">Сложный</label>
            </div>
        </div>

    </div>`
});

const app = new Vue({
    el: '#app'
});