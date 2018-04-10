// --- Alterações na Página --- //

// Injeta CSS (corrigir path)
/*
var linkCSS = document.createElement("link");
linkCSS.href = "_path_/hotel.css";
linkCSS.type = "text/css";
linkCSS.rel = "stylesheet";
document.getElementsByTagName("head")[0].appendChild(linkCSS);
*/

// Remove inline css da div page-content
$(".page-content").css("box-shadow","").css("border-radius","");

// Validação na busca: idade das crianças informadas
$("#busca-btn").off("click"); // Remove onclick anterior
$("#busca-btn").click(function() {
  if(idadesOK()) {
    //gerenciaCookiesBusca(); //Armazena nos cookies essa busca
    novaBusca();
  } else {
    feedbackErroIdades();
  }
});

// Injeta o modal de promoções (sem conteúdo)
$("body").append(`
  <div id="promo-modal-overlay" style="display: none;">
    <div id="promo-modal">
      <div id="promo-modal-close" onclick="closePromoModal()"></div>
      <div class="promo-modal-header">
        <span class="promo-modal-title">Promoções</span>
      </div>
      <div id="promo-modal-content-container">
      </div>
    </div>
  </div>`);
// Ou $("body").load( "_path_/promo-modal.html"); (corrigir path)

// Altera texto e onclick dos links para abrir o modal de promoções
let linksOpenPromoModal = $('.itemHotelContent .itemBtnMaisAcomodacoes');
linksOpenPromoModal.text("Ver promoções do hotel"); // Corrige texto que abre o modal;
linksOpenPromoModal.each( (idx,elem) => { // Troca onClick para abrir o modal passando id do Hotel
  let idHotel = getIdHotelFromFnCall($(elem).attr("onClick"));
  $(elem).attr("onClick", "openPromoModal("+idHotel+")");
});

// --- Funções --- //

// -- Validação do form de busca -- //
// Testa se um seletor de idade foi selecionado
function idadeSelecionada(crianca) {
  return $(crianca).hasClass("crianca-idade-selected");
}
// Testa se as idades de todas crianças foram informadas
function idadesOK() {
  let listaCriancas = $(".seletor-idade-label").toArray(); // converte para array para usar método every
  return listaCriancas.every(idadeSelecionada);
}
// Retorna feedback de erro por não selecionar a idade das crianças
function feedbackErroIdades() {
  let listaCriancas = $(".seletor-idade-label");
  let listaCriancasErro = listaCriancas.filter(e=>!idadeSelecionada(e)); // crianças que não têm idade selecionada
  $(listaCriancasErro).parent().addClass("seletor-idade-erro");
}

// -- Promo modal -- //
// Retorna o ID do hotel pela chamada da função no evento onclick do botão Reservar
function getIdHotelFromFnCall(fnCall) {
  let split = fnCall.split(/[()]/); // retorna [ fnName, fnParams, "" ]
  let fnParams = split[1].split(/, +/); // retorna uma lista com os parâmetros [ idHotel, 'nomeHotel' ]
  return parseInt(fnParams[0]); // retorno do idHotel parseado
}
// Carrega os dados das promoções do hotel específico e abre o modal
function openPromoModal(idHotel) {
  idHotel = parseInt(idHotel);
  if(!idHotel) return; // Validação básica. Não enviar requisição caso não tenha vindo um número

  getPromos(idHotel);
  $("#promo-modal-overlay").show();
}
// Fecha o modal de promoções
function closePromoModal() {
  $("#promo-modal-overlay").hide();
}
// Dado um valor, e moeda (R$ por default) retorna a string formatada
function getPrecoString(valor, moeda="R$") {
  return moeda + " " + valor.toFixed(2).replace(".",","); /* Coloca o valor com 2 casas decimais, e troca o "." por "," */
}
// Pega os dados por AJAX
function getPromos(idHotel) {
  idHotel = parseInt(idHotel);
  if(!idHotel) return; // Validação básica. Não enviar requisição caso não tenha vindo um número

  $.get("https://www.pmweb.com.br/cro/promocoes/"+idHotel+".json", function(r){
    fillPromoModalData(r);
  });
}
// Dado uma lista de promoções, as preenche no corpo do modal
function fillPromoModalData(promos) {
  let promoContainer = $("#promo-modal-content-container");
  let promoContainerHTML = ``;

  for (let i = 0; i < promos.length; i++) {
    if( i%3 == 0 ) promoContainerHTML += `<div class="promo-card-row">`; // primeira promo da linha //
    let htmlListaItens = ``;
    promos[i].DescricaoTarifa.forEach(item => htmlListaItens += `<li class="promo-info-item">`+item+`</li>`); // monta lista de infos em htmlListaItens
    promoContainerHTML += `
      <div class="promo-card">
        <span class="promo-nome">`+promos[i].NomeTarifa+`</span><div class="help-mark" title="`+promos[i].RegrasTarifa+`">?</div>
        <div class="promo-info">
          <ul class="promo-info-lista">
            `+htmlListaItens+`
          </ul>
        </div>
        <div class="promo-valores">`;
    if(promos[i].ValorTarifaSemDesconto == promos[i].ValorTarifa) { // testa se há desconto
      promoContainerHTML += `
          <span class="promo-valor-final>`+getPrecoString(promos[i].ValorTarifa,promos[i].TipoMoeda)+`</span>`;
    } else {
      promoContainerHTML += `
          <span class="promo-valor-sem-desconto">`+getPrecoString(promos[i].ValorTarifaSemDesconto,promos[i].TipoMoeda)+`</span>
          <span class="promo-valor-final com-desconto">`+getPrecoString(promos[i].ValorTarifa,promos[i].TipoMoeda)+`</span>`;
    }
    promoContainerHTML += `
        </div>
        <div class="itemBtnEfetuarReserva mcolor-action-btn">RESERVAR</div>
      </div>`;
    if( (i-2)%3 == 0 ) promoContainerHTML += `</div>`;  // última promo da fila //
  }
  promoContainer.html(promoContainerHTML);
}

/* TODO */
// 1. Tooltip customizado
// <span class="promo-nome">`+res[i].NomeTarifa+`</span><div class="help-mark promo-tooltip">?<span class="promo-tooltip-text">`+res[i].RegrasTarifa+`</span></div>
// 2. Botões de reservar dentro do modal
// <div onclick="selecionarHotelDiretoQuartos(7, 'Hotel Faria Lima')" class="itemBtnEfetuarReserva mcolor-action-btn">RESERVAR