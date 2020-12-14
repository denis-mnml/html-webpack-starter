import Inputmask from 'inputmask';

$(function () {
  Inputmask({ mask: '+375 (99) 999-99-99', showMaskOnHover: false }).mask($('input[type=tel], input[data-type=tel]'));
});
