const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const currentSongName = $(".dashboard .current-song-name");
const CDblock = $(".dashboard .CD-block");
const CDimage = $(".dashboard .CD");
const audio = $(".dashboard audio");
const inputBar = $(".dashboard input");
const repeatBtn = $(".repeat-btn i");
const randomBtn = $(".random-btn i");
const prevSongBtn = $(".prev-btn i");
const nextSongBtn = $(".next-btn i");
const playingBtn = $(".toggle-play-btn");

const player = {
    currentIndex: 0,
    isPlaying: false,
    isRepeat: false,
    isRandom: false,
    songs: [
        {
            name: "Kiêu Ngạo",
            singer: "En",
            path: "./assets/audio/kieu_ngao.mp3",
            image: "https://i.ytimg.com/vi/js7_OSmYDxg/maxresdefault.jpg"
        },
        {
            name: "Pure Summer Weather",
            singer: "LIKPIA",
            path: "./assets/audio/pure_summer_weather.mp3",
            image: "https://i1.sndcdn.com/artworks-LMlFkd449Rax3LoT-N7oUKA-t500x500.jpg"
        },
        {
            name: "Ampyx",
            singer: "Holo (Wontolla Remix)",
            path: "./assets/audio/ampyx.mp3",
            image: "https://i.ytimg.com/vi/wNf20kRfGVI/maxresdefault.jpg"
        },
        {
            name: "Remember Our Summer",
            singer: "Frogmonster",
            path: "./assets/audio/remember_our_summer.mp3",
            image: "https://i1.sndcdn.com/artworks-x2IYapSK8vTh-0-t500x500.jpg"
        },
        {
            name: "Zoverze Lovely",
            singer: "FURY EDM",
            path: "./assets/audio/zoverze_lovely.mp3",
            image: "https://i.ytimg.com/vi/Cz-FNP7S8Ws/maxresdefault.jpg"
        },
        {
            name: "Is there still anything that love can do",
            singer: "Raftaar x Nawazuddin Siddiqui",
            path: "./assets/audio/is_there_still_anything_that_love_can_do.mp3",
            image: "https://i1.sndcdn.com/artworks-000645159865-oskc10-t500x500.jpg"
        },
        {
            name: "Nơi này có anh",
            singer: "Sơn Tùng MTP",
            path: "./assets/audio/noi_nay_co_anh.mp3",
            image: "https://kenh14cdn.com/2017/sontung2-1487156115154.jpg"
        },
        {
            name: "It's you",
            singer: "Ali Gatie (abudy cover)",
            path: "./assets/audio/it_s_you.mp3",
            image: "https://i.ytimg.com/vi/aejwMsvY7Cc/maxresdefault.jpg"
        }
    ],
    songsPlayed: [],
    renderListSongs: function () {
        const htmls = $('.song-list');

        const listSongText = this.songs.map((song, index) => {
            return `
            <div class="song-items" data-index="${index}">
                <div class="song-items__info" index="${index}">
                    <img class="song-items__image" src="${song.image}" alt="">
                    <h2 class="song-name">${song.name}</h2>
                    <h4 class="song-single">${song.singer}</h4>
                </div>
            </div>
        `})

        
    //      <div class="song-items__option">
    //          <i class="fas fa-ellipsis-h"></i>
    //      </div>

        htmls.innerHTML = listSongText.join("");
    },
    handleEvents: function () {
        const _this = this;
        const CDheight = CDblock.offsetWidth;
        const songList = $$("div.song-items__info");
        const optionBtns = $$("div.song-items__option");
        const songsName = $$(".song-name");

        /*------Rotated CD animate object------*/
        const CDRotatingAnimation = CDimage.animate({
            transform: "rotate(0)",
            transform: "rotate(360deg)"
        }, {
            duration: 10000,
            iterations: Infinity
        });
        CDRotatingAnimation.pause();

        playingBtn.onclick = function (e) {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        /*------Playing Song------*/
        audio.onplay = function () {
            playingBtn.classList.add("playing");
            CDRotatingAnimation.play();
            _this.isPlaying = true;
        }

        /*------Pausing Song------*/
        audio.onpause = function () {
            playingBtn.classList.remove("playing");
            CDRotatingAnimation.pause();
            _this.isPlaying = false;
        }

        /*------Scrolling up------*/
        document.onscroll = function (e) {
            const currentHeight = Math.floor(window.scrollY);
            let CDcurrentHeight =
                (CDheight - currentHeight) > 0 ? (CDheight - currentHeight) : 0;
            CDblock.style.width = CDcurrentHeight + "px";
            CDblock.style.opacity = CDcurrentHeight / CDheight;
        }

        audio.ontimeupdate = function () {
            _this.updateProgress();
        }

        /*------When the song is end.------*/
        audio.onended = function () {
            _this.checkingChoosedFunction();

            if (_this.isRepeat) _this.playSong();
            else if (_this.isRandom) _this.loadRandomSong();
            else {
                _this.getNextSong();
                _this.playSong();
            }
        }

        /*------When client change time------*/
        inputBar.onchange = function (e) {
            audio.pause();
            audio.currentTime = Math.floor((e.target.value / 100) * audio.duration);
        }

        /*------Client want to reapeat song------*/
        repeatBtn.onclick = function () {
            _this.repeatCurrentSong();
        }

        /*------Client want to play the previous song------*/
        prevSongBtn.onclick = function () {
            _this.getPreviousSong();
            _this.playSong();
        }

        /*------Client want to play the next song------*/
        nextSongBtn.onclick = function () {
            if (_this.isRandom) {
                _this.loadRandomSong();
            } else {
                _this.getNextSong();
                _this.playSong();
            }
        }

        /*------Client want to play the random song------*/
        randomBtn.onclick = function () {
            if (_this.isRandom) {
                _this.isRandom = false;
                _this.songsPlayed = [];
                _this.getRandomSong();
            } else {
                _this.isRandom = true;
                _this.songsPlayed.push(_this.currentIndex);
                _this.getRandomSong();
            }
        }
        /*------Render the long name of song------*/
        for (let songName of songsName) {
            let name = songName.innerText;
            if (name.length >= 40) songName.innerText = name.slice(0, 37) + "...";
        }

        /*------Client want to play their song------*/
        this.checkingChoosedSong(songList);
        $("html").onclick = () => {
            this.checkingChoosedSong(songList);
        }

        /*------Client want to option their song------*/
        for (let btn of optionBtns) {
            btn.onclick = function (e) {
                //  Coding here
            }
        }
    },
    checkingChoosedSong: function (songList) {
        for (let index in songList) {
            songList[index].onclick = function () {
                if (!songList[index].closest(".active-song")) {
                    player.currentIndex = index;
                    player.playSong();
                }
            }
        }
    },
    checkingChoosedFunction: function () {
        this.isRepeat = repeatBtn.classList.contains("active-btn");
        this.isRandom = randomBtn.classList.contains("active-btn");
    },
    updateProgress: function () {
        if (audio.duration) {
            let currentProgress = Math.floor((audio.currentTime / audio.duration) * 100);
            inputBar.value = currentProgress;
        }
    },
    repeatCurrentSong: function () {
        repeatBtn.classList.toggle("active-btn");
        randomBtn.classList.remove("active-btn");
    },
    loadRandomSong: function () {
        if (this.songsPlayed.length === this.songs.length) {
            audio.pause();
            this.songsPlayed = [];
            alert("Random Playlist Is Over!");
        } else {
            let randomIndex = 0;
            do {
                randomIndex = Math.floor(Math.random() * this.songs.length);
            } while (this.songsPlayed.some((element) => element == randomIndex) || this.currentIndex == randomIndex)
            this.songsPlayed.push(randomIndex);
            this.currentIndex = randomIndex;
            this.playSong();
        }
    },
    getRandomSong: function () {
        randomBtn.classList.toggle("active-btn");
        repeatBtn.classList.remove("active-btn");
    },
    getNextSong: function () {
        if (this.currentIndex == (this.songs.length - 1)) {
            this.currentIndex = 0;
        } else {
            this.currentIndex++;
        }
    },
    getPreviousSong: function () {
        if (this.currentIndex == 0) {
            this.currentIndex = this.songs.length - 1;
        } else {
            this.currentIndex--;
        }
    },
    getFirstSong: function () {
        this.currentIndex = 0;
    },
    playTheChoosedSong: function (currentPlace) {
        this.currentIndex = currentPlace;
        this.playSong();
    },
    activeSong: function () {
        if ($("div.active-song")) $("div.active-song").classList.remove("active-song");
        $(`div[data-index="${this.currentIndex}"]`).classList.add("active-song");
    },
    playSong: function () {
        this.activeSong(this.currentIndex);
        currentSongName.innerText = this.songs[this.currentIndex].name;
        CDimage.style.backgroundImage = `url("${this.songs[this.currentIndex].image}")`;
        audio.src = this.songs[this.currentIndex].path;
        audio.play();
    },
    start: function () {
        this.renderListSongs();
        this.handleEvents();

        this.getFirstSong();
        this.playSong();
    },

}
player.start();