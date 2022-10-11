import logging
from io import BytesIO
import azure.functions as func
import pandas as pd
import hashlib
import os
from azure.eventhub import EventHubProducerClient, EventData


def main(myblob: func.InputStream):
    try:
        df = pd.read_csv(BytesIO(myblob.read()), delimiter=";")

        df = df.rename(columns={
            "Date Submitted": "createdOn",
            "Record ID": "msnfp_description",
            "Location Name": "msnfp_georeference",
            "Request Description": "msnfp_itemname",
            "Quantity": "msnfp_itemnumber",
            "Status": "msnfp_itemstatus",
            "Unit": "msnfp_itemtype",
            "Deliver By": "deliverOn",
        })

        df["msnfp_latitude"] = df["Deliver to"].apply(lambda d: d.split(',')[0])
        df["msnfp_longitude"] = df["Deliver to"].apply(lambda d: d.split(',')[1].strip())
        df["createdby"] = os.environ['cascadiaNamespace']

        df.drop(['Request Type', 'Deliver to', 'Request Fulfilled'], axis=1, inplace=True)
        df["hashstring"] = list(map(lambda x: hashlib.sha256('-'.join([str(col_value) for col_value in x]).encode('utf-8')).hexdigest(), df[df.columns].values))
        df = df[df["msnfp_itemstatus"] == "Open"]
        
        client = EventHubProducerClient.from_connection_string(os.environ['eventhubConnectionString'], eventhub_name='requests')

        event_data_batch = client.create_batch()
        event_data_batch.add(EventData(df.to_json(orient='records')))

        with client:
            client.send_batch(event_data_batch)
        
        logging.info(f"Python blob trigger function processed blob \n"
                 f"Name: {myblob.name}\n"
                 f"Blob Size: {myblob.length} bytes")
    except Exception as e:
        logging.error(str(e))

    
    
