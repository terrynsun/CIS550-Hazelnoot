$(document).ready(function() {
    $('#ratings button').each(function(){
        var $this = $(this);
        var rating = $this.data('rating');

        var success = function(data, textStatus) {
            // TODO: Fill this in with stuff
            console.log('Success!');
        };
        $this.click(function(e) {
            console.log('clicked ' + rating);
            // Asynchronous POST request
            // See http://api.jquery.com/jQuery.post/
            $.post('/rating/:id', { rating: rating }, success);
            e.preventDefault();
        });
    })
});
