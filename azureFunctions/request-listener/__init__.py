import logging
import pymssql
import azure.functions as func
import os
import json

def main(events: func.EventHubEvent):
    try:
        conn = pymssql.connect(os.environ['dbServer'], os.environ['dbUser'], os.environ['dbPassword'], os.environ['dbName'])
        cursor = conn.cursor(as_dict=True)

        for event in events:
            for req_body in json.loads(event.get_body().decode('utf-8')):
                try:
                    cursor.execute("INSERT INTO {} (createdOn, msnfp_description, msnfp_georeference, msnfp_itemname, msnfp_itemnumber, msnfp_itemstatus, msnfp_itemtype, deliverOn, msnfp_latitude, msnfp_longitude, createdby, hashstring) VALUES ('{}', '{}', '{}', '{}', {}, '{}', '{}', '{}','{}', '{}', '{}', '{}');".format("MSNFP_ITEM_REQUEST", req_body.get('createdOn', '')  or '', req_body.get('msnfp_description', '')  or '', req_body.get('msnfp_georeference', '')  or '', req_body.get('msnfp_itemname', '')  or '', int(req_body.get('msnfp_itemnumber', 0)) or 0, req_body.get('msnfp_itemstatus', '') or '', req_body.get('msnfp_itemtype', '') or '', req_body.get('deliverOn', '') or '', req_body.get('msnfp_latitude', '') or '', req_body.get('msnfp_longitude', '') or '', req_body.get('createdby', '') or '', req_body.get('hashstring', '') or ''))
                    conn.commit()
                except Exception as e:
                    logging.info("Label failed: " + str(e))

            logging.info('Python EventHub trigger processed an event: %s', event.get_body().decode('utf-8'))
    except Exception as e:
        logging.error(str(e))