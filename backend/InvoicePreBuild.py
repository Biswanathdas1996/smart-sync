from flask import Flask, jsonify
from flask import request,send_file, make_response
from flask_cors import CORS, cross_origin
import os
import json


def make_readable_address(address):
    readable_address = ""
    if address:
        address_value = address.value
        readable_address = f"{address_value.house_number} {address_value.road}, {address_value.city}, {address_value.state}, {address_value.postal_code}, {address_value.country_region}"
    else:
        readable_address = "" 
    return readable_address

def make_readable_amount(amount):
    readable_amount = ""
    if amount:
        amount_value = amount.value
        readable_amount = {
            "amount":amount_value.amount if amount_value else "",
            "symbol":amount_value.symbol if amount_value else "",
            "code":amount_value.code if amount_value else ""
        }
    else:
        readable_amount = ""
    return readable_amount 

def make_readable_currency(amount):
    readable_amount = ""
    if amount:
        amount_value = amount.value
        readable_amount = {
            "symbol":amount_value.symbol,
            "code":amount_value.code
        }
    else:
        readable_amount = ""
    return readable_amount 

def formated_date(date):
    if date != "":
        return date.value.strftime("%d/%m/%Y") if date else ""

from collections import namedtuple
DocumentField = namedtuple('DocumentField', ['value_type', 'value', 'content', 'confidence'])
CurrencyValue = namedtuple('CurrencyValue', ['amount', 'symbol', 'code'])

def make_readable_tax_details(data):
    result = ""
    for item in data:
        if 'Amount' in item.value:
            amount = item.value['Amount'].value.amount
            result += f"Amount: {amount}\n"
        if 'Rate' in item.value:
            rate = item.value['Rate'].value
            result += f"Rate: {rate}\n"
        if 'IGST' in item.content:
            igst = item.content.split('\n')[0]  # Extracting the first line
            result += f"Type: {igst}\n"
    return result.strip()

    



def analyze_invoice(path_to_sample_documents, output_folder):
    

    # [START analyze_invoices]
    from azure.core.credentials import AzureKeyCredential
    from azure.ai.formrecognizer import DocumentAnalysisClient

    endpoint = "https://eastasia.api.cognitive.microsoft.com"
    key = "43eb19744b904239b1d7a255e5621382"

    document_analysis_client = DocumentAnalysisClient(
        endpoint=endpoint, credential=AzureKeyCredential(key), connection_verify=False
    )
    with open(path_to_sample_documents, "rb") as f:
        poller = document_analysis_client.begin_analyze_document(
            "prebuilt-invoice", document=f
        )
    invoices = poller.result()

    for idx, invoice in enumerate(invoices.documents):
        
        print(f"--------Analyzing invoice #{idx + 1}--------")
        
        vendor_name = invoice.fields.get("VendorName")
        vendor_address = invoice.fields.get("VendorAddress")
        readable_vendor_address = make_readable_address(vendor_address)
       

        vendor_address_recipient = invoice.fields.get("VendorAddressRecipient")
        customer_name = invoice.fields.get("CustomerName")
        customer_id = invoice.fields.get("CustomerId")

        customer_address = invoice.fields.get("CustomerAddress")
        readable_customer_address = make_readable_address(customer_address)
        

        customer_address_recipient = invoice.fields.get("CustomerAddressRecipient")
        invoice_id = invoice.fields.get("InvoiceId")

        invoice_date = invoice.fields.get("InvoiceDate")
        formatted_invoice_date = invoice_date.value.strftime("%d/%m/%Y") if invoice_date else ""

        invoice_total = invoice.fields.get("InvoiceTotal")
        readable_invoice_total = make_readable_amount(invoice_total)
        
        invoice_total_due = invoice.fields.get("AmountDue")
        readable_invoice_total_due = make_readable_amount(invoice_total_due)

        readable_invoice_currency = make_readable_currency(invoice_total)
        


        # due_date = formated_date(invoice.fields.get("DueDate")) 

        
        purchase_order = invoice.fields.get("PurchaseOrder")
        billing_address_recipient = invoice.fields.get("BillingAddressRecipient")

        billing_address = invoice.fields.get("BillingAddress")
        readable_billing_address = make_readable_address(billing_address)
        

        shipping_address = invoice.fields.get("ShippingAddress")
        readable_shipping_address = make_readable_address(shipping_address)
        


        shipping_address_recipient = invoice.fields.get("ShippingAddressRecipient")
        subtotal = invoice.fields.get("SubTotal")
        readable_subtotal = make_readable_amount(subtotal)
        

        total_tax = invoice.fields.get("TotalTax") 
        readable_total_tax = make_readable_amount(total_tax)
        

        previous_unpaid_balance = make_readable_amount(invoice.fields.get("PreviousUnpaidBalance"))    
        amount_due = make_readable_amount(invoice.fields.get("AmountDue"))   

        service_start_date = invoice.fields.get("ServiceStartDate") 
        formatted_service_start_date = service_start_date.value.strftime("%d/%m/%Y") if service_start_date else ""   
        service_end_date = invoice.fields.get("ServiceEndDate")
        formatted_service_end_date = service_end_date.value.strftime("%d/%m/%Y") if service_end_date else "" 

        service_address = make_readable_address(invoice.fields.get("ServiceAddress"))    
        
        service_address_recipient = invoice.fields.get("ServiceAddressRecipient")    
        remittance_address = invoice.fields.get("RemittanceAddress")    
        remittance_address_recipient = invoice.fields.get("RemittanceAddressRecipient")
        CustomerTaxId = invoice.fields.get("CustomerTaxId")
        VendorTaxId = invoice.fields.get("VendorTaxId")
        taxDetails = invoice.fields.get("TaxDetails")
        # print("====================taxDetails=======>",taxDetails.value)
        # print("end==========>")
        # return
        readable_taxDetails = make_readable_tax_details(taxDetails.value) if taxDetails else ""
     
        # print("====================readable_taxDetails=======>",readable_taxDetails)
        

    invoice_data = {       
        "Document_number": invoice_id.value if invoice_id else "",
        "Amount_in_INR": "--",
        "Currency": readable_invoice_currency if invoice_total else "",
        "customer_name": customer_name.value if customer_name else "",
        "vendor_name": vendor_name.value if vendor_name else "",
        "Document_Date": formatted_invoice_date if invoice_date else "",
        "Amount_in_Foreign_Currency": readable_invoice_total_due if readable_invoice_total_due else readable_invoice_total,
        "Conversion_rate": "--",
        "Effective_TDS_Rate": "--",
        "TDS_amount": "--",
        "items": []
    }

    for idx, item in enumerate(invoice.fields.get("Items").value):
        UnitPrice = item.value.get("UnitPrice") 
        readable_UnitPrice = ""
        if UnitPrice:
            UnitPrice_value = UnitPrice.value
            readable_UnitPrice = {
                "amount":UnitPrice_value.amount,
                "symbol":UnitPrice_value.symbol,
                "code":UnitPrice_value.code
            }
        else:
            readable_UnitPrice = ""

        Amount = item.value.get("Amount") 
        readable_Amount = ""
        if Amount:
            Amount_value = Amount.value
            readable_Amount = {
                "amount":Amount_value.amount if Amount_value else "",
                "symbol":Amount_value.symbol if Amount_value else "",
                "code":Amount_value.code if Amount_value else ""
            }
        else:
            readable_Amount = ""
        
        item_data = {
            "item_description": item.value.get("Description").value if item.value.get("Description") else "",
            # "item_quantity": item.value.get("Quantity").value if item.value.get("Quantity") else "",
            # "unit": item.value.get("Unit").value if item.value.get("Unit") else "",
            # "unit_price": readable_UnitPrice if item.value.get("UnitPrice") else "",
            # "product_code": item.value.get("ProductCode").value if item.value.get("ProductCode") else "",
            # "item_date": item.value.get("Date").value if item.value.get("Date") else "",
            # "tax": item.value.get("Tax").value if item.value.get("Tax") else "",
            "amount": readable_Amount if item.value.get("Amount") else ""
        }
        invoice_data["items"].append(item_data)

    # invoice_json = jsonify(invoice_data)
    print("invoice_data",invoice_data)
    invoice_json = json.dumps(invoice_data)
    print(invoice_json)
    
    
    
    with open(output_folder, "w") as f:
        f.write(invoice_json)
    return invoice_json

  

def processWithInvoicePreBuild(input_folder, output_folder):
    for filename in os.listdir(input_folder):
        if filename.endswith(".png"):
            file_path = os.path.join(input_folder, filename)

            output_file = os.path.join(output_folder, f"{os.path.splitext(filename)[0]}.json") 

            analyze_invoice(file_path, output_file)


# input_folder = "scenario/ooooooooooo/input"  
# output_folder = "scenario/ooooooooooo/output/progress"  
# processWithInvoicePreBuild(input_folder, output_folder)