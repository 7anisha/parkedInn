const Footer = () => {
    return (
        <footer className="footer bg-base-200 text-base-content p-10">
            <aside>
                <p className="text-4xl font-bold flex items-center space-x-2">
                    <img src="/logo.png" className="w-8" />
                    <span>ParkedInn</span>
                </p>
                <p>© Copyright 2024</p>
            </aside>
            <nav>
                <h6 className="footer-title">Quick Links</h6>
                <a className="link link-hover link-primary">About us</a>
                <a className="link link-hover link-primary">How it works</a>
                <a className="link link-hover link-primary">Blog</a>
                <a className="link link-hover link-primary">Contact us</a>
            </nav>
            <nav>
                <h6 className="footer-title">Legal</h6>
                <a className="link link-hover link-primary">Privacy policy</a>
                <a className="link link-hover link-primary">Terms of service</a>
                <a className="link link-hover link-primary">Terms of use</a>
            </nav>
            <nav>
                <h6 className="footer-title">Follow Us</h6>
                <div className="-mt-2 mb-2">Stay connected and never miss an update</div>
                <a href="https://facebook.com" target="_blank" className="link link-primary link-hover">Facebook</a>
                <a href="https://instagram.com" target="_blank" className="link link-primary link-hover">Instagram</a>
                <a href="https://twitter.com" target="_blank" className="link link-primary link-hover">Twitter</a>
                <a href="https://linkedin.com" target="_blank" className="link link-primary link-hover">LinkedIn</a>
            </nav>
        </footer>
    )
}

export default Footer;