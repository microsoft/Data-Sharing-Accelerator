import * as React from "react";
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';

interface ISpinnerProps {
  spinnerText?: string;
}

export class ISpinner extends React.Component<ISpinnerProps, {}> {
  constructor(props: ISpinnerProps) {
    super(props);

    this.state = {
      isSaving: false
    };
  }

  public static defaultProps = {
    spinnerText: "Transmitting please wait..."
  };

  public render() {
    return (
      <div>
        <Spinner size={SpinnerSize.medium} label={this.props.spinnerText} ariaLive="assertive" labelPosition="bottom" />
      </div>
    );
  }
}
