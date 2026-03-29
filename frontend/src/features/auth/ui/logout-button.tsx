import { logoutAction } from "../model/actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button className="ghost-button" type="submit">
        Logout
      </button>
    </form>
  );
}
