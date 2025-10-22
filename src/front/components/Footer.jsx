import { Link } from "react-router-dom";

export const Footer = () => (

	<footer className="bg-light py-3 border-top">
		<div className="container d-flex justify-content-between align-items-center fs-6">
			<p className="mb-0 fw-medium text-black text-shadow">
				Copyright © CREATED BY
				<span className="ms-1">@Lorena</span> -
				<span className="ms-1">@Erick</span> -
				<span className="ms-1">@JoseC</span>
			</p>

			<Link to="/" className="text-decoration-none">
				<span className="navbar-brand mb-0 fw-medium text-black text-shadow">WHO WE ARE</span>
			</Link>

			<div className="d-flex">
				<a href="https://youtube.com" target="_blank" rel="">
					<i className="fa-brands fa-youtube text-black mx-2"></i>
				</a>
				<a href="https://instagram.com" target="_blank" rel="">
					<i className="fa-brands fa-instagram text-black mx-2"></i>
				</a>
				<a href="https://facebook.com" target="_blank" rel="">
					<i className="fa-brands fa-facebook text-black mx-2"></i>
				</a>
				<a href="https://tiktok.com" target="_blank" rel="">
					<i className="fa-brands fa-tiktok text-black mx-2"></i>
				</a>
				<a href="https://wa.me/" target="_blank" rel="">
					<i className="fa-brands fa-whatsapp text-black mx-2"></i>
				</a>
				<a href="https://twitter.com" target="_blank" rel="">
					<i className="fa-brands fa-x-twitter text-black mx-2"></i>
				</a>
			</div>
		</div>
	</footer>
);
