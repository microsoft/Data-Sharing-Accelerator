import "./Deploy.css";
import * as React from 'react';
import { TextField } from '@fluentui/react/lib/TextField';
import { Label } from '@fluentui/react/lib/Label';
import { DetailsList, DetailsListLayoutMode, IColumn, SelectionMode } from '@fluentui/react/lib/DetailsList';
//import * as RequestData from "../../data/requests.json";
import { IRequestItem } from "./IRequestItem";
import { getNewColumns, getRequestsAsync, filterOptions, 
  filter, filterFields, ChildClass, getMaxCreatedon, columns, onRenderDetailsHeader } from "./common";
import { ISpinner } from "../Common/l2hSpinner";
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { ScrollablePane } from '@fluentui/react/lib/components/ScrollablePane/ScrollablePane';
import { ScrollbarVisibility } from '@fluentui/react/lib/components/ScrollablePane/ScrollablePane.types';
import { DialogData, CasDialogType } from './DialogData';

export interface DeliverTo {
  Latitude: number,
  Longitude: number
}

export enum RequestType {
  Item = "Item",
  Personnel = "Personnel",
}

export enum Status {
  Accepted = "Accepted",
  Open = "Open",
}

export interface IRequesterState {
  columns: IColumn[];
  items: IRequestItem[];
  isSaving?: boolean;
  selectedFilter?: string | number;
  filterText?: string;
}

interface IRequesterProps {
  environment?: string;
}

const refreshCallback = () => {}

export class Requester extends React.Component<{environment?: string}, IRequesterState> {
  private _allItems: IRequestItem[] = [];
  private _env?: string;
  private _maxCreatedDate?: string;

  constructor(props: IRequesterProps) {
    super(props);

    //this._allItems = RequestData.requests;
    this._env = props.environment;

    columns.push (
      { key: 'column11',
      name: '',                              
      fieldName: '',            
      minWidth: 10,
      maxWidth: 10,                
      onRender: (item: IRequestItem) => {
        return <DialogData type={CasDialogType.view} requests={[item]} refresh={refreshCallback} />;
      },
      isResizable: false, } 
    )

    this.state = {
      items: this._allItems,
      columns: columns,
      selectedFilter: filterFields.msnfpItemName,
    };
  }

  async componentDidMount() {
    this.setState({ isSaving: true });
    this._allItems = await getRequestsAsync(this._env) as IRequestItem[];
  
    this._maxCreatedDate = getMaxCreatedon (this._allItems);

    this.setState({ items: this._allItems,
                    isSaving: false });
  }

  public render(): JSX.Element {
    const { items, columns, isSaving, selectedFilter, filterText } = this.state;
    return (
      <div className="ms-Grid">
        <div>
          { isSaving ? (<ISpinner spinnerText= "Retrieving data..." />) : ( <div> </div> ) }
        </div>
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm4 ms-x3">
              <Dropdown
                className={ChildClass}
                label="Select a filter"
                defaultSelectedKey={selectedFilter}
                onChange={this._onChange}
                options={filterOptions}
              />
          </div>
          <div className="ms-Grid-col ms-sm4 ms-x3">
              <TextField
                className={ChildClass}
                label="Filter text:"
                onChange={this._onFilter}
                defaultValue={filterText}
              />
          </div>
          <div className="ms-Grid-col ms-sm4 ms-x6">
              <Label
                className={ChildClass} style= {{ marginTop:20 }}>{this._maxCreatedDate} 
              </Label>
          </div>
        </div>  
        <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto} style={{height: '600', marginTop: '200', marginLeft: '75', marginRight: '75'}}>
          <DetailsList
            compact={true}
            items={items}
            columns={columns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            onRenderDetailsHeader={onRenderDetailsHeader}
            selectionMode={SelectionMode.none}
            onColumnHeaderClick={this._onColumnClick}
          />
        </ScrollablePane>
      </div>
    );
  }

  private _onColumnClick = (ev: React.MouseEvent<HTMLElement> | undefined, column: IColumn | undefined): void => {
    const { columns, items } = this.state;
    const [ newColumns, newItems] = getNewColumns(columns, column, items);
    this.setState({
      columns: newColumns,
      items: newItems,
    });
  }

  private _onChange = (ev: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number): void => {
    const { filterText } = this.state;
    this.setState ({
      items: filter (this._allItems, option?.key, filterText),
      selectedFilter: option?.key,
    })
  }

  private _onFilter = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, 
                       text?: string): void => {
    const { selectedFilter } = this.state;
    this.setState({
      items: filter (this._allItems, selectedFilter, text),
      filterText: text,
    });
  };
};
