/* =========================================
    Typing Animation (Professional Version)
    ========================================= */

const typingLines = [
    "👋 Hey there! I'm Soumya",
    "🎓 B.Tech CSE Student & Developer",
    "💻 Passionate about building cool tech",
    "🧠 Learning: Python, Java, C, Web Dev",
    "🔥 Creating: Portfolio, Apps, Projects",
    "📫 Connect with me on LinkedIn!",
    "🚀 Creativity + Code = Magic"
];

const typingElement = document.getElementById("typing");
let line = 0;
let char = 0;
let isDeleting = false;

function typeEffect() {
    const currentLine = typingLines[line];

    // Add or remove characters
    typingElement.innerHTML = currentLine.substring(0, char);

    if (!isDeleting) {
        // Typing forward
        if (char < currentLine.length) {
            char++;
            setTimeout(typeEffect, 70);
        } else {
            // End pause
            setTimeout(() => (isDeleting = true), 1000);
            setTimeout(typeEffect, 1000);
        }
    } else {
        // Deleting backwards
        if (char > 0) {
            char--;
            setTimeout(typeEffect, 40);
        } else {
            isDeleting = false;
            line = (line + 1) % typingLines.length;
            setTimeout(typeEffect, 300);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    typeEffect();
});

/* =========================================
    EmailJS Contact Form (Error Handling Added)
    ========================================= */

(function () {
    if (typeof emailjs !== 'undefined') {
        emailjs.init("u1ubiB9-EbrJEI3Ce"); 
    } else {
        console.error("EmailJS SDK not loaded. Check script tag in index.html.");
    }
})();

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("form-status");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        formStatus.innerText = "Sending...";
        formStatus.style.color = "#0f9";

        emailjs
            .sendForm("service_soumya74", "template_7v2pu0o", this)
            .then(
                () => {
                    formStatus.innerText = "Message sent successfully! 🎉";
                    formStatus.style.color = "#0f9";
                    contactForm.reset();
                },
                (error) => {
                    console.error("EmailJS Error:", error);
                    formStatus.innerText = "Failed to send. Please try again.";
                    formStatus.style.color = "#f00";
                }
            );
    });
}

/* =========================================
    Smooth Scroll for Menu Links
    ========================================= */

document.querySelectorAll("nav ul li a").forEach((link) => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        target.scrollIntoView({ behavior: "smooth" });
    });
});

/* =========================================
    Scroll Animation Trigger Enhancements (AOS)
    ========================================= */

if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 1000,
        once: true,
        easing: "ease-in-out",
    });
} else {
    console.warn("AOS library not loaded. Scroll animations are disabled.");
}
