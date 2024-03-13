document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const coinId = params.get('coinId');

    if (!coinId) {
        document.getElementById('coinDetails').innerHTML = '<p>Coin ID is missing.</p>';
        return;
    }

    fetch(`/api/btc-rate/${coinId}`)
        .then(response => response.json())
   
        .then(data => {
            const btcRate = data.rate;
            const formattedRate = Number(btcRate).toFixed(2);
            document.getElementById('price').innerHTML = `${formattedRate} USD`;
        })


    fetch(`/coins/${coinId}`)
        .then(response => response.json())
        .then(data => {
            const coin = data.coin;

            let reviewsContent = 'No reviews available.';
            if (coin.reviews && coin.reviews.length > 0) {
                reviewsContent = '<div class="reviews-container">' + coin.reviews.map(review =>
                    `<div class="review-card">
                        <p class="review-text">${review.reviewText}</p>
                        <p class="review-score">${review.sentimentScore}</p>
                    </div>`
                ).join('') + '</div>';
            }

            const infoHTML = `
                <h1>Name: ${coin.name}</h1>
                <h2 class="currency">Currency: <p id="price"></p></h2>
                <p>Reviews:</p>
                ${reviewsContent}
                <form class="review-form">
                    <input type="hidden" name="coinId" value="${coin._id}">
                    <label>Write your review:</label>
                    <input type="text" name="review" required><br>
                    <button type="submit">Submit Review</button>
                </form>  
            `;

            document.getElementById('coinDetails').innerHTML = infoHTML;

            document.querySelector('.review-form').addEventListener('submit', function (e) {
                e.preventDefault();
                const formData = new FormData(this);
                const reviewText = formData.get('review');

                fetch('http://127.0.0.1:5000/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ review: reviewText }),
                })
                    .then(response => response.json())
                    .then(data => {
                        fetch(`/coins/reviews/sentiment`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            },
                            body: JSON.stringify({
                                coinId: coin._id,
                                review: reviewText,
                                sentimentScore: data.vader_compound_score
                            }),
                        })
                            .then(response => response.json())
                            .then(data => {
                                console.log('Review and sentiment score saved!', data);
                                // Optionally, update the UI to reflect the added review
                            })
                            .catch(error => {
                                console.error('Error saving review:', error);
                                alert('An error occurred while saving the review.');
                            });
                    })
                    .catch(error => {
                        console.error('Error analyzing review:', error);
                        alert('An error occurred while analyzing the review.');
                    });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('coinDetails').innerHTML = '<p>Error loading coin details.</p>';
            document.getElementById('btcRateDisplay').textContent = 'Error fetching Bitcoin exchange rate.';
        });
});
