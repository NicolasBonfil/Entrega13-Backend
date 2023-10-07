const logout = document.getElementById("logout")

logout.addEventListener("click", () => {
    fetch("/api/session/logout", {
        method: "POST"
    })
    .then(response => {
        if(response.status === 200){
            localStorage.removeItem('token')
            window.location.replace("/login")
        }
    })
})