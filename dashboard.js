
const defaultData = {
    home: {
        badge: "Frontend Developer",
        titlePrefix: "Hi, I'm",
        titleName: "Shams Gomaa",
        description: "A passionate frontend developer building modern, interactive, and user-friendly web applications.",
        ctaPrimaryText: "View Projects",
        ctaSecondaryText: "Contact Me"
    },
    skills: [
        { id: 1, name: "HTML5 & CSS3", category: "Frontend", progress: 95 },
        { id: 2, name: "JavaScript (ES6+)", category: "Programming", progress: 90 },
        { id: 3, name: "Tailwind CSS", category: "Styling", progress: 92 },
        { id: 4, name: "Node.js & Express", category: "Backend", progress: 85 }
    ],
    about: {
        badge: "Get to know me",
        title: "Passionate about building clean code & intuitive interfaces.",
        bio1: "Hello! I'm Shams Gomaa, a web developer focused on creating sleek, responsive, and user-centric web applications. I bridge the gap between design and technical implementation.",
        bio2: "My approach emphasizes clean structure, performance optimization, and accessible digital experiences. I enjoy solving complex logic problems and constantly learning modern web ecosystems.",
        frontendSkills: ["HTML5 / CSS3", "JavaScript (ES6+)", "Tailwind CSS"],
        backendSkills: ["Node.js", "Express.js", "MongoDB", "REST APIs"]
    },
    projects: [
        {
            id: 1,
            title: "E-Commerce Hub",
            icon: "🛒",
            subtitle: "Cart & Checkout",
            description: "A dynamic online store with interactive cart management, product filtering, and clean payment interface.",
            tags: ["HTML/CSS", "JavaScript", "Tailwind"],
            bgGradient: "from-indigo-100 via-slate-50 to-indigo-50",
            status: "Featured"
        },
        {
            id: 2,
            title: "Management Dashboard",
            icon: "📊",
            subtitle: "Real-time Metrics",
            description: "An administrative control panel featuring performance analytics, data tables, and user tracking.",
            tags: ["Tailwind", "JavaScript", "REST API"],
            bgGradient: "from-teal-100 via-slate-50 to-teal-50",
            status: "Active"
        },
        {
            id: 3,
            title: "Developer Portfolio",
            icon: "🚀",
            subtitle: "Personal Site",
            description: "Modern, ultra-fast personal showcase website built with responsive layouts and customizable themes.",
            tags: ["HTML5", "Tailwind CSS", "Node.js"],
            bgGradient: "from-purple-100 via-slate-50 to-purple-50",
            status: "Active"
        }
    ],
    contactInfo: {
        email: "shams.gomaa@example.com",
        location: "Available Remotely",
        socialLinkedIn: "LinkedIn Profile",
        heading: "Let's Work Together",
        description: "Have a project idea, a question, or just want to say hello? Send me a message and I'll get back to you as soon as possible."
    },
    messages: [
        {
            id: 101,
            name: "Alexander Wright",
            email: "alex.w@example.com",
            date: "2026-08-10",
            subject: "Web Development Inquiry",
            message: "Hi Shams, I really liked your portfolio! We have an upcoming web project and would love to collaborate with you.",
            read: false
        },
        {
            id: 102,
            name: "Sarah Miller",
            email: "sarah.m@company.com",
            date: "2026-08-12",
            subject: "Frontend Developer Role",
            message: "Hello Shams, we are reviewing candidates for a remote frontend role and were impressed by your work.",
            read: true
        }
    ]
};

function getPortfolioData() {
    const data = localStorage.getItem("portfolio_db");
    if (!data) {
        localStorage.setItem("portfolio_db", JSON.stringify(defaultData));
        return defaultData;
    }
    return JSON.parse(data);
}

function savePortfolioData(data) {
    localStorage.setItem("portfolio_db", JSON.stringify(data))
    showToast("Changes saved successfully!");
}
function showToast(message) {
    let toast = document.getElementById("dashboard-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "dashboard-toast";
        toast.className = "fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 transition-all duration-300 transform translate-y-10 opacity-0";
        document.body.appendChild(toast);
    }
    toast.innerHTML = `
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
        <span class="text-sm font-medium">${message}</span>
    `;
    
    setTimeout(() => {
        toast.classList.remove("translate-y-10", "opacity-0");
    }, 10);

    setTimeout(() => {
        toast.classList.add("translate-y-10", "opacity-0");
    }, 3000);
}
