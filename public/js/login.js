const loginEmail = document.getElementById('email');
const loginPassword = document.getElementById('password');

async function login(e) {
    try {
        e.preventDefault();

        const loginDetails = {
            email: loginEmail.value,
            password: loginPassword.value
        }
        const res = await axios.post(`/userAuthentication`, loginDetails)
        localStorage.setItem('token', res.data.token)
        window.location.href = '/blogs';
    } catch (err) {
        if (
            err.response && (err.response.status === 400 || err.response.status === 404 || err.response.status === 422 || errresponse.status === 500)
          ) {
            alert(err.response.data.error);
          } else {
            alert("An error occurred.");
          }
    }
}