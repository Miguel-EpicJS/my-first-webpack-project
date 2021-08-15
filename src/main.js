import $ from "jquery";
import "jquery-ui-bundle";
import "./style.css";

$(document).ready(function () {
    const audioBg = new Audio();
    const audio = new Audio();
    audioBg.src = "../src/Peaceful-Fantasy-Music-by-WOW-Sound.mp3";
    audioBg.volume = 0.4;
    audioBg.play();
    audioBg.loop = true;
    audioBg.muted = true;
    $("body").click(() => {
        audio.src = "../src/mixkit-retro-game-notification-212.wav";
        audio.play();
    });
    $("body").mouseenter(function () {
        if (audioBg.muted) {
            audioBg.muted = false;
        };
    });
    $("#sound").click(() => {
        $("#sound i").toggleClass("fa-volume-up fa-volume-down");
        audioBg.muted = true;
        audio.muted = true;
        if($("#sound i").hasClass("fa-volume-up"))
        {
            audioBg.muted = false;
            audio.muted = false;    
        };
    });
    class Informations {
        #imgs;
        #words;
        constructor() {
            this.#imgs =
            {
                "CENOURA": "https://freesvg.org/img/1471227826.png",
                "MAÇÃ": "https://freesvg.org/img/Peileppe_Photorealistic_Red_Apple.png",
                "CARRO": "https://freesvg.org/img/yves-guillou-car.png",
                "ANEL": "https://freesvg.org/img/PeterM-Ring.png",
                "ABACAXI": "https://freesvg.org/img/Pineapple2.png",
                "COMPUTADOR": "https://freesvg.org/img/1545450625.png",
            };
            this.#words = ["CENOURA", "MAÇÃ", "CARRO", "ANEL", "ABACAXI", "COMPUTADOR"];
        };

        get words() {
            return this.#words;
        };
        get imgs() {
            return this.#imgs;
        };
    };

    const info = new Informations();

    const imgs = info.imgs;

    const words = info.words;
    let score;
    $.get("http://127.0.0.1:3000/score", (data) => {
        score = data.score;
        $("#score").text(score);
        if (score >= 10) {
            $("#win").html(
                `
                <div>
                    <p>Parábens, você coseguiu mais de 10 pontos e ganhou!!!</p>
                </div>
                `);
            $("#win").removeClass("hide");
            setTimeout(() => {
                $("#win").addClass("hide");
                nextImages();
            }, 5000);
        };
    });
    

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        };
        return arr;
    };

    function nextImages() {
        const shuffleWords = shuffleArray(words);
        $("#word").text(shuffleWords[Math.floor(Math.random() * $("#images .image").length)]);
        for (let i = 0; i < $("#images .image").length; i++) {
            $(`#img-${i + 1} img`).attr("src", `${imgs[shuffleWords[i]]}`);
            $(`#img-${i + 1} #text-${i + 1}`).data("word", shuffleWords[i]);
        };
    };

    for (let i = 0; i < $("#images .image").length; i++) {
        $(`#img-${i + 1}`).html(`<img src="${imgs[words[i]]}" width="100%" heigh="100%">`);
        $(`#img-${i + 1}`).append(`<div class="text-section" id="text-${i + 1}" data-word="${words[i]}"></div>`);
    };
    nextImages();

    $(`.text-section`).droppable({
        drop: function (event, ui) {
            if ($("#word").text() == $(this).data("word")) {
                const audio = new Audio();
                audio.src = "../src/mixkit-retro-game-notification-212.wav";
                audio.play();
                $("#word").animate({
                    top: "0px",
                    left: "0px"
                }, 500, function () { });
                score += 1;
                $.ajax({
                    url: "http://127.0.0.1:3000/score", 
                    type: "POST", 
                    contentType: "application/json",
                    data: JSON.stringify({ "score": score })
                });
                $("#score").text(score);
            } else if($("#sound i").hasClass("fa-volume-up")) {
                $("#word").animate({
                    top: "0px",
                    left: "0px"
                }, 500, function () { });
                const audio = new Audio();
                audio.src = "../src/253886__themusicalnomad__negative-beeps.wav";
                audio.play();
            }else{
                $("#word").animate({
                    top: "0px",
                    left: "0px"
                }, 500, function () { });
            };
        }
    });

    $("#word").draggable();
    $("#reset").click(() => {
        score = 0;
        $.ajax({
            url: "http://127.0.0.1:3000/score", 
            type: "POST", 
            contentType: 'application/json',
            data: JSON.stringify({ "score": score })
        });
        $("#score").text(score);
    });

});