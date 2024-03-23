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
            console.log(info)


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

        });
});





