$(document).ready(function() {
    var $ratings = $('#ratings');
    var id = $ratings.data('id');
    var last_rating = $ratings.data('current-rating');

    $('#ratings button').each(function(){
        var $this = $(this);
        $this.button();
        var rating = $this.data('rating');

        if (rating === last_rating) {
            $this.button('toggle');
        }

        var success = function(data, textStatus) {
            if (!data.success) {
                console.log('Opposite of success');
            }
        };
        $this.click(function(e) {
            console.log('clicked ' + rating);
            // Asynchronous POST request
            // See http://api.jquery.com/jQuery.post/
            $.post('/rating/' + id, { rating: rating }, success);
            e.preventDefault();
        });
    })
});
