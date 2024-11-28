import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";
import { Button } from "../../components/Button";
import { Layout } from "../../components/Layout";
import { ScoreRanking } from "../../components/ScoreRanking";
import { trpc } from "../../trpc";
import "./ProfilePage.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logOut } = useAuth();
  const { data: points } = trpc.user.points.useQuery(undefined, {
    initialData: 0,
  });
  const deleteUserMutation = trpc.user.delete.useMutation();

  async function onDeleteAccount() {
    if (window.confirm("Are you sure you want to delete your account?")) {
      await deleteUserMutation.mutateAsync();
      logOut();
      navigate("/");
    }
  }

  return (
    <Layout showNav showFooter>
      <div className="profilePage">
        <h1>Your profile</h1>
        <h2>User info</h2>
        <div className="userInfo">
          {/** TODO: Add show icon if user is verified, show text "you are not verified... check email" if not */}
          <p>Username: {user?.username}</p>
          <p>Email: {user?.email}</p>

          <Button onClick={onDeleteAccount} variant="danger">
            Delete account
          </Button>
        </div>
        <h2>Ranking</h2>
        <p>Points: {points}</p>
        <ScoreRanking progress={points} />
      </div>
    </Layout>
  );
}
