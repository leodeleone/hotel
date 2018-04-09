// $(".page-content").css("box-shadow","").css("border-radius","")
var pageContent = document.getElementsByClassName("page-content");
pageContent.style.boxShadow = "";
pageContent.style.borderRadius = "";

// $("#listagemHoteisContent").addClass("clearfix");
var listagemHoteisContent = document.getElementById("listagemHoteisContent");
listagemHoteisContent.classList.add("clearfix");

// $($(".seletor-idade-label").toArray().filter(e => !e.classList.contains("crianca-idade-selected"))).parent().css("border","solid 1px orange")
var idadeCriancaNaoInformada = [];
var criancaAtual;
var i = 0;

while( criancaAtual = document.getElementsByClassName("seletor-idade-label").item(i) ) { // inicialmente pegar todas "crianças"
    idadeCriancaNaoInformada.push(criancaAtual);
    i++;
}

idadeCriancaNaoInformada = idadeCriancaNaoInformada.filter(e => {
    return !e.classList.contains("crianca-idade-selected"); // crianças que não contem classe "selected"
});

idadeCriancaNaoInformada.forEach(e => e.parentNode.classList.add("seletor-idade-erro")); // para cada uma, adiciona borda no pai


$("body").append(`modal.html`);

$("#promo-modal-overlay").toggle();
