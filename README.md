# IS4302 online shopping website_backend

## About
Our project is a online shopping website and built on the permissioned Hyperledger Fabric blockchain framework to ensure transparency and non-repudiation in e-commerce application. Our project utilize Hyperledger Composer and Firebase as backend, ReactJS and ExpressJS as front end.

## REST server link :

Consumer:
http://52.15.98.17:3000 for cons_admin@online-shopping-network 

Supplier:
http://52.15.98.17:3001 for sup_admin@online-shopping-network 

Shipping partner:
http://52.15.98.17:3002 for sp_admin@online-shopping-network

Backend:
http://52.15.98.17:8010

Playground:
http://52.15.98.17:8080

If you prefer to run this project locally, please do these:

`node index.js` to start server

Server runs at port `8010`

Test via `Postman`

## Test Flow
After you are done setting up. You can follow the test flow crafted for you to test out the entire functionailities that are provided. Note it is recommended that you use Incognito mode in google Chrome to do the testing to avoid caching issue. 

Please use the .card (Participants) that are already created in the blockchain. 

1. Log in as a Supplier , create new goods object.
2. Go to Consumer webpage, make an order on the newly created goods object. (Consumer should note down the orderId that is displayed for future reference. Ideally, this would be emailed to the relevant party.)
3. Go to Supplier webpage, carry out SupplierHandover transaction. 
4. Log in as Shipping Partner, carry out Shipping Partner Endorse Handover transaction. Status has changed to inTransit, after Shipping partner endorse. (At this point, the goods are handover to the Shipping Partner, and they are liable for any damage to the goods.)
5. Continue from Shipping partner webpage, carry out Endorse Delivery transaction. 
6. Go to Consumer webpage, carry out Endorse Delivery transaction. (At this point, goods is delivered to the consumer. Shipping Partner can no longer be held responsible. Consumer should check for damaged goods before endorsing delivery.) 

## Enquires
For any enquires or problem faced when deploying please contact Ng Zi Liang at e0176934@u.nus.edu 
