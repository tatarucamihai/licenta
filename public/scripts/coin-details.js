
document.addEventListener('DOMContentLoaded', function() {



    const params = new URLSearchParams(window.location.search);
    const coinId = params.get('coinId');

    if (!coinId) {
        document.getElementById('coinDetails').innerHTML = '<p>Coin ID is missing.</p>';
        return;
    }

    fetch(`/coins/${coinId}`)
        .then(response => response.json())
        .then(data => {
            const coin = data.coin;

            let reviewsContent = 'No reviews available.';
            if (coin.reviews && coin.reviews.length > 0) {
                reviewsContent = '<ul>' + coin.reviews.map(review =>
                    `<li>
                        <p class="review-text">${review.reviewText}</p>
                        <p class="review-score">${review.sentimentScore}</p>
                     </li>`
                ).join('') + '</ul>';
            }

            const infoHTML = `
                <h1>Name: ${coin.name}</h1>
                <h2 class="currency">Current Price: <span id="price">Loading...</span> </h2>
                
                
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

            // Update the currency value after setting the innerHTML
            updateCurrencyValue(coin.coinType);

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
                                'Authorization': `Bearer ${localStorage.getItem('token')}`//Pt a nu putea fi vazut decat de useri logati
                            },
                            body: JSON.stringify({//serializare
                                coinId: coin._id,
                                review: reviewText,
                                sentimentScore: data.vader_compound_score
                            }),
                        })
                            .then(response => response.json())//deserializare, apelam metoda json() pentru a face paresing la 
                            //obiectul "data" primit
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
        });
        


    function updateCurrencyValue(coinType) {
        
        let apiEndpoint;
        switch (coinType) {
            case 'BTC':
                apiEndpoint = `/api/btc-coin`;
                break;
            case 'DASH':
                apiEndpoint = `/api/dash-coin`;
                break;

            case 'AUR':
                apiEndpoint = `/api/aurora-coin`;
                break;
            case 'DOGE':
                apiEndpoint = `/api/doge-coin`;
                break;
            case 'ETH':
                apiEndpoint = `/api/eth-coin`;
                break;
            case 'LTC':
                apiEndpoint = `/api/lite-coin`;
                break;

        }

        let lastRates = JSON.parse(localStorage.getItem('lastRates')) || {
            BTC: undefined,
            DASH: undefined,
            AUR: undefined,
            DOGE: undefined,
            ETH: undefined,
            LTC: undefined
        };

        if (apiEndpoint) {
            fetch(apiEndpoint)
                .then(response => response.json())
                .then(data => {
                    const formattedRate = Number(data.rate).toFixed(2);
                    document.getElementById('price').textContent = `${formattedRate} USD`;

                    if (typeof lastRates[coinType] === 'undefined') {
                        lastRates[coinType] = formattedRate;
                    } else {
                        let rateDifference = formattedRate - lastRates[coinType];
                        console.log(rateDifference)
                        if (rateDifference) {
                            updateFeed(coinType, lastRates[coinType], formattedRate);
                            console.log('Function called')
                        }
                    }

                    lastRates[coinType] = formattedRate;
                    localStorage.setItem('lastRates', JSON.stringify(lastRates));
                })
                .catch(error => {
                    console.error('Error fetching currency rate:', error);
                    document.getElementById('price').textContent = 'Error fetching rate';
                });
        }
        else {
            console.error('Feed element not found')
        }
    }

    function updateFeed(coinType, lastRate, formattedRate) {
       
            let change = formattedRate - lastRate;
            change = Math.abs(change).toFixed(2);
            formattedRate = parseFloat(formattedRate).toFixed(2);
            const coinData = { coinType, change, formattedRate };
            localStorage.setItem('coinData', JSON.stringify(coinData))
     
    }

})



