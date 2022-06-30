import { ProfileCard } from "./ProfileCard";

export function PersonCardFluentUI(props: {
  loading?: boolean; error?: any; data?: {
    profile: any;
    photoUrl: string;
  } | undefined
}) {
  return (
    <div className="section-margin">
      {props.loading && ProfileCard(true)}
      {!props.loading && props.error && (
        <div className="error">
          Failed to read your profile. Please try again later. <br /> Details: {props.error.toString()}
        </div>
      )}
      {!props.loading && props.data && ProfileCard(false, props.data)}
    </div>
  )
}