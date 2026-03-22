import { NavLink } from "react-router-dom";

function MainMenu({ labels }) {
  const menuItems = [
    { to: "/home", text: labels.home },
    { to: "/medicines", text: labels.medicineReminders },
    { to: "/appointments", text: labels.appointments },
    { to: "/exercises", text: labels.exercises || "Workouts" }
  ];

  return (
    <nav className="panel main-menu" aria-label={labels.mainMenu}>
      {menuItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `menu-link ${isActive ? "menu-link-active" : ""}`}
        >
          {item.text}
        </NavLink>
      ))}
    </nav>
  );
}

export default MainMenu;
