import buildClient from "../api/buildClient";
import BaseLayout from "../components/BaseLayout";

const LandingPage = ({ currentUser }) => {
  return (
    <BaseLayout currentUser={currentUser}>
      {currentUser ? (
        <h1>You are signed in</h1>
      ) : (
        <h1>You are not signed in</h1>
      )}
    </BaseLayout>
  );
};
  
export default LandingPage;
export const getServerSideProps = async (context) => {
  console.log('LANDING PAGE')
  const client = buildClient(context);
  const currentUserRes = await client.get("/api/users/currentuser");
  currentUser = currentUserRes.data
  return { props: { currentUser } };
};