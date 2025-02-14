const users = {
    "admin@slr-ds.mail.com": { password: "admin86123456", role: "Admin" },
    "cireundeu@slr-ds.mail.com": { password: "crd86123456", role: "Desa Cireundeu" },
    "cikuya@slr-ds.mail.com": { password: "cky86123456", role: "Desa Cikuya" },
    "cikareo@slr-ds.mail.com": { password: "ckr86123456", role: "Desa Cikareo" },
    "cikasungka@slr-ds.mail.com": { password: "cks86123456", role: "Desa Cikasungka" },
    "pasanggrahan@slr-ds.mail.com": { password: "psg86123456", role: "Desa Pasanggrahan" },
    "solear@slr-ds.mail.com": { password: "slr86123456", role: "Desa Solear" },
    "munjul@slr-ds.mail.com": { password: "slr86123456", role: "Desa Munjul" }
};

// Fungsi untuk menangani login
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const captchaInput = document.getElementById("captchaInput").value;
            const captchaText = document.getElementById("captcha-text").textContent;

            // Cek email dan password
            if (!users[email] || users[email].password !== password) {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Gagal!',
                    text: 'Email atau Password salah!',
                    timer: 1000, // Menghilang otomatis dalam 1 detik
                    showConfirmButton: false
                });
                return;
            }

            // Cek captcha
            if (captchaInput !== captchaText) {
                Swal.fire({
                    icon: 'error',
                    title: 'Captcha Salah!',
                    text: 'Silakan coba lagi.',
                    timer: 1000, // Menampilkan selama 1 detik
                    showConfirmButton: false
                });
                generateCaptcha(); // Refresh Captcha setelah salah
                return;
            }

            // Tampilkan loading selama 1,5 detik
            Swal.fire({
                title: 'Memproses..',
                html: 'Mohon tunggu sebentar..',
                timer: 1500,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            }).then(() => {
                // Setelah loading selesai, simpan sesi login dan tampilkan pesan sukses
                localStorage.setItem("loggedInUser", email);
                sessionStorage.setItem("isLoggedIn", "true");

                Swal.fire({
                    icon: 'success',
                    title: 'Login Berhasil!',
                    text: `Selamat datang, ${users[email].role}`,
                    showConfirmButton: false,
                    timer: 2000 // Menghilang otomatis dalam 2 detik
                }).then(() => {
                    window.location.href = "dashboard.html"; // Redirect ke halaman dashboard
                });
            });
        });
    }

    // Fungsi untuk menghasilkan Captcha acak (huruf kecil dan angka)
    function generateCaptcha() {
        const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        let captcha = "";
        for (let i = 0; i < 4; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        document.getElementById("captcha-text").textContent = captcha;
    }

    // Event listener untuk refresh captcha
    document.getElementById("refreshCaptcha").addEventListener("click", generateCaptcha);

    // Panggil Captcha pertama kali saat halaman dimuat
    generateCaptcha();
});

// Fungsi untuk menampilkan/menghilangkan password
document.addEventListener("DOMContentLoaded", function () {
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                togglePassword.classList.remove("fa-eye");
                togglePassword.classList.add("fa-eye-slash");
            } else {
                passwordInput.type = "password";
                togglePassword.classList.remove("fa-eye-slash");
                togglePassword.classList.add("fa-eye");
            }
        });
    }
});

// Fungsi logout (mirip dengan session_destroy() di PHP)
function logout() {
    // Menghapus sesi pengguna
    localStorage.removeItem("loggedInUser");
    sessionStorage.removeItem("isLoggedIn"); // Hapus sesi login
    window.location.href = "index.html"; // Redirect ke halaman login
}

// Cegah pengguna kembali ke dashboard setelah logout
window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
        sessionStorage.removeItem("isLoggedIn");
        window.location.href = "index.html"; // Kembali ke halaman login
    }
});
