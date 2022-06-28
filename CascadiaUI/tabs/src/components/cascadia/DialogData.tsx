import React, {useEffect, useState} from 'react';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton, DefaultButton, IconButton } from '@fluentui/react/lib/Button';
import { useBoolean } from '@fluentui/react-hooks';
import { IIconProps } from '@fluentui/react';
import { IRequestItem, IAcceptedItem } from './IRequestItem';
import { ISpinner } from "../Common/l2hSpinner";
import * as axios from "axios";
import { TeamsUserCredential } from "@microsoft/teamsfx";
import { Stack, IStackStyles, IStackProps } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { DatePicker, mergeStyleSets, defaultDatePickerStrings } from '@fluentui/react';
import { Toggle } from '@fluentui/react/lib/Toggle';

const partner = process.env.REACT_APP_PARTNER_NAME || "";
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || "";
const functionName = "accepted";

const modelProps = {
  isBlocking: true,
  styles: { main: { maxWidth: 780, Width: 650 } },
};

const dialogContentProps = {
  type: DialogType.largeHeader,
  title: 'Accept Requests?',
  subText: 'Would you like to accept the requested item(s)?',
};

const viewDialogContentProps = {
  type: DialogType.largeHeader,
  title: 'Request - Additional Details',
  subText: '',
};

export enum CasDialogType {save, edit, view}

interface IMessageProps {
    requests: IRequestItem[],
    type: CasDialogType,
    buttonText?: string,
    refresh: () => void,
}

interface IViewProps {
    acceptedItem?: IAcceptedItem,
}

const styles = mergeStyleSets({
  root: { selectors: { '> *': { marginBottom: 15 } } },
  control: { maxWidth: 300, marginBottom: 15 },
});

const stackTokens = { childrenGap: 50 };
const stackStyles: Partial<IStackStyles> = { root: { width: 650 } };
const columnProps: Partial<IStackProps> = {
  tokens: { childrenGap: 15 },
  styles: { root: { width: 300 } },
};

const ViewStack: React.FunctionComponent<IViewProps> = item => {
  const { acceptedItem } = item;

  return (
    <Stack horizontal tokens={stackTokens} styles={stackStyles}>
      <Stack {...columnProps}>
        <TextField label="Hash String" readOnly defaultValue={acceptedItem?.hashString} />
        <TextField label="Address to Pickup" readOnly defaultValue={acceptedItem?.addressToPickup} />
        <TextField label="Expected Date" readOnly defaultValue={acceptedItem?.expectedDate} />
        <TextField label="Expiration Date" readOnly defaultValue={acceptedItem?.expirationDate} />
        <TextField label="Facility Hours PickUp" readOnly defaultValue={acceptedItem?.facilityHoursPickUp} />
        <TextField label="Method Delivery" readOnly defaultValue={acceptedItem?.methodDelivery} />
        <TextField label="Needs To Pickup" readOnly defaultValue={acceptedItem?.needsToPickup?.toString()} />
        <TextField label="PO OrRelease" readOnly defaultValue={acceptedItem?.poOrRelease} />
      </Stack>
      <Stack {...columnProps}>
        <TextField label="POC" readOnly defaultValue={acceptedItem?.poc} />
        <TextField label="Product Type" readOnly defaultValue={acceptedItem?.productType} />
        <TextField label="Quantity by Unit" readOnly defaultValue={acceptedItem?.quantityByUnit?.toString()} />
        <TextField label="Quantity Dimension Pallets" readOnly defaultValue={acceptedItem?.quantityDimensionPallets?.toString()} />
        <TextField label="Retail Value" readOnly defaultValue={acceptedItem?.retailValue?.toString()} />
        <TextField label="Unit Type" readOnly defaultValue={acceptedItem?.unitType?.toString()} />
        <TextField label="Weight Product" readOnly defaultValue={acceptedItem?.weightProduct?.toString()} />
      </Stack>
    </Stack>
)}

export const DialogData: React.FunctionComponent<IMessageProps> = items => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [isSaving, setSaving] = useState(false);
  const [acceptedItem, setAcceptedItem] = useState<IAcceptedItem>();
  const { requests, type, buttonText } = items;
  //const [ errorText, setErrorText] = useState("");

  const saveIcon: IIconProps = { iconName: 'Save' };
  const cancelIcon: IIconProps = { iconName: 'Cancel' };
  const acceptIcon: IIconProps = { iconName: 'Accept', };
  const editIcon: IIconProps = { iconName: 'Edit' };
  const viewIcon: IIconProps = { iconName: 'View' };

  const copyArray = (hash: string, additionalData: IAcceptedItem) : IAcceptedItem | undefined => {
      return ({
        hashString: hash,
        createdDate: new Date ().toISOString(),
        partner: partner,
        expectedDate: additionalData?.expectedDate,
        expirationDate: additionalData?.expirationDate,
        methodDelivery: additionalData?.methodDelivery,
        poc: additionalData?.poc,
        addressToPickup: additionalData?.addressToPickup,
        facilityHoursPickUp: additionalData?.facilityHoursPickUp,
        poOrRelease: additionalData?.poOrRelease,
        productType: additionalData?.productType,
        unitType: additionalData?.unitType,
        needsToPickup: additionalData.needsToPickup,
        quantityByUnit: additionalData.quantityByUnit,
        quantityDimensionPallets: additionalData.quantityDimensionPallets,
        weightProduct: additionalData.weightProduct,
        retailValue: additionalData.retailValue,
      }) as IAcceptedItem;
  }

  const save = async (additional: any): Promise<any> => {
    try {
        setSaving(true);
        
        const selectedRequests = requests as IRequestItem[];
        const acceptedRequests = selectedRequests?.map(x => copyArray(x.hashString, additional));     
  
        const credential = new TeamsUserCredential();
        const accessToken = await credential.getToken("");
        const requestUrl = `${apiEndpoint}/api/${functionName}`;
        const response = await axios.default.post(requestUrl, JSON.stringify(acceptedRequests), {
          headers: {
            "content-type": "application/json",
            "accept": "text/plain",
            authorization: "Bearer " + accessToken?.token || "",
          },      
        });
        alert ('Requests successfully saved');
        //callback to refresh data
        items.refresh ();
        return response.data;     
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
      alert ('Requests are not saved');
      throw err;
      } finally {
        setSaving(false);
        toggleHideDialog();
        return;
      }
  }

  useEffect(() => {
    view ();
  }, [acceptedItem])

  const view = async (): Promise<any> => {
    if (type !== CasDialogType.view) return;
      const hashString = requests[0].hashString;
      let rtnData: IAcceptedItem[] | undefined;
      try { 
          const credential = new TeamsUserCredential();
          const accessToken = await credential.getToken("");
          const requestUrl = `${apiEndpoint}/api/${functionName}/${hashString}`;
          const response = await axios.default.get(requestUrl, {
            headers: {
              authorization: "Bearer " + accessToken?.token || "",
            },      
          });
          setAcceptedItem(response.data as IAcceptedItem);
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
        } finally {
          return rtnData;
        }
  }

  const useInput = (initialValue: any) => {
    const [value, setValue] = useState(initialValue);
    const handleChange = (event: any) => {
        setValue(event.target.value);
    };

    return {
        value,
        onChange: handleChange
    };
  };

  const InputForm = () => {  
    const poc = useInput(""); 
    const address = useInput("");
    const delivery = useInput("");
    const facility = useInput("");    
    const [pickup, { toggle: togglePickup }] = useBoolean(true);
    const release = useInput("");    
    const product = useInput("");
    const unit = useInput("");
    const quantity = useInput(0);
    const pallets = useInput(0);
    const weight = useInput(0);
    const retail = useInput(0);
    const [expectedDate, setExpectedDate] = useState(new Date());
    const [expirationDate, setExpirationDate] = useState(new Date());

    const handleExpectedDate = (e: any) => {
      setExpectedDate(e);
    }

    const handleExpirationDate = (e: any) => {
      setExpirationDate(e);
    }
    
    const handlePickup = (e: any) => {
      togglePickup();
    }
    const validateNumbers = () => {
      if (isNaN(quantity.value) || isNaN(pallets.value) || isNaN(weight.value) || isNaN(retail.value)) {
        alert ("Please enter numerical values for Quantity, Pallets, Weight, Retail");
        return false;
      }
      else return true;
    }

    const saveForm = (event: any) => {
        event.preventDefault();
        if (validateNumbers()) {
        const additionalData: IAcceptedItem = ({
          poc: poc.value,
          addressToPickup: address.value,
          expectedDate: expectedDate.toISOString(),
          expirationDate: expirationDate.toISOString(),
          methodDelivery: delivery.value,
          facilityHoursPickUp: facility.value,
          needsToPickup: pickup,
          unitType: unit.value,
          poOrRelease: release.value,
          productType: product.value,
          quantityByUnit: parseInt(quantity.value),
          quantityDimensionPallets: parseInt(pallets.value),
          weightProduct: parseInt(weight.value),
          retailValue: parseInt(retail.value),
        });
        save (additionalData);
      }
    };

    return (
      <form onSubmit={saveForm}>
        <Stack horizontal tokens={stackTokens} styles={stackStyles}>
          <Stack {...columnProps}>
            <TextField label="Address to Pickup" placeholder="Address to Pickup" {...address} />
            <DatePicker placeholder="Expected Date" label="Expected Date"
                ariaLabel="Select a expected date"
                className={styles.control}
                strings={defaultDatePickerStrings}
                onSelectDate={handleExpectedDate} value={expectedDate} />
            <DatePicker placeholder="Expiration Date" label="Expiration Date"
                ariaLabel="Select a expiration date"
                className={styles.control}
                strings={defaultDatePickerStrings}
                onSelectDate={handleExpirationDate} value={expirationDate} />
            <TextField label="Facility Hours PickUp" placeholder="Facility Hours PickUp" {...facility} />
            <TextField label="Method Delivery" placeholder="Method Delivery" {...delivery} />
            <Toggle label="Needs To Pickup" 
                defaultChecked onText="Need to Pickup" 
                offText="Do not need to pickup" 
                onChange={handlePickup} />
            <TextField label="PO Or Release" placeholder="PO Or Release" {...release} />
          </Stack>
          <Stack {...columnProps}>
            <TextField label="POC" placeholder="POC" {...poc} />
            <TextField label="Product Type" placeholder="Product Type" {...product} />
            <TextField label="Unit Type" placeholder="Unit Type" {...unit} />
            <TextField label="Quantity by Unit" placeholder="Quantity by Unit" {...quantity} name="quantity"/>
            <TextField label="Quantity Dimension Pallets" placeholder="Quantity Dimension Pallets" {...pallets} name="pallets"/>
            <TextField label="Weight Product" placeholder="Weight Product" {...weight} name="weight"/>
            <TextField label="Retail Value" placeholder="Retail Value" {...retail} name="retail"/>
          </Stack>      
        </Stack>
        <br></br>
            <PrimaryButton type="submit" text="Save" iconProps={saveIcon} />
            <DefaultButton onClick={toggleHideDialog} text="Close" iconProps={cancelIcon} />
      </form>
    );
  };

  return (
    <>
      { isSaving ? (<ISpinner spinnerText= "Saving..." />) : ( <div> </div> ) }   
      { type === CasDialogType.save ? 
          <DefaultButton onClick={toggleHideDialog} text={buttonText} iconProps={acceptIcon}/> :
        type === CasDialogType.edit ?
          <IconButton onClick={toggleHideDialog} iconProps={editIcon}></IconButton> :
          <IconButton onClick={toggleHideDialog} iconProps={viewIcon}></IconButton>
      }

      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={type === CasDialogType.view ? viewDialogContentProps : dialogContentProps}
        modalProps={modelProps} minWidth={750}>

        { type === CasDialogType.save ? InputForm () : <ViewStack acceptedItem={acceptedItem}></ViewStack> }

        <DialogFooter>
        { type === CasDialogType.view ? 
             <DefaultButton onClick={toggleHideDialog} text="Close" iconProps={cancelIcon} /> : "" }
        </DialogFooter>
      </Dialog>
    </>
  );
};