import { Redirect } from "expo-router";

export default function Index() {
  const logined = false;
  return (
    <>
      {logined ? <Redirect href="/(tabs)" /> : <Redirect href="/onboarding" />}
    </>
  );
}
