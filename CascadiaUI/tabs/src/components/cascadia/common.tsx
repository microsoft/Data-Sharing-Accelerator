import { TeamsUserCredential } from "@microsoft/teamsfx";
import * as axios from "axios";
import { IColumn } from '@fluentui/react/lib/DetailsList';
import { IRequestItem } from "./IRequestItem";
import { IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import { Sticky } from '@fluentui/react/lib/components/Sticky/Sticky';
import { StickyPositionType } from '@fluentui/react/lib/components/Sticky/Sticky.types';
import { IRenderFunction } from '@fluentui/react/lib/Utilities';
import { IDetailsHeaderProps } from '@fluentui/react/lib/components/DetailsList/DetailsList.types';

const partner = process.env.REACT_APP_PARTNER_NAME || "";
const functionName = process.env.REACT_APP_API_NAME || "requests";
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || "myFunc";

export const columns: IColumn[] = [
  { key: 'column1', 
    name: 'Description', 
    fieldName: 'msnfpDescription', 
    minWidth: 50, 
    maxWidth: 100, 
    isResizable: true },
  { key: 'column2', 
    name: 'Quantity', 
    fieldName: 'msnfpItemNumber', 
    minWidth: 50, 
    maxWidth: 75, 
    isResizable: true },
  { key: 'column3', 
    name: 'Item Name', 
    fieldName: 'msnfpItemName', 
    minWidth: 100, 
    maxWidth: 200, 
    isResizable: true },
  { key: 'column4', 
    name: 'Request Type', 
    fieldName: 'msnfpItemType', 
    minWidth: 100, 
    maxWidth: 200, 
    isResizable: true },
  { key: 'column5', 
    name: 'Status', 
    fieldName: 'msnfpItemStatus', 
    minWidth: 50, 
    maxWidth: 100, 
    isSorted: true,
    isResizable: true },
  { key: 'column6', 
    name: 'Location', 
    fieldName: 'msnfpGeoreference', 
    minWidth: 100, 
    maxWidth: 200, 
    isResizable: true },      
  { key: 'column7', 
    name: 'Date Submitted', 
    fieldName: 'createdOn', 
    minWidth: 100, 
    maxWidth: 200, 
    isResizable: true },    
  { key: 'column8', 
    name: 'Accepted By', 
    fieldName: 'acceptedBy', 
    minWidth: 75, 
    maxWidth: 100, 
    isResizable: true },  
  { key: 'column9', 
    name: 'Created By', 
    fieldName: 'createdBy', 
    minWidth: 75, 
    maxWidth: 100, 
    isResizable: true },      
];

function sort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
    const key = columnKey as keyof T;
    return items.sort((a, b) => {
      if (a[key] === null) return 1;
      if (b[key] === null) return -1;
      if (a[key] === b[key]) return 0;     

      let fa = (""+ a[key]).trim().toLowerCase(),
          fb = (""+ b[key]).trim().toLowerCase();
    return ( (isSortedDescending ? (fa < fb) : (fa > fb) ) ? 1 : -1);
  });
};

export enum filterFields {msnfpDescription, msnfpItemName, msnfpItemType, msnfpGeoreference, acceptedBy, createdBy, msnfpItemStatus};

export const filterOptions: IDropdownOption[] = [
  { key: filterFields.msnfpItemName, text: 'Item Name' },
  { key: filterFields.msnfpItemType, text: 'Request Type' },
  { key: filterFields.msnfpGeoreference, text: 'Location' },
  { key: filterFields.acceptedBy, text: 'Accepted By' },
  { key: filterFields.createdBy, text: 'Created By' },
  { key: filterFields.msnfpItemStatus, text: 'Status' },
  { key: filterFields.msnfpDescription, text: 'Description' },
];

export enum Status {
  Accepted = "Accepted",
  Open = "Open",
}

export function filter(items: IRequestItem[], columnKey?: string | number, text?: string): IRequestItem[] {
  switch (columnKey)
  {
    case filterFields.msnfpItemName:
      return text ? items.filter(i => i.msnfpItemName ? i.msnfpItemName.toLowerCase().indexOf(text) > -1 : "") : items;
    case filterFields.msnfpItemType:
      return text ? items.filter(i => i.msnfpItemType ? i.msnfpItemType.toLowerCase().indexOf(text) > -1 : "") : items;
    case filterFields.msnfpGeoreference:
      return text ? items.filter(i => i.msnfpGeoreference ? i.msnfpGeoreference.toLowerCase().indexOf(text) > -1 : "") : items; 
    case filterFields.acceptedBy:
      return text ? items.filter(i => i.acceptedBy ? i.acceptedBy.toLowerCase().indexOf(text) > -1 : "") : items;
    case filterFields.createdBy:
      return text ? items.filter(i => i.createdBy ? i.createdBy.toLowerCase().indexOf(text) > -1 : "") : items;
    case filterFields.msnfpItemStatus:
        return text ? items.filter(i => i.msnfpItemStatus ? i.msnfpItemStatus.toLowerCase().indexOf(text) > -1 : "") : items;
    default:  
      return text ? items.filter(i => i.msnfpDescription ? i.msnfpDescription.toLowerCase().indexOf(text) > -1 : "") : items;
  }
}

export function getMaxCreatedon (allItems: IRequestItem[]) : string {
    return `Sync Date: ${allItems.reduce((createdOn:Date, val) => {
      const temp: Date = new Date (val.createdOn);
      return (temp > createdOn)? temp : createdOn;
    }, new Date("01/01/20")).toString()}`;
}

export const ChildClass = mergeStyles({
  display: 'block',
  marginBottom: '7px',
  maxWidth: '300px',
});

export async function getRequestsAsync (environment?: string) {
    try {
      const credential = new TeamsUserCredential();
      const accessToken = await credential.getToken("");
      
      const requestUrl = (environment === "p4") ?
           `${apiEndpoint}/api/${functionName}/p4` : `${apiEndpoint}/api/${functionName}/${partner}`;

      const response = await axios.default.get(requestUrl, {
         headers: {
          authorization: "Bearer " + accessToken?.token || "",
        }, 
      });
      var requestItems = response.data as IRequestItem[];
      requestItems = requestItems.map (x => {
        x.createdOn = new Date (x.createdOn).toUTCString()
        return x;
      });
      
      return sort(requestItems, "msnfpItemStatus", false);
    } catch (err: unknown) {
        if (axios.default.isAxiosError(err)) {
        let funcErrorMsg = "";
  
        if (err?.response?.status === 404) {
          funcErrorMsg = `There may be a problem with the deployment of Azure Function App, please deploy Azure Function (Run command palette "Teams: Deploy to the cloud") first before running this App`;
        } else if (err.message === "Network Error") {
          funcErrorMsg =
            "Cannot call Azure Function due to network error, please check your network connection status ";
        } else {
          funcErrorMsg = err.message;
          if (err.response?.data?.error) {
            funcErrorMsg += ": " + err.response.data.error;
          }
        throw new Error(funcErrorMsg);        
        }
      } 
      throw err;
    } 
}

export function getNewColumns (columns: IColumn[], column: IColumn | undefined, items: IRequestItem[]): [IColumn[], IRequestItem[]] {
  if (column === undefined) return [columns, items];
  
  const newColumns: IColumn[] = columns.slice();
  const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
  newColumns.forEach((newCol: IColumn) => {
    if (newCol === currColumn) {
      currColumn.isSortedDescending = !currColumn.isSortedDescending;
      currColumn.isSorted = true;
    } else {
      newCol.isSorted = false;
      newCol.isSortedDescending = true;
    }
  });
  const newItems = sort(items, currColumn.fieldName!, currColumn.isSortedDescending);
  return [newColumns, newItems];
}

export const onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (props, defaultRender) => {
  if (props && defaultRender) {
      return (
          <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced>
              {defaultRender({
                  ...props,
              })}
          </Sticky>
      );
  }
  return null;
};