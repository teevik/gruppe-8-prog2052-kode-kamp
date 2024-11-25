import { Button } from "../../components/Button";
import { Layout } from "../../components/Layout";
import { ScoreRanking } from "../../components/ScoreRanking";
import { useAuth } from "../../user";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, logOut } = useAuth();

  const points = 47;

  return (
    <Layout showNav showFooter>
      <div className="profilePage">
        <h1>Your profile</h1>
        <h2>User info</h2>
        <div className="userInfo">
          {/** TODO: Add show icon if user is verified, show text "you are not verified... check email" if not */}
          <p>Username: {user?.username}</p>
          <p>Email: {user?.email}</p>

          <Button
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete your account?")
              ) {
                // TODO: Delete user
              }
            }}
            variant="danger"
          >
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
