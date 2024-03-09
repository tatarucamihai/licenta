document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const coinId = params.get('coinId');

    if (!coinId) {
        document.getElementById('coinDetails').innerHTML = '<p>Coin ID is missing.</p>';
        return;
    }

    fetch(`/coins/${coinId}`)
        .then(response => response.json())
        .then(data => {
            const coin = data.coin; // Access the nested 'coin' object

            let reviewsContent = 'No reviews available.';
            if (coin.reviews && coin.reviews.length > 0) {
                reviewsContent = '<div class="reviews-container">' + coin.reviews.map(review =>
                    `<div class ="review-card>"
                    <p class = "review-text"> ${review.reviewText}</p>
                    <p class = "review-score"> ${review.sentimentScore}</p>
                    </div>
                    `
                ).join('') + '</div>';
            }


            document.getElementById('coinDetails').innerHTML = `
            <label>Write your review:</label>    
            <h1>Name: ${coin.name}</h1>
                <p>Price: ${coin.price}</p>
                <p>Reviews:</p>
                ${reviewsContent}
                
                
            `;
        })
        
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('coinDetails').innerHTML = '<p>Error loading coin details.</p>';
        });
});
