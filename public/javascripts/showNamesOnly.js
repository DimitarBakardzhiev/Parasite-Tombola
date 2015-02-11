/**
 * Created by Dimitar on 11.2.2015 г..
 */
$('.names-only').on('click', function () {
    if ($('.hideable').is(":visible")) {
        $('.hideable').hide();
        $('.names-only').text('Покажи всичко');
    } else {
        $('.hideable').show();
        $('.names-only').text('Покажи само имена');
    }
})