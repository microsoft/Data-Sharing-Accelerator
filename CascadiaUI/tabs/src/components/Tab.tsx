import React from "react";
import { Home } from "./cascadia/Home";
import { useTeamsFx } from "./lib/useTeamsFx";

var View = Boolean(process.env.REACT_APP_VIEW_NAME);

export default function Tab() {
  const { themeString } = useTeamsFx(); 

  return (
    <div className={themeString === "default" ? "" : "dark"}>
      <Home requesterView={View} environment={process.env.REACT_APP_VIEW_NAME?.toLocaleLowerCase()} />
    </div>
  );
}
