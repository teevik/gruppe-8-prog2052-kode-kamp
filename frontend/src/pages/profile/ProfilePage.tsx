import { useAuth } from "../../user";

export default function ProfilePage() {
  const { user, logOut } = useAuth();

  return (
    <div className="profilePage">
      <p>{user?.username}</p>
      <p>{user?.email}</p>
    </div>
  );
}
