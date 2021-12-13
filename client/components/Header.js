import Link from "next/link";

const Header = ({ currentUser }) => {
  const navLinks = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "My Orders", href: "/orders" },
    currentUser && { label: "Sell Tickets", href: "/tickets/new" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((visible) => visible)
    .map((item) => {
      return (
        <li className="nav-item" key={item.label}>
          <Link href={item.href}>
            <a className="nav-link">{item.label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">Get Tickets</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{navLinks}</ul>
      </div>
    </nav>
  );
};

export default Header;
