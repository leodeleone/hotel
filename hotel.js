// REQUER JQUERY PRÉ-DEFINIDO //

// --- Remove inline css da div page-content
$(".page-content").css("box-shadow","").css("border-radius","");

// --- Validação na busca: idade das crianças informadas
$("#busca-btn").off("click"); // Remove onclick anterior
$("#busca-btn").click(function() {
  if(idadesOK()) {
    //gerenciaCookiesBusca(); //Armazena nos cookies essa busca
    novaBusca();
  } else {
    feedbackErroIdades();
  }
});

function idadeSelecionada(crianca) {
  return $(crianca).hasClass("crianca-idade-selected");
}
function idadesOK() { // Testa se as idades de todas crianças foram informadas
  let listaCriancas = $(".seletor-idade-label").toArray();
  return listaCriancas.every(idadeSelecionada);
}
function feedbackErroIdades() {
  let listaCriancas = $(".seletor-idade-label").toArray();
  let listaCriancasErro = listaCriancas.filter(e=>!idadeSelecionada(e)); // crianças que não têm idade selecionada
  $(listaCriancasErro).parent().addClass("seletor-idade-erro");
}

// --- Promo modal --- //
$("body").append(`
  <div id="promo-modal-overlay" style="display: none;">
    <div id="promo-modal">
      <div id="promo-modal-close" onclick="closeModalPromo()"></div>
      <div class="promo-modal-header">
        <span class="promo-modal-title">Promoções</span>
      </div>
      <div id="promo-modal-content-container">
      </div>
    </div>
  </div>`);

let linkOpenPromoModal = $('.itemHotelContent .itemBtnMaisAcomodacoes');
linkOpenPromoModal.text("Ver promoções do hotel"); // Corrige texto que abre o modal;
linkOpenPromoModal.attr("onClick", "openPromoModal()"); // Troca onClick para abrir o modal

function openModalPromo() {
  $("#promo-modal-overlay").show();
}
function closeModalPromo() {
  $("#promo-modal-overlay").hide();
}

// Dado um valor, e moeda (R$ por default) retorna a string formatada
function getPrecoString(valor, moeda="R$") {
  return moeda + " " + valor.toFixed(2).replace(".",","); /* Coloca o valor com 2 casas decimais, e troca o "." por "," */
}

// Pega os dados por AJAX
function getPromos() {  
  $.get("https://www.pmweb.com.br/cro/promocoes/1.json", function(r){
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
    if(promos[i].ValorTarifaSemDesconto == ValorTarifa) { // testa se há desconto
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


/* promoCardTemplate
 `<div class="promo-card">
    <span class="promo-nome">Nome da promoção</span><!-- NomeTarifa -->
    <div class="promo-info">
      <ul class="promo-info-lista"><!-- DescricaoTarifa -->
        <li class="promo-info-item">Pague no Hotel</li>
        <li class="promo-info-item">Cancelamento Grátis</li>
        <li class="promo-info-item">Café da manhã cortesia</li>
      </ul>
    </div>
    <div class="promo-valores">
      <span class="promo-valor-sem-desconto">R$ 300,00</span><!-- TipoMoeda ValorTarifaSemDesconto -->
      <span class="promo-valor-final com-desconto">R$ 150,00</span><!-- TipoMoeda ValorTarifa -->
    </div>
    <div onclick="selecionarHotelDiretoQuartos(7, 'Hotel Faria Lima')" class="itemBtnEfetuarReserva mcolor-action-btn">RESERVAR
    </div>
  </div>` */

/* TODO */
// 1. Tooltip customizado
// <span class="promo-nome">`+res[i].NomeTarifa+`</span><div class="help-mark promo-tooltip">?<span class="promo-tooltip-text">`+res[i].RegrasTarifa+`</span></div>
// 2. Botões de reservar dentro do modal
// <div onclick="selecionarHotelDiretoQuartos(7, 'Hotel Faria Lima')" class="itemBtnEfetuarReserva mcolor-action-btn">RESERVAR
