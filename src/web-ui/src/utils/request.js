import Amplify, { API, Auth } from "aws-amplify";
import { retryWrapper } from "./index";

const settings = window.rekognitionSettings || {};
const region = settings.region || "eu-west-1";

Amplify.configure({
  Auth: {
    identityPoolId: settings.cognitoIdentityPool,
    region,
    mandatorySignIn: true,
    userPoolId: settings.cognitoUserPoolId,
    userPoolWebClientId: settings.cognitoUserPoolClientId,
  },
  API: {
    endpoints: [
      {
        name: "apiGateway",
        endpoint: settings.apiGateway,
        region,
        custom_header: async () => {
          const session = await Auth.currentSession();
          const token = session.getIdToken().getJwtToken();
          return { Authorization: `Bearer ${token}` };
        },
      },
    ],
  },
});

const request = (url, method, data) =>
  retryWrapper(() =>
    API[method || "get"]("apiGateway", url, {
      body: data || undefined,
      headers: { "Content-Type": "application/json" },
    })
  );

export default request;
