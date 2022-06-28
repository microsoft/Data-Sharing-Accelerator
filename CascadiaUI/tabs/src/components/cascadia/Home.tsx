import "./Home.css";
import { useTeamsFx } from "../lib/useTeamsFx";
import { TeamsUserCredential } from "@microsoft/teamsfx";
import { useData } from "../lib/useData";
import { Provider } from "./Provider";
import { Requester } from "./Requester";
import UploadButton from "./UploadButton";

const partner = process.env.REACT_APP_PARTNER_NAME || "";

export function Home(props: { requesterView?: boolean; environment?: string }) {
  const { environment } = {
    environment: "Requester",
    ...props,
  };
  const friendlyEnvironmentName =
    {
      provider: `Provider Selection - ${partner}`,
      requester: `Requester View - ${partner}`,
      p4: `Requester View - p4`,
    }[environment] || "Requester View";

  const { isInTeams } = useTeamsFx();
  const userProfile = useData(async () => {
    const credential = new TeamsUserCredential();
    return isInTeams ? await credential.getUserInfo() : undefined;
  })?.data;

  const userName = userProfile ? userProfile.displayName : "";

  return (
    <div className="welcome page">
      <div className="narrow">
        <h2 className="center">Welcome{userName ? ", " + userName : ""}!</h2>
        <h3 className="center">{friendlyEnvironmentName}</h3>
          {environment === "provider" && (
            <div>
              { <Provider />}
            </div>
          )}
          {environment === "requester" && (
            <div>
              {<UploadButton />}
              {<Requester />}
            </div>
          )}
          {environment === "p4" && (
            <div>
              { <Requester environment="p4" />}
            </div>
          )}
      </div>
    </div>
  );
}