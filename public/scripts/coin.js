document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token')

    if (!token) {
        document.getElementById('coinInfo').innerHTML = '<p>Please login to view your coins!</p>'
        return
    }

    fetch('/coins', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            const info = document.getElementById('coinInfo');


            if (data.coins && data.coins.length > 0) {
                info.innerHTML = data.coins.map(coin =>
                    `<div class = "coin-container">
                        <p>Name: ${coin.name}</p>
                        <a href="/coin-details.html?coinId=${coin._id}" class="view-details-btn">View Details</a>
                    </div>`
                ).join('');
            } else {
                info.innerHTML = '<p>No coins found.</p>';
            }

            document.querySelectorAll('.review-form').forEach(form => {
                form.addEventListener('submit', function (e) {
                    e.preventDefault();
                    const formData = new FormData(form);
                    const coinId = formData.get('coinId');
                    const review = formData.get('review');

                    // Sending the review to the sentiment analysis endpoint
                    fetch('http://127.0.0.1:5000/analyze', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ review }),
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Analyzed!', data);

                            // Saving the review and the sentiment score to your database
                            fetch(`/coins/reviews/sentiment`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ coinId, review, sentimentScore: data.vader_compound_score }), // Adjust this key based on your response structure
                            })
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Network response was not ok ' + response.statusText);
                                    }
                                    return response.json();
                                })
                                .then(data => {
                                    console.log('Review and sentiment score saved!', data);
                                    // Optionally, update the UI to reflect the added review
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                    alert('An error occurred while adding the review.');
                                });
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            alert('An error occurred while analyzing the review.');
                        });
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            info.innerHTML = '<p>Error loading coins.</p>';
        });
});


//Script for coin details page


