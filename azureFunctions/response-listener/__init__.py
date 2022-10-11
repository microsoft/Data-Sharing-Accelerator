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
            req_body = json.loads(event.get_body().decode('utf-8'))
            
            cursor.execute("INSERT INTO {} (expectedDate, methodDelivery, poc, needsToPickUp, addressToPickUp, facilityHoursPickUp, poOrRelease, productType, expirationDate, unitType, quantityByUnit, quantityDimensionPallets, weightProduct, retailValue) VALUES ('{}', '{}', '{}', {}, '{}', '{}', '{}', '{}', '{}', '{}', {}, {}, {}, {});".format("MSNFP_RESPONSE_DETAILS",req_body.get('expectedDate', '')  or '', req_body.get('methodDelivery', '')  or '', req_body.get('poc', '')  or '', int(req_body.get('needsToPickUp', 0))  or 0, req_body.get('addressToPickup', '') or '', req_body.get('facilityHoursPickup', '') or '', req_body.get('poOrRelease', '') or '', req_body.get('productType', '') or '', req_body.get('expirationDate', '') or '', req_body.get('unitType', '') or '', req_body.get('quantityByUnit', 0) or 0, req_body.get('quantityDimensionPallets', 0) or 0, req_body.get('weightProduct', 0) or 0, req_body.get('retailValue', 0) or 0))
            cursor.execute("INSERT INTO {} (hashstring,partner,createdDate, response_details_id) VALUES ('{}', '{}', '{}', {});".format("MSNFP_NOTIFICATIONS",req_body['hashString'],req_body['partner'],req_body['createdDate'], cursor.lastrowid))
            
            conn.commit()

            logging.info('Python EventHub trigger processed an event: %s', event.get_body().decode('utf-8'))
    except Exception as e:
        logging.error(str(e))