const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');

async function signup(e) {
    try {
        e.preventDefault();
        const userDetails = {
            name: name.value,
            email: email.value,
            password: password.value
        };

        const res = await axios.post('/users', userDetails)
        alert(res.data.message)
        window.location.href = '/login';
    } catch (err) {
        if (err.response && (err.response.status === 400 || errresponse.status === 500)) {
            alert(err.response.data.error);
        } else {
            alert('An error occurred.');
        }
    }
}