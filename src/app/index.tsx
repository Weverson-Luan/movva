/**
 * IMPORTS
 */
import { Redirect } from "expo-router";

const App = () => {
  const userData = {
    token: "ksaja",
    name: "luan",
  };

  if (!userData.token) {
    return <Redirect href={"/(private)/dashboard"} />;
  }

  return <Redirect href={"/signin"} />;
};

/**
 * EXPORTS
 */
export default App;
