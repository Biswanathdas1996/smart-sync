import React from 'react';

// Sample XML data
const xmlData = `
<Address>
  <Country>IN</Country>
  <AddressLine1>608, Mandi Kesar Ganj</AddressLine1>
  <AddressLine2>Ludhiana (Pb)</AddressLine2>
  <City>Ludhiana</City>
  <PostalCode>2724491</PostalCode>
  <StateProvince>Punjab</StateProvince>
</Address>
`;

// Function to format XML for display
const formatXml = (xml) => {
  return xml.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

const XmlDisplay = (xmlData) => {
    print("======>",xmlData)
  return (
    <div>
      <h2>XML Data</h2>
      <pre>{formatXml(xmlData)}</pre>
    </div>
  );
};

export default XmlDisplay;
