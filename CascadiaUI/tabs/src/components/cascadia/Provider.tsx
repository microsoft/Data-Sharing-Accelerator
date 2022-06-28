import "./Deploy.css";
import * as React from 'react';
import { Announced } from '@fluentui/react/lib/Announced';
import { TextField, Label } from '@fluentui/react';
import { DetailsList, DetailsListLayoutMode, Selection, IColumn } from '@fluentui/react/lib/DetailsList';
import { MarqueeSelection } from '@fluentui/react/lib/MarqueeSelection';
//import * as RequestData from "../../data/requests.json";
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { IRequestItem } from "./IRequestItem";
import { ISpinner } from "../Common/l2hSpinner";
import { getRequestsAsync, filter, getNewColumns, 
         filterOptions, filterFields, ChildClass, getMaxCreatedon, columns, onRenderDetailsHeader, Status } from "./common";
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { ScrollablePane } from '@fluentui/react/lib/components/ScrollablePane/ScrollablePane';
import { ScrollbarVisibility } from '@fluentui/react/lib/components/ScrollablePane/ScrollablePane.types';
import { DialogData, CasDialogType } from './DialogData';

interface IProviderState {
  columns: IColumn[];
  items: IRequestItem[];
  selectionDetails: string;
  announcedMessage?: string;
  isSaving?: boolean;
  selectedFilter?: string | number;
  filterText?: string;
}

const refreshCallback = () => {}

export class Provider extends React.Component<{}, IProviderState> {
  private _selection: Selection;
  private _allItems: IRequestItem[] = [];
  private _maxCreatedDate?: string;

  constructor(props: {}) {
    super(props);

    initializeIcons();
    this._selection = new Selection({
      canSelectItem: this._canSelectItem.bind(this),
      onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() }),
    });
   
    // Set to initial state
    this._selection.setAllSelected(false);

    columns.push (
      { key: 'column11',
      name: '',                              
      fieldName: '',            
      minWidth: 10,
      maxWidth: 10,                
      onRender: (item: IRequestItem) => {
        return this._canSelectItem(item) ? 
          "" : <DialogData type={CasDialogType.view} requests={[item]} refresh={refreshCallback} />;
      },
      isResizable: false, } 
    )

    this.state = {
      items: this._allItems,
      columns: columns,
      selectionDetails: this._getSelectionDetails(),
      isSaving: false,
      selectedFilter: filterFields.msnfpItemName,
    };
    
  }

  async componentDidMount() {
    this.setState({ isSaving: true });
    this._allItems = await getRequestsAsync() as IRequestItem[];  
    this._maxCreatedDate = getMaxCreatedon (this._allItems);
    this.setState({ items: this._allItems,
                    isSaving: false });
  }

  private _canSelectItem(item: any) : boolean {
    return item.msnfpItemStatus.trim().toLocaleLowerCase() !== Status.Accepted.toLocaleLowerCase();
  }

  public render(): JSX.Element {
    const { items, columns, isSaving, selectedFilter, filterText } = this.state;

    const refreshCallback = async () => {
      this._allItems = await getRequestsAsync() as IRequestItem[];
  
      const { selectedFilter, filterText } = this.state;
      this.setState({ items: filter (this._allItems, selectedFilter, filterText) });
      this._selection.setAllSelected(false);
    }

    return (
        <div className="ms-Grid">
          <div>{ isSaving ? (<ISpinner spinnerText= "Retrieving data..." />) : ( <div> </div> ) } </div>  
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm3 ms-x3">
              <Dropdown
                className={ChildClass}
                label="Select a filter"
                defaultSelectedKey={selectedFilter}
                onChange={this._onChange}
                options={filterOptions}
                selectedKey={selectedFilter}
              />
            </div>
            <div className="ms-Grid-col ms-sm3 ms-x3">
                <TextField
                    className={ChildClass}
                    label="Filter text:"
                    onChange={this._onFilter}
                    defaultValue={filterText}
                    value={filterText}
                  />
                  <Announced message={`Number of items after filter applied: ${items.length}.`} />
            </div>                
            <div className="ms-Grid-col ms-sm3 ms-x3" style={{ marginTop: 30}}>
            { this._selection.getSelectedCount() > 0 ? (              
                <DialogData requests={this._selection.getSelection() as IRequestItem[]} type={CasDialogType.save} 
                    buttonText={this._getSelectionDetails()} refresh={refreshCallback} /> )
                : ( <div> </div> ) }
            </div>
            <div className="ms-Grid-col ms-sm3 ms-x3">
              <Label
                className={ChildClass} style= {{ marginTop:20 }}>{this._maxCreatedDate} 
              </Label>
            </div>     
          </div> 

        <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto} style={{height: '600', marginTop: '200', marginLeft: '75', marginRight: '75'}}>
        <MarqueeSelection selection={this._selection}>
          <DetailsList
            compact={true}
            items={items}
            columns={columns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            selection={this._selection}
            selectionPreservedOnEmptyClick={true}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            onRenderDetailsHeader={onRenderDetailsHeader}
            checkButtonAriaLabel="select row"
            onColumnHeaderClick={this._onColumnClick}
          />
        </MarqueeSelection>
        </ScrollablePane>

      </div>
    );
  }

  private _getSelectionDetails(): string {
    const selectionCount = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return 'No item selected';
      case 1:
        return 'Accept 1 Request';
      default:
        return `Accept ${selectionCount} Requests`;
    }
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

