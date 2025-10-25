import { Link } from "react-router-dom";

export const Footer = () => (
	<footer className="bg-light py-3 border-top">
		<div className="container-fluid p-0">
			<div className="row align-items-center text-center text-md-start">

				<div className="col-12 col-md-4 mb-2 mb-md-0 d-flex justify-content-center justify-content-md-start">
					<p className="mb-0 fw-medium text-black text-shadow small text-nowrap">
						© CREATED BY
						<span className="ms-1">@Lorena</span> -
						<span className="ms-1">@Erick</span> -
						<span className="ms-1">@JoseC</span>
					</p>
				</div>


				<div className="col-12 col-md-4 mb-2 mb-md-0 d-flex justify-content-center">
					<Link to="/" className="text-decoration-none">
						<span className="navbar-brand mb-0 fw-medium text-black text-shadow fs-6">
							WHO WE ARE
						</span>
					</Link>
				</div>


				<div className="col-12 col-md-4 d-flex justify-content-center justify-content-md-end">
					<div>
						<a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
							<i className="fa-brands fa-youtube text-black mx-2"></i>
						</a>
						<a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
							<i className="fa-brands fa-instagram text-black mx-2"></i>
						</a>
						<a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
							<i className="fa-brands fa-facebook text-black mx-2"></i>
						</a>
						<a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
							<i className="fa-brands fa-tiktok text-black mx-2"></i>
						</a>
						<a href="https://wa.me/" target="_blank" rel="noopener noreferrer">
							<i className="fa-brands fa-whatsapp text-black mx-2"></i>
						</a>
						<a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
							<i className="fa-brands fa-x-twitter text-black mx-2"></i>
						</a>
					</div>
				</div>
			</div>
		</div>
	</footer>
);