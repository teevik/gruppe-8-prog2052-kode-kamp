import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";
import { Button } from "../../components/Button";
import { Layout } from "../../components/Layout";
import { ScoreRanking } from "../../components/ScoreRanking";
import { trpc } from "../../trpc";
import "./ProfilePage.css";

/**
 * ProfilePage is a React component that renders the user's profile page.
 * It displays the user's information, allows the user to delete their account,
 * and shows the user's current ranking and points.
 */
export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logOut } = useAuth();
  const { data: points } = trpc.user.points.useQuery(undefined, {
    initialData: 0,
  });
  const deleteUserMutation = trpc.user.delete.useMutation();

  /**
   * Handles the account deletion process by confirming with the user,
   * calling the delete mutation, logging out, and navigating to the home page.
   */
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

          {/* Button to delete account */}
          <Button onClick={onDeleteAccount} variant="danger">
            Delete account
          </Button>
        </div>
        <h2>Ranking</h2>
        <p>Points: {points}</p>
        {/* Displays the user's score ranking based on points */}
        <ScoreRanking progress={points} />
      </div>
    </Layout>
  );
}

