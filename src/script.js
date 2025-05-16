// ----------------- Capturando os elementos -----------------
const NomeMusica = document.getElementById("nome-musica"),
  NomeArtista = document.getElementById("nome-artista"),
  musica = document.getElementById("audio"),
  like = document.getElementById("favorito"),
  tocar = document.getElementById("play"),
  voltar = document.getElementById("voltar"),
  pular = document.getElementById("pular"),
  shuffle = document.getElementById("aleatorio"),
  repetir = document.getElementById("repetir"),
  barra = document.getElementById("current-progress"),
  containerBarra = document.getElementById("progress-container"),
  tempoAtual = document.getElementById("tempo-atual"),
  tempoTotal = document.getElementById("tempo-total"),
  foto = document.getElementById("foto-album");

// ----------------- Informações das musicas -----------------
const mtyk = {
    Musica: "More Than You Know",
    Artista: "Axwell / Ingrosso",
    file: "more_than_you_know",
    cor1: "rgb(236, 3, 3)",
    cor2: "rgb(80,0,27)",
    liked: false,
  },
  alone = {
    Musica: "Alone",
    Artista: "Marshmello",
    file: "alone",
    cor1: "rgb(233,87,126)",
    cor2: "rgb(130,57,214)",
    liked: false,
  },
  happier = {
    Musica: "Happier",
    Artista: "Marshmello",
    file: "happier",
    cor1: "rgb(220,161,7)",
    cor2: "rgb(242,183,9)",
    liked: false,
  };

//   Variaveis iniciais
let isplaying = false;
let isshuffled = false;
let isrepeat = false;

// Aqui ele está procurando a playlist no save do navegador, mas se ele não achar, o "??" cria uma playlist.
const playlist = JSON.parse(localStorage.getItem('playlistOriginal')) ?? [mtyk, alone, happier];

// Aqui é uma copia de segurança da playlist. Todo o serviço vai ser feito em cima dela.
let sortedPlaylist = [...playlist];
let index = 0;

// ----------------- Functions ---------------------

function tocarmusica() {
  tocar.querySelector(".bi").classList.remove("bi-play-circle-fill");
  tocar.querySelector(".bi").classList.add("botao-ativo","bi-pause-circle-fill");
  musica.play();
  isplaying = true;
}

function pausarmusica() {
  tocar.querySelector(".bi").classList.add("bi-play-circle-fill");
  tocar.querySelector(".bi").classList.remove("botao-ativo","bi-pause-circle-fill");
  musica.pause();
  isplaying = false;
}

function PlayPause() {
  if (isplaying == true) {
    pausarmusica();
  } else {
    tocarmusica();
  }
}

// O loadsong é responsavel por puxar as informações da musica atual da playlist.
function loadsong() {
  NomeArtista.innerText = sortedPlaylist[index].Artista;
  NomeMusica.innerText = sortedPlaylist[index].Musica;
  foto.src = `src/${sortedPlaylist[index].file}.webp`;
  musica.src = `src/songs/${sortedPlaylist[index].file}.mp3`;
  document.body.style.setProperty("--cortema1", sortedPlaylist[index].cor1);
  document.body.style.setProperty("--cortema2", sortedPlaylist[index].cor2);
  likeRender();
};

// O curtido é responsavel por computar a ação de like/deslike.
function curtido() {
    if(sortedPlaylist[index].liked === false){
        sortedPlaylist[index].liked = true;
    } else {
        sortedPlaylist[index].liked = false;
    }
    likeRender();
    localStorage.setItem("playlistOriginal", JSON.stringify(playlist));
}

// O likeRender é responsavel por mostrar ser o like existe ou não.
function likeRender() {
  if (sortedPlaylist[index].liked === true) {
    like.querySelector(".bi").classList.add("botao-ativo","bi-heart-fill");
    like.querySelector(".bi").classList.remove("bi-heart");
} else {
    like.querySelector(".bi").classList.remove("botao-ativo","bi-heart-fill");
    like.querySelector(".bi").classList.add("bi-heart");
  }
}

// Responsaveis por voltar/passar e criar um loop na playlist.
function voltando() {
  if (index === 0) {
    index = sortedPlaylist.length - 1;
  } else {
    index -= 1;
  }
  isplaying = false;
  loadsong();
  tocarmusica();
}

function pulando() {
  if (index === sortedPlaylist.length - 1) {
    index = 0;
  } else {
    index += 1;
  }
  isplaying = false;
  loadsong();
  tocarmusica();
}

// Responsavel por mostrar o progresso da musica na barrinha. (A ultima linha é responsavel por converter ms em hh/mm/ss)
function progresso() {
  const barwidth = (musica.currentTime / musica.duration) * 100;
  barra.style.setProperty("--progress", `${barwidth}%`);
  tempoAtual.innerText = toHHMMSS(musica.currentTime);
}

// Responsavel por traduzir o click na barra em um local da musica.
function jumpTo(event) {
  const width = containerBarra.clientWidth;
  const clickPosition = event.offsetX;
  const jumpToTime = (clickPosition / width) * musica.duration;
  musica.currentTime = jumpToTime;
}

// Responsaveis por aleatorizar a playlist (a copia).
function shuffleArray(preShuffleArray) {
  const size = preShuffleArray.length;
  let currentIndex = size - 1;
  while (currentIndex > 0) {
    let randomIndex = Math.floor(Math.random() * size);
    let aux = preShuffleArray[currentIndex];
    preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
    preShuffleArray[randomIndex] = aux;
    currentIndex -= 1;
  }
}

// Responsavel pelo botão de Shuffle.
function shuffleclicked() {
  if (isshuffled === false) {
    isshuffled = true;
    shuffleArray(sortedPlaylist);
    shuffle.querySelector(".bi").classList.add("botao-ativo");
  } else {
    isshuffled = false;
    sortedPlaylist = [...playlist];
    shuffle.querySelector(".bi").classList.remove("botao-ativo");
  }
}

// Responsavel pelo botão de Repetir.
function repetirClicado() {
  if (isrepeat === false) {
    isrepeat = true;
    repetir.querySelector(".bi").classList.add("botao-ativo");
  } else {
    isrepeat = false;
    repetir.querySelector(".bi").classList.remove("botao-ativo");
  }
}


// Responsavel por fazer a musica reiniciar ou pular ao seu fim.
function NextOuRepeat() {
  if (isrepeat === false) {
    pulando();
  } else {
    tocarmusica();
  }
}

// Responsavel por traduzir Milissegundos em Horas/Minutos/Segundos.
function toHHMMSS(originalNumber) {
  let hours = Math.floor(originalNumber / 3600);
  let min = Math.floor((originalNumber - hours * 3600) / 60);
  let sec = Math.floor(originalNumber - hours * 3600 - min * 60);

  return `${min.toString().padStart(2, "0")}:${sec
    .toString()
    .padStart(2, "0")}`;
}

// Mostra a duração da musica (depois de passar pelo processo de cima).
function totalTime() {
  tempoTotal.innerText = toHHMMSS(musica.duration);
}

// ----------------- Eventos/Botões -----------------
loadsong();
tocar.addEventListener("click", PlayPause);
voltar.addEventListener("click", voltando);
pular.addEventListener("click", pulando);
musica.addEventListener("timeupdate", progresso);
musica.addEventListener("ended", NextOuRepeat);
musica.addEventListener("loadedmetadata", totalTime);
containerBarra.addEventListener("click", jumpTo);
shuffle.addEventListener("click", shuffleclicked);
repetir.addEventListener("click", repetirClicado);
like.addEventListener("click", curtido);
